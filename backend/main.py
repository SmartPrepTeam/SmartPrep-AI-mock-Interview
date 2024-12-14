from fastapi import FastAPI,APIRouter
from routes import textual_interview,auth,resume_parser
from config.db import db_lifespan
from fastapi.middleware.cors import CORSMiddleware

version = 'v1'
app = FastAPI(
    title = "SmartPrep",
    description = " SmartPrep API provides a collection of tools and resources to assist users in preparing for various types of interviews.Modules include text-based interviews, user profile management, and more.",
    version = version,
    lifespan = db_lifespan)

origins = [
    '*',
]
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins= origins , 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  
)

api_router = APIRouter(prefix="/api")

api_router.include_router(textual_interview.router)
api_router.include_router(auth.router)
api_router.include_router(resume_parser.router)
app.include_router(api_router)