# Request and response schemas for Textual Interviews API endpoints

from pydantic import BaseModel,Field,HttpUrl,EmailStr
from typing import List,Optional
from enum import Enum 
from beanie import PydanticObjectId
from datetime import datetime
from fastapi import UploadFile

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
class Location(BaseModel):
    country : str
    state : Optional[str]

class UserProfile(BaseModel):
    programming_languages : Optional[List[str]] = Field(default_factory = list)
    frameworks_libraries : Optional[List[str]] = Field(default_factory = list)
    databases : Optional[List[str]] = Field(default_factory = list)
    soft_skills : List[str]
    job_title : str
    full_name : str
    linkedin_profile_url : HttpUrl
    github_profile_url : HttpUrl
    email_address : EmailStr
    current_location : Optional[list]
    profileImage : str 