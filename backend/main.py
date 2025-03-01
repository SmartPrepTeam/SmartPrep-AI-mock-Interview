from fastapi import FastAPI,APIRouter
from routes import textual_interview,auth,interview,resume_parser,user_profile,video_interview
from config.db import db_lifespan
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
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
app.mount("/uploads", StaticFiles(directory="../uploads"), name="uploads")

api_router = APIRouter(prefix="/api")

api_router.include_router(textual_interview.router)
api_router.include_router(video_interview.router)
api_router.include_router(auth.router)
api_router.include_router(resume_parser.router)
api_router.include_router(user_profile.router)
api_router.include_router(interview.router)
app.include_router(api_router)