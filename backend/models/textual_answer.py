from beanie import Document,PydanticObjectId
from pydantic import Json
from typing import List

class TextualAnswer(Document):
    answers : List[str]
    score : Json
    question_id : PydanticObjectId
    createdAt : datetime = datetime.now()

    class Settings:
        Collection = "text-interview-answers"