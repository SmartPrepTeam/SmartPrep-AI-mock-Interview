# import os
# import uuid
# import socketio
# from schemas import Offer
# from aiortc import RTCPeerConnection, RTCSessionDescription,RTCDataChannel,RTCIceCandidate
# import tensorflow as tf
# import json
# from aiortc import MediaStreamTrack
# import cv2
# import numpy as np
# import asyncio
# from av import VideoFrame 

# # Dictionary to store active peer connections
# peer_connections = {}

# # Create a Socket.IO client
# sio = socketio.AsyncClient()

# # Load the model once when the server starts
# model = tf.keras.models.load_model("deeplearning_models/confidence_measuring_model.keras")

# # File to store the unique ID
# UNIQUE_ID_FILE = "webrtc/server_id.txt"

# def get_unique_id():
#     """Generate or retrieve a persistent unique ID for this FastAPI server instance."""
#     if os.path.exists(UNIQUE_ID_FILE):
#         with open(UNIQUE_ID_FILE, "r") as f:
#             return f.read().strip()
#     else:
#         new_id = str(uuid.uuid4())  # Generate a new unique ID
#         with open(UNIQUE_ID_FILE, "w") as f:
#             f.write(new_id)
#         return new_id

# FASTAPI_SERVER_ID = get_unique_id()

# class VideoTrack(MediaStreamTrack):
#     """Custom track to process incoming video frames."""
#     kind = "video"

#     def __init__(self, track):
#         super().__init__()
#         self.track = track

#     async def recv(self):
#         frame = await self.track.recv()
#         img = frame.to_ndarray(format="bgr24") 
#         # Convert to grayscale
#         img = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)  
        
#         # Resize to 48x48
#         img = cv2.resize(img, (48, 48))
        
#         # Normalize pixel values to [0, 1]
#         img = img / 255.0
        
#         # Expand dimensions to match (1, 48, 48, 1) --> Adding batch and channel dimensions
#         img = np.expand_dims(img, axis=(0, -1))

#         # Send frame to AI model
#         result =await process_frame_with_model(img)

#         return result  # Return confidence

# async def process_frame_with_model(img):
#     """AI model processing function."""
#     return await asyncio.to_thread(model.predict, img)
 

# @sio.event
# async def connect():
#     print("Connected to signaling server!")
#     await sio.emit("register",{"userId" : FASTAPI_SERVER_ID,"clientType" : "server"})

# @sio.event
# def disconnect():
#     print("Disconnected from signaling server!")

# @sio.on('offer')
# async def handle_new_offer(data : Offer):
#     print("New offer received:", data)
#     # creating peer connection
#     peer_connection = await create_peer_connection(data)
#     peer_connections[data["offererId"]] = peer_connection  # Store it using OffererId
#     # Extract 'offer' correctly as a dictionary
#     offer_dict = data["offer"]
#     # Convert dictionary to RTCSessionDescription object
#     offer = RTCSessionDescription(sdp=offer_dict["sdp"], type=offer_dict["type"])
#     await peer_connection.setRemoteDescription(offer)
#     # making answer
#     answer = await peer_connection.createAnswer()  
#     await peer_connection.setLocalDescription(answer) 
#     data["answer"] = {
#         "sdp": answer.sdp,
#         "type": answer.type
#     }
#     print("Still Connected:", sio.connected)

#     # Send the answer to the signaling server
#     offerIceCandidates = await sio.call("answer", data)  # Equivalent to emitWithAck()

#     # Add received ICE candidates
#     for ice_candidate in offerIceCandidates:
#         candidate_str = ice_candidate.get("candidate")  # Extract the candidate string
#         sdpMid = ice_candidate.get("sdpMid")
#         sdpMLineIndex = ice_candidate.get("sdpMLineIndex")

#         if candidate_str:
#             # Split the candidate string into required attributes
#             parts = candidate_str.split()

