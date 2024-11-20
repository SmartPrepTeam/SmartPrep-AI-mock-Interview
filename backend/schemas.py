# Request and response schemas for Textual Interviews API endpoints

from pydantic import BaseModel
from typing import List
from enum import Enum 

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
    job_title : str
    job_description : str

class Answer(BaseModel):
    answers : List[str]

class User(BaseModel):
    email:str
    password:str

