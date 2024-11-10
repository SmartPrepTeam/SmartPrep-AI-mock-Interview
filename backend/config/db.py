from pymongo import MongoClient
from utils.Constants import MONGODB_ATLAS
client = MongoClient(MONGODB_ATLAS)

db = client.smartprep_db

textQuiz_collection = db["TextualQuiz"]
textAns_collection = db["TextualAnswer"]
