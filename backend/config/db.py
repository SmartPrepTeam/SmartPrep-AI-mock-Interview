from motor.motor_asyncio import AsyncIOMotorClient
from .setting import settings
from beanie import init_beanie
from fastapi import FastAPI
from models.interview_question import InterviewQuestion
from models.interview_answer import InterviewAnswer
from models.user import User
from models.blacklist import BlackList

async def db_lifespan(app:FastAPI):
    # on starting the app
    app.mongodb_client = AsyncIOMotorClient(settings.mongodb_url)
    app.database = app.mongodb_client["smartprep_db"]
    await init_beanie(database = app.database, document_models = [InterviewQuestion,InterviewAnswer,User,BlackList])
    ping_response = await app.database.command("ping")
    if int(ping_response["ok"]) != 1:
        raise Exception("Problem connecting to database cluster.")
    print("connected to db")
    yield

    # on shutting down the app
    app.mongodb_client.close()
