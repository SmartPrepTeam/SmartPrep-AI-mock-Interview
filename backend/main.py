from fastapi import FastAPI,APIRouter
from routes import textual_interview,auth,interview,resume_parser,user_profile,video_interview
from config.db import db_lifespan
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import asyncio
import threading

version = 'v1'



app = FastAPI(
    title = "SmartPrep",
    description = " SmartPrep API provides a collection of tools and resources to assist users in preparing for various types of interviews.Modules include text-based interviews, user profile management, and more.",
    version = version,
    lifespan = db_lifespan)

origins = [
      "*",
]
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins= origins , 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  
)
# Serve the uploaded files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

api_router = APIRouter(prefix="/api")

api_router.include_router(textual_interview.router)
api_router.include_router(video_interview.router)
api_router.include_router(auth.router)
api_router.include_router(resume_parser.router)
api_router.include_router(user_profile.router)
api_router.include_router(interview.router)
app.include_router(api_router)

# from webrtc import signalling_client
# async def start_signalling():
#     try:
#         print("Attempting to connect to the signaling server...")
#         await signalling_client.sio.connect("http://localhost:8181", transports=["websocket"])
#         print("comes here .......")  # This should print if the connection succeeds
#         await signalling_client.sio.wait()
#     except Exception as e:
#         print(f"Signaling connection error: {e}")


# # running server client in the same event loop as fastapi server
# @app.on_event("startup")
# async def startup_event():
#     print("🚀 FastAPI startup event triggered!")
#     asyncio.create_task(start_signalling())