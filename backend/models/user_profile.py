from beanie import Document,PydanticObjectId
from schemas import Difficulty,InterviewType
from typing import List,Optional
from datetime import datetime
from pydantic import HttpUrl,EmailStr
# PydanticObjectId ensures smooth working with mongodb ObjectIds

class UserProfileModel(Document):
    user_id : PydanticObjectId
    createdAt : datetime =  datetime.now() 
    programming_languages : Optional[List[str]]
    frameworks_libraries : Optional[List[str]]
    databases : Optional[List[str]]
    soft_skills : List[str]
    job_title : str
    full_name : str
    linkedin_profile_url : HttpUrl
    github_profile_url : HttpUrl
    email_address : EmailStr
    current_location : Optional[list]
    profileImage : Optional[bytes]

    class Settings:
        Collection = "user-profiles"