#             rtc_candidate = RTCIceCandidate(
#                 component=int(parts[1]),
#                 foundation=parts[0],
#                 ip=parts[4],
#                 port=int(parts[5]),
#                 priority=int(parts[3]),
#                 protocol=parts[2].lower(),  # 'udp' or 'tcp'
#                 type=parts[7],  # 'host', 'srflx', 'relay', etc.
#                 sdpMid=sdpMid,
#                 sdpMLineIndex=sdpMLineIndex
#             )

#             await peer_connection.addIceCandidate(rtc_candidate)
#             print("ICE candidate added successfully!")

# async def create_peer_connection(offerObj : Offer):
#     peer_connection = RTCPeerConnection()
#     # adding event handlers on peer connection
#     @peer_connection.on("icecandidate")
#     async def on_ice_candidate(event):
#         print("........Ice candidate found!......")
#         print(event)

#         if event.candidate:
#             await sio.emit("sendIceCandidateToSignalingServer", {
#                 "iceCandidate": {
#                     "candidate": event.candidate.candidate,
#                     "sdpMid": event.candidate.sdpMid,
#                     "sdpMLineIndex": event.candidate.sdpMLineIndex,
#                 },
#                 "iceUserId": OfferObj.offererId,
#                 "didIOffer": False,
#             })
    
#     # handling stream from frontend
#     @peer_connection.on("track")
#     async def on_track(track):
#         print(f"Received track of kind: {track.kind}")
#         if track.kind == "video":
#             print("processing video stream...")
#             video_track = VideoTrack(track)  # Create instance
#             # extracting info from metadata
#             metadata = peer_connection.metadata
#             question_no = metadata.get("question_no")
#             user_id = metadata.get("user_id")
#             interview_id = metadata.get("interview_id")
#             processStream = metadata.get("processStream")
#             if processStream:
#                 print("vide is being processed")
#                 await asyncio.create_task(process_video(video_track,question_no,user_id,interview_id))  # Process video
    
#     # handling metadata from frontend
#     @peer_connection.on("datachannel")
#     def on_datachannel(channel: RTCDataChannel):
#         if channel.label == "metadata":
#             @channel.on("message")
#             def on_message(message):
#                 try:
#                     metadata = json.loads(message)
#                     peer_connection.metadata = metadata
#                     print("Metadata assigned:", metadata)
#                 except json.JSONDecodeError:
#                     print("Error decoding metadata JSON!")
#     return peer_connection

# # Directory to store interview scores
# SCORES_DIR = "interview_scores"
# os.makedirs(SCORES_DIR, exist_ok=True)

# async def process_video(video_track,question_no,user_id,interview_id):
#     file_path = os.path.join(SCORES_DIR, f"{interview_id}.json") 

#     if not os.path.exists(SCORES_DIR):
#         os.makedirs(SCORES_DIR, exist_ok=True)

#     if os.path.exists(file_path):
#         with open(file_path,"r") as f:
#             interview_data = json.loads(f)
#     else:
#         interview_data = {"user_id": user_id, "results": {}}

#     while True:
#         result = await video_track.recv()
#         print(f"Received result from AI Model: {result}")

#         if result is None:
#             print("Error: Received None from AI Model!")
#         if str(question_no) not in interview_data["results"]:
#             interview_data["results"][str(question_no)] = []

#         interview_data["results"][str(question_no)].append(result)

#         # Save updated scores back to the file
#         with open(file_path, "w") as f:
#             json.dump(interview_data, f, indent=4)


# @sio.on('iceCandidateFromClient')
# async def add_ice_candidate(data):
#     offerer_id = data.get("offerer_id")
#     ice_candidate = data.get("ice_candidate")
#     print(f"Received ICE candidate from {offerer_id}: {ice_candidate}")

#     peer_connection = peer_connections.get(offerer_id)  # Retrieve peer connection

#     if not peer_connection:
#         print(f"No peer connection found for OffererId: {offerer_id}")
#         return
#     candidate_str = ice_candidate.get("candidate")  # Extract the candidate string
#     sdpMid = ice_candidate.get("sdpMid")
#     sdpMLineIndex = ice_candidate.get("sdpMLineIndex")

