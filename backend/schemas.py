# Request and response schemas for Textual Interviews API endpoints

from pydantic import BaseModel,Field
from typing import List
from enum import Enum 
from beanie import PydanticObjectId
from datetime import datetime

class InterviewType(str,Enum):
    text = "text"
    video = "video"
    
class Difficulty(str,Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"

class Score(BaseModel):
    Tone: int
    Clarity: int
    Accuracy: int
    Grammar: int
    Feedback: str

class InterviewFormSelection(BaseModel):
    userID : str
    difficulty_level : Difficulty
    question_type : InterviewType
    job_title : str
    job_description : str
    no_of_questions : int

class Answer(BaseModel):
    answers : List[str]

class User(BaseModel):
    email:str
    password:str

class QuestionShortView(BaseModel):
    job_description: str
    job_title: str
    difficulty_level: Difficulty
    no_of_questions : int
    user_id : PydanticObjectId
    id : PydanticObjectId = Field(..., alias="_id")
    createdAt : datetime =  datetime.now() 

class QuestionsList(BaseModel):
    questions : List[dict]

class AnswersList(BaseModel):
    answers : List[str]

class ScoresView(BaseModel):
    score : dict


