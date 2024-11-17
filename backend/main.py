from fastapi import FastAPI,APIRouter
from routes import textual_interview
from config.db import db_lifespan

version = 'v1'
app = FastAPI(
    title = "SmartPrep",
    description = " SmartPrep API provides a collection of tools and resources to assist users in preparing for various types of interviews.Modules include text-based interviews, user profile management, and more.",
    version = version,
    lifespan = db_lifespan)


api_router = APIRouter(prefix="/api")

api_router.include_router(textual_interview.router)

app.include_router(api_router)