#     if candidate_str:
#         # Split the candidate string into required attributes
#         parts = candidate_str.split()

#         rtc_candidate = RTCIceCandidate(
#             component=int(parts[1]),
#             foundation=parts[0],
#             ip=parts[4],
#             port=int(parts[5]),
#             priority=int(parts[3]),
#             protocol=parts[2].lower(),  # 'udp' or 'tcp'
#             type=parts[7],  # 'host', 'srflx', 'relay', etc.
#             sdpMid=sdpMid,
#             sdpMLineIndex=sdpMLineIndex
#         )

#     await peer_connection.addIceCandidate(rtc_candidate)
#     print("ICE candidate added successfully!")
import os
import uuid
import socketio
from schemas import Offer
from aiortc import RTCPeerConnection, RTCSessionDescription, RTCDataChannel, RTCIceCandidate
import tensorflow as tf
import json
from aiortc import MediaStreamTrack
import cv2
import numpy as np
import asyncio
from av import VideoFrame

# Dictionary to store active peer connections
peer_connections = {}

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
        return frame

# Directory to store interview scores
SCORES_DIR = "interview_scores"
os.makedirs(SCORES_DIR, exist_ok=True)

async def process_frame_with_model(img):
    """Process a single frame with the confidence measuring model.
    
    Args:
        img: Preprocessed image array ready for model input
        
    Returns:
        float: Confidence score between 0 and 1
    """
    # Run prediction in a separate thread to avoid blocking
    prediction = await asyncio.to_thread(model.predict, img)
    
    # Extract the confidence score (assuming the model outputs a single value)
    # If the model outputs an array, extract the confidence value
    if hasattr(prediction, 'shape') and len(prediction.shape) > 0:
        confidence_score = float(prediction[0][0])  # Adjust indexing as needed for your model
    else:
        confidence_score = float(prediction)
        
    return confidence_score

async def process_video(video_track, question_no, user_id, interview_id):
    """Process incoming video frames and save confidence scores."""
    file_path = os.path.join(SCORES_DIR, f"{interview_id}.json")

    # Initialize or load existing interview data
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            try:
                interview_data = json.load(f)
            except json.JSONDecodeError:
                interview_data = {"user_id": user_id, "results": {}}
    else:
        interview_data = {"user_id": user_id, "results": {}}

    # Initialize results for this question if needed
    if str(question_no) not in interview_data["results"]:
        interview_data["results"][str(question_no)] = []
    
    print(f"Starting confidence analysis for interview: {interview_id}, question: {question_no}")
    
    try:
        while True:
            frame = await video_track.recv()
            
            # Process the frame
            img = frame.to_ndarray(format="bgr24")
            
            # Convert to grayscale
            gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Resize to 48x48
            resized_img = cv2.resize(gray_img, (48, 48))
            
            # Normalize pixel values to [0, 1]
            normalized_img = resized_img / 255.0
            
            # Expand dimensions to match (1, 48, 48, 1)
            expanded_img = np.expand_dims(normalized_img, axis=(0, -1))
            
            # Get confidence score
            confidence_score = await process_frame_with_model(expanded_img)
            
            print(f"Confidence score: {confidence_score:.4f}")
            
            # Save the confidence score
            interview_data["results"][str(question_no)].append(confidence_score)
            
            # Save updated scores back to the file
            with open(file_path, "w") as f:
                json.dump(interview_data, f, indent=4)
                
    except asyncio.CancelledError:
        print(f"Video processing for interview {interview_id}, question {question_no} was cancelled")
    except Exception as e:
        print(f"Error in video processing: {e}")

@sio.event
async def connect():
    print("Connected to signaling server!")
    await sio.emit("register", {"userId": FASTAPI_SERVER_ID, "clientType": "server"})

@sio.event
def disconnect():
    print("Disconnected from signaling server!")

