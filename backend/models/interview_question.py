from beanie import Document,PydanticObjectId
from schemas import Difficulty,InterviewType
from typing import List
from datetime import datetime
# PydanticObjectId ensures smooth working with mongodb ObjectIds

class InterviewQuestion(Document):
    job_description: str
    job_title: str
    difficulty_level: Difficulty
    questions : List[str]
    no_of_questions : int
    user_id : PydanticObjectId
    question_type : InterviewType
    createdAt : datetime =  datetime.now() 

    class Settings:
        Collection = "interview-questions"