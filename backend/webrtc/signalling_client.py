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
sio = socketio.AsyncClient(reconnection=True, 
                          reconnection_attempts=10,
                          reconnection_delay=1,
                          reconnection_delay_max=5)

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
    try:
        # Run prediction in a separate thread to avoid blocking
        prediction = await asyncio.to_thread(model.predict, img)
        print("model prediction runs correctly")
    except Exception as e:
        print(f"Error during prediction : {e}")

    
    # Extract the confidence score (assuming the model outputs a single value)
    # If the model outputs an array, extract the confidence value
    if hasattr(prediction, 'shape') and len(prediction.shape) > 0:
        confidence_score = float(prediction[0][0])  # Adjust indexing as needed for your model
    else:
        confidence_score = float(prediction)
        
    return confidence_score

async def process_video(video_track, peer_connection,user_id,interview_id):
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

    
    
    try:
        while True:

            print(f"Process video function started for user {user_id}, interview {interview_id}")
            # Exit if peer connection is closed
            if peer_connection.connectionState in ["failed", "disconnected"]:
                print(f"Peer connection closed for {interview_id}. Stopping video processing.")
                offerer_id = metadata.get("user_id")
                await cleanup_peer_connection(offerer_id,peer_connection)
                break
            metadata = peer_connection.metadata
          
        #   Exit if termination message is received
            if metadata.get("type") == "termination":
                print(f"Termination flag detected in metadata. Stopping processing for {interview_id}")
                break

            process_stream = metadata.get("processStream")
            question_no = metadata.get("question_no")

            # Skip processing if processStream is false
            if not process_stream:
                print("Processing paused - processStream is False")
                await asyncio.sleep(0.5)
                continue
                
            # Skip if we don't have a valid question number
            if question_no is None:
                print("No valid question number - waiting")
                await asyncio.sleep(0.5)
                continue

        # Initialize results for this question if needed
            if str(question_no) not in interview_data["results"]:
                interview_data["results"][str(question_no)] = []
            
            print(f"Starting confidence analysis for interview: {interview_id}, question: {question_no}")

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
    finally:
        print(f"CLosed connection for interview {interview_id}")

@sio.event
async def connect():
    print("Connected to signaling server!")
    await sio.emit("register", {"userId": FASTAPI_SERVER_ID, "clientType": "server"})

@sio.event
async def disconnect():
    print("Disconnected from signaling server!")
    # Cleanup all peer connections
    for offerer_id, conn in peer_connections.items():
        await conn.close()
    peer_connections.clear()

@sio.on('clientReconnected')
async def handle_client_reconnection(data):
    user_id = data.get("userId")
    print(f"Client {user_id} has reconnected. Cleaning up old resources.")
    
    # Clean up any existing peer connection for this user
    if user_id in peer_connections:
        await cleanup_peer_connection(user_id, peer_connections[user_id])

@sio.on('offer')
async def handle_new_offer(data):
    # print("New offer received:", data)
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
    offerIceCandidates = await sio.call("answer", data,timeout = 10)  # Equivalent to emitWithAck()

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

# Add this function to your FastAPI code
async def cleanup_peer_connection(offerer_id, peer_connection):
    """Properly clean up a peer connection and its resources."""
    print(f"Cleaning up peer connection for {offerer_id}")
    
    # Cancel all processing tasks
    if hasattr(peer_connection, "processing_tasks") and peer_connection.processing_tasks:
        for task in peer_connection.processing_tasks:
            if not task.done():
                task.cancel()
        peer_connection.processing_tasks = []
    
    # Close the connection
    await peer_connection.close()
    
    # Remove from peer_connections dictionary
    if offerer_id in peer_connections:
        del peer_connections[offerer_id]
        print(f"Peer connection removed for {offerer_id}")

async def create_peer_connection(offerObj):
    peer_connection = RTCPeerConnection()
    # Initialize metadata attribute
    peer_connection.metadata = {}
    # to keep track of running tasks
    peer_connection.processing_tasks = []
    # Log connection state changes for debugging
    @peer_connection.on("connectionstatechange")
    async def on_connection_state_change():
        print(f"Connection state changed to: {peer_connection.connectionState}")
        if peer_connection.connectionState in ["failed", "disconnected"]:
            # Get user ID from context
            offerer_id = offerObj.get("offererId")
            
            # Log the disconnection event
            print(f"Client disconnection detected for user {offerer_id}")
            if offerer_id :
                await cleanup_peer_connection(offerer_id,peer_connection)
        
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
            user_id = metadata.get("user_id")
            interview_id = metadata.get("interview_id")
            
            print(f"user_id value: {user_id}")
            print(f"interview_id value: {interview_id}")
            
            if user_id and interview_id:
                print(f"Starting confidence analysis task for interview: {interview_id}")
                
                # Start a processing task that will handle all questions
                task = asyncio.create_task(process_video(video_track, peer_connection, user_id,interview_id))
                if not hasattr(peer_connection, "processing_tasks"):
                    peer_connection.processing_tasks = []
                peer_connection.processing_tasks.append(task)
            else:
                print("Stream processing skipped due to incomplete metadata!")
                print("Missing required metadata:", {
                    "user_id": user_id,
                    "interview_id": interview_id
                })
                
               # Store track for later processing when metadata arrives
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
            async def on_message(message):
                try:
                    print(f"Received message on data channel: {message}")
                
                    # Parse the message
                    if isinstance(message, str):
                        metadata = json.loads(message)
                    else:
                        metadata = json.loads(message.decode())
                    
                    peer_connection.metadata = metadata
                    print("Metadata received and stored:", metadata)
                    # Check if this is a termination message
                    if metadata.get("type") == "termination":
                        print(f"Termination signal received for user {metadata.get('user_id')}")
                        offerer_id = metadata.get("user_id")
                        await cleanup_peer_connection(offerer_id,peer_connection)
                        return
                    
                    # If we have pending tracks and now have complete metadata
                    if (hasattr(peer_connection, "pending_tracks") and 
                        len(peer_connection.pending_tracks) > 0  and
                        metadata.get("user_id") and 
                        metadata.get("interview_id")):
                        
                        print(f"Starting processing for {len(peer_connection.pending_tracks)} pending tracks")
                        for track in peer_connection.pending_tracks:
                            asyncio.create_task(
                                process_video(
                                    track,
                                    peer_connection,
                                    metadata.get("user_id"),
                                    metadata.get("interview_id")
                                )
                            )
                    # Clear the pending tracks list
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