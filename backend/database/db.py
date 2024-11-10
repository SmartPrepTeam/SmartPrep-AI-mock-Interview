from pymongo import MongoClient
from config.config import Config
client = MongoClient(Config.MONGODB_ATLAS)

db = client.smartprep_db

textQuiz_collection = db["TextualQuiz"]
textAns_collection = db["TextualAnswer"]
