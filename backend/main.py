from fastapi import FastAPI
from routes.route import router
from config.db import db_lifespan

app = FastAPI(lifespan = db_lifespan)

app.include_router(router)