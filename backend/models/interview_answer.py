from beanie import Document,PydanticObjectId
from pydantic import Json
from typing import List,Optional
from datetime import datetime

class InterviewAnswer(Document):
    answers : List[str]
    score : dict #common dictionary to store similar scores
    question_id : PydanticObjectId
    user_id : PydanticObjectId
    createdAt : datetime = datetime.now()
    type : str
    video_confidence : Optional[List[float]] = None
    audio_confidence : Optional[List[float]] = None
    class Settings:
        Collection = "interview-answers"