from motor.motor_asyncio import AsyncIOMotorClient
from .setting import settings
from beanie import init_beanie
from fastapi import FastAPI
from models.textual_question import TextualQuestion
from models.textual_answer import TextualAnswer

async def db_lifespan(app:FastAPI):
    # on starting the app
    app.mongodb_client = AsyncIOMotorClient(settings.mongodb_url)
    app.database = app.mongodb_client["smartprep_db"]
    await init_beanie(database = app.database, document_models = [TextualQuestion,TextualAnswer])
    ping_response = await app.database.command("ping")
    if int(ping_response["ok"]) != 1:
        raise Exception("Problem connecting to database cluster.")

    yield

    # on shutting down the app
    app.mongodb_client.close()