@sio.on('offer')
async def handle_new_offer(data):
    print("New offer received:", data)
    # creating peer connection
    peer_connection = await create_peer_connection(data)
    peer_connections[data["offererId"]] = peer_connection  # Store it using OffererId
    
    # Extract 'offer' correctly as a dictionary
    offer_dict = data["offer"]
    
    # Convert dictionary to RTCSessionDescription object
    offer = RTCSessionDescription(sdp=offer_dict["sdp"], type=offer_dict["type"])
    await peer_connection.setRemoteDescription(offer)
    
    # making answer
    answer = await peer_connection.createAnswer()  
    await peer_connection.setLocalDescription(answer) 
    
    data["answer"] = {
        "sdp": answer.sdp,
        "type": answer.type
    }
    print("Still Connected:", sio.connected)

    # Send the answer to the signaling server
    offerIceCandidates = await sio.call("answer", data)  # Equivalent to emitWithAck()

    # Add received ICE candidates
    for ice_candidate in offerIceCandidates:
        try:
            candidate_str = ice_candidate.get("candidate")  # Extract the candidate string
            sdpMid = ice_candidate.get("sdpMid")
            sdpMLineIndex = ice_candidate.get("sdpMLineIndex")

            if candidate_str:
                # Split the candidate string into required attributes
                parts = candidate_str.split()

                rtc_candidate = RTCIceCandidate(
                    component=int(parts[1]),
                    foundation=parts[0],
                    ip=parts[4],
                    port=int(parts[5]),
                    priority=int(parts[3]),
                    protocol=parts[2].lower(),  # 'udp' or 'tcp'
                    type=parts[7],  # 'host', 'srflx', 'relay', etc.
                    sdpMid=sdpMid,
                    sdpMLineIndex=sdpMLineIndex
                )

                await peer_connection.addIceCandidate(rtc_candidate)
                print("ICE candidate added successfully!")
        except Exception as e:
            print(f"Error adding ICE candidate: {e}")

async def create_peer_connection(offerObj):
    peer_connection = RTCPeerConnection()
    # Initialize metadata attribute
    peer_connection.metadata = {}
    
    # Log connection state changes for debugging
    @peer_connection.on("connectionstatechange")
    async def on_connection_state_change():
        print(f"Connection state changed to: {peer_connection.connectionState}")
        
    # Log ICE connection state changes for debugging
    @peer_connection.on("iceconnectionstatechange")
    async def on_ice_connection_state_change():
        print(f"ICE connection state changed to: {peer_connection.iceConnectionState}")
    
    # adding event handlers on peer connection
    @peer_connection.on("icecandidate")
    async def on_ice_candidate(event):
        print("Ice candidate found!")
        if event.candidate:
            await sio.emit("sendIceCandidateToSignalingServer", {
                "iceCandidate": {
                    "candidate": event.candidate.candidate,
                    "sdpMid": event.candidate.sdpMid,
                    "sdpMLineIndex": event.candidate.sdpMLineIndex,
                },
                "iceUserId": offerObj["offererId"],
                "didIOffer": False,
            })
    
    # Enhanced track and data channel handling in FastAPI client

    # Update the track event handler to be more robust
    @peer_connection.on("track")
    async def on_track(track):
        print(f"Track received! Kind: {track.kind}")
        
        # Add more detailed information about the track
        print(f"Track ID: {track.id}, Readystate: {track.readyState}")
        
        if track.kind == "video":
            print("Video track received - checking metadata for processing")
            
            # Create a video track instance
            video_track = VideoTrack(track)
            
            # Check if we should process this stream
            metadata = peer_connection.metadata
            print(f"Current metadata: {metadata}")
            
            # Get metadata values with better debugging
            processStream = metadata.get("processStream")
            question_no = metadata.get("question_no")
            user_id = metadata.get("user_id")
            interview_id = metadata.get("interview_id")
            
            print(f"processStream value: {processStream}")
            print(f"question_no value: {question_no}")
            print(f"user_id value: {user_id}")
            print(f"interview_id value: {interview_id}")
            
            if all([processStream, question_no is not None, user_id, interview_id]):
                print(f"Starting confidence analysis for stream with metadata: {metadata}")
                # Start processing in a separate task
                asyncio.create_task(process_video(video_track, question_no, user_id, interview_id))
            else:
                print("Stream processing skipped due to incomplete metadata!")
                print("Missing or invalid metadata:", {
                    "processStream": processStream,
                    "question_no": question_no,
                    "user_id": user_id,
                    "interview_id": interview_id
                })
                
                # Store the track for potential future processing when metadata arrives
                if not hasattr(peer_connection, "pending_tracks"):
                    peer_connection.pending_tracks = []
                peer_connection.pending_tracks.append(video_track)
                print(f"Track saved for potential future processing when metadata arrives. Total pending tracks: {len(peer_connection.pending_tracks)}")

