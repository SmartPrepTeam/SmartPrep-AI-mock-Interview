import os
import uuid
import socketio
from schemas import Offer
from aiortc import RTCPeerConnection, RTCSessionDescription

# Create a Socket.IO client
sio = socketio.Client()

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

    return peer_connection


@sio.on('iceCandidateFromClient')
def add_ice_candidate(iceCandidate):
    ice_candidate = RTCIceCandidate(iceCandidate)
    await peer_connection.addIceCandidate(ice_candidate)



# Connect to the signaling server
sio.connect("https://your-signaling-server.com")

# Keep the connection alive
sio.wait()
