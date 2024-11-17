from beanie import Document,PydanticObjectId
from schemas import Difficulty
from pydantic import Json

# PydanticObjectId ensures smooth working with mongodb ObjectIds

class TextualQuestion(Document):
    job_description: str
    job_title: str
    difficulty_level: Difficulty
    questions : Json
    user_id : PydanticObjectId
    createdAt : datetime =  datetime.now() 

    class Settings:
        Collection = "text-interview-questions"