# Enhance the data channel handling to check for pending tracks
    @peer_connection.on("datachannel")
    def on_datachannel(channel: RTCDataChannel):
        print(f"Data channel received: {channel.label}")
        if channel.label == "metadata":
            @channel.on("message")
            def on_message(message):
                try:
                    metadata = json.loads(message)
                    peer_connection.metadata = metadata
                    print("Metadata received and stored:", metadata)
                    
                    # Check if we can now process any previously received tracks
                    processStream = metadata.get("processStream")  # This key now matches the one sent from React
                    question_no = metadata.get("question_no")
                    user_id = metadata.get("user_id")
                    interview_id = metadata.get("interview_id")
                    
                    print(f"Received metadata with processStream: {processStream}")
                    
                    if all([processStream, question_no is not None, user_id, interview_id]):
                        print(f"Valid metadata received, checking for pending tracks...")
                        
                        # Process any pending tracks if they exist
                        if hasattr(peer_connection, "pending_tracks") and peer_connection.pending_tracks:
                            for idx, stored_track in enumerate(peer_connection.pending_tracks):
                                print(f"Processing previously stored track {idx+1} of {len(peer_connection.pending_tracks)}")
                                asyncio.create_task(process_video(stored_track, question_no, user_id, interview_id))
                            
                            # Clear pending tracks after processing
                            print(f"Processed {len(peer_connection.pending_tracks)} pending tracks")
                            peer_connection.pending_tracks = []
                except json.JSONDecodeError:
                    print("Error decoding metadata JSON!")
                    print(f"Raw message: {message}")
                except Exception as e:
                    print(f"Error handling metadata: {e}")
    
    return peer_connection

@sio.on('iceCandidateFromClient')
async def add_ice_candidate(data):
    offerer_id = data.get("offerer_id")
    ice_candidate = data.get("ice_candidate")
    print(f"Received ICE candidate from {offerer_id}")

    peer_connection = peer_connections.get(offerer_id)  # Retrieve peer connection

    if not peer_connection:
        print(f"No peer connection found for OffererId: {offerer_id}")
        return
    
    try:
        candidate_str = ice_candidate.get("candidate")  # Extract the candidate string
        sdpMid = ice_candidate.get("sdpMid")
        sdpMLineIndex = ice_candidate.get("sdpMLineIndex")

        if candidate_str:
            # Split the candidate string into required attributes
            parts = candidate_str.split()

            rtc_candidate = RTCIceCandidate(
                component=int(parts[1]),
                foundation=parts[0],
                ip=parts[4],
                port=int(parts[5]),
                priority=int(parts[3]),
                protocol=parts[2].lower(),  # 'udp' or 'tcp'
                type=parts[7],  # 'host', 'srflx', 'relay', etc.
                sdpMid=sdpMid,
                sdpMLineIndex=sdpMLineIndex
            )

            await peer_connection.addIceCandidate(rtc_candidate)
            print("ICE candidate added successfully!")
    except Exception as e:
        print(f"Error adding ICE candidate: {e}")