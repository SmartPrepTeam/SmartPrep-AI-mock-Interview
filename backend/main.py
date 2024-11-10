from fastapi import FastAPI
from routes.textInterview_router import textInterview_router

version = 'v1'

app = FastAPI(
    title = "SmartPrep",
    description = " SmartPrep API provides a collection of tools and resources to assist users in preparing for various types of interviews.Modules include text-based interviews, user profile management, and more.",
    version = version
)

app.include_router(textInterview_router,prefix=f"/api/{version}/interviews",tags=['Textual Interview'])