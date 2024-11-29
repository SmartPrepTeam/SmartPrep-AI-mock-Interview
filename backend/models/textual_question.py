from beanie import Document,PydanticObjectId
from schemas import Difficulty
from typing import List
from datetime import datetime
# PydanticObjectId ensures smooth working with mongodb ObjectIds

class TextualQuestion(Document):
    job_description: str
    job_title: str
    difficulty_level: Difficulty
    questions : List[dict]
    no_of_questions : int
    user_id : PydanticObjectId
    createdAt : datetime =  datetime.now() 

    class Settings:
        Collection = "text-interview-questions"