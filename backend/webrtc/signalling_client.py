import os
import uuid
import socketio
from schemas import Offer
from aiortc import RTCPeerConnection, RTCSessionDescription
import tensorflow as tf

# Create a Socket.IO client
sio = socketio.AsyncClient()

# Load the model once when the server starts
model = tf.keras.models.load_model("deeplearning_models/confidence_measuring_model.keras")

# File to store the unique ID
UNIQUE_ID_FILE = "webrtc/server_id.txt"

def get_unique_id():
    """Generate or retrieve a persistent unique ID for this FastAPI server instance."""
    if os.path.exists(UNIQUE_ID_FILE):
        with open(UNIQUE_ID_FILE, "r") as f:
            return f.read().strip()
    else:
        new_id = str(uuid.uuid4())  # Generate a new unique ID
        with open(UNIQUE_ID_FILE, "w") as f:
            f.write(new_id)
        return new_id

FASTAPI_SERVER_ID = get_unique_id()

class VideoTrack(MediaStreamTrack):
    """Custom track to process incoming video frames."""
    kind = "video"

    def __init__(self, track):
        super().__init__()
        self.track = track

    async def recv(self):
        frame = await self.track.recv()
        # Convert to grayscale
        img = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)  
        
        # Resize to 48x48
        img = cv2.resize(img, (48, 48))
        
        # Normalize pixel values to [0, 1]
        img = img / 255.0
        
        # Expand dimensions to match (1, 48, 48, 1) --> Adding batch and channel dimensions
        img = np.expand_dims(img, axis=(0, -1))

        # Send frame to AI model
        result =await process_frame_with_model(img)

        return result  # Return confidence

async def process_frame_with_model(img):
    """AI model processing function."""
    return await asyncio.to_thread(model.predict, img)
 

@sio.event
def connect():
    print("Connected to signaling server!")
    sio.emit("register",{"userId" : FASTAPI_SERVER_ID,"clientType" : "server"})

@sio.event
def disconnect():
    print("Disconnected from signaling server!")

@sio.on('offer')
async def handle_new_offer(data : Offer):
    print("New offer received:", data)
    # creating peer connection
    peer_connection = await create_peer_connection(data)
    # saving offer
    offer = RTCSessionDescription(sdp=data.offer.sdp,type=data.offer.type)
    await peer_connection.setRemoteDescription(offer)
    # making answer
    answer = await peer_connection.createAnswer()  
    await peer_connection.setLocalDescription(answer) 
    data["answer"] = {
        "sdp": answer.sdp,
        "type": answer.type
    }

    # Send the answer to the signaling server
    offerIceCandidates = await sio.call("newAnswer", data)  # Equivalent to emitWithAck()

    # Add received ICE candidates
    for candidate in offerIceCandidates:
        ice_candidate = RTCIceCandidate(**candidate)
        await peer_connection.addIceCandidate(ice_candidate)
        print("======Added Ice Candidate======")

    print(offerIceCandidates)

async def create_peer_connection(offerObj : Offer):
    peer_connection = RTCPeerConnection()
    # adding event handlers on peer connection

    @peer_connection.on("icecandidate")
    async def on_ice_candidate(event):
        print("........Ice candidate found!......")
        print(event)

        if event.candidate:
            await sio.emit("sendIceCandidateToSignalingServer", {
                "iceCandidate": {
                    "candidate": event.candidate.candidate,
                    "sdpMid": event.candidate.sdpMid,
                    "sdpMLineIndex": event.candidate.sdpMLineIndex,
                },
                "iceUserId": OfferObj.OffererId,
                "didIOffer": false,
            })
    
    # handling stream from frontend
    @peer_connection.on("track")
    def on_track(track):
        if track.kind == "video":
            video_track = VideoTrack(track)  # Create instance
            # extracting info from metadata
            metadata = peer_connection.metadata
            question_no = metadata.get("question_no")
            user_id = metadata.get("user_id")
            interview_id = metadata.get("interview_id")
            asyncio.create_task(process_video(video_track,question_no,user_id,interview_id))  # Process video
    
    # handling metadata from frontend
    @pc.on("datachannel")
    def on_datachannel(channel: RTCDataChannel):
        if channel.label == "metadata":
            @channel.on("message")
            def on_message(message):
                metadata = json.loads(message)
                peer_connection.metadata = metadata

    return peer_connection

interviewDetails = {}
async def process_video(video_track,question_no,user_id,interview_id):
     if interview_id not in interviewDetails:
            interviewDetails[interview_id] = {
                "user_id" : user_id,
                "results" : {}
            }
    global interviewDetails
    while True:
        result = await video_track.recv() 
        # {
        #   interview_id : {
        #     user_id : ,
        #      results : {
        #       question_no : [],
        #       question_no : [],
        #       } 
        #       }
        # }
        if question_no not in interviewDetails[interview_id]["results"]:
            interviewDetails[interview_id]["results"][question_no] = []
        interviewDetails[interview_id]["results"][question_no].append(result)

@sio.on('iceCandidateFromClient')
def add_ice_candidate(iceCandidate):
    ice_candidate = RTCIceCandidate(iceCandidate)
    await peer_connection.addIceCandidate(ice_candidate)

