from beanie import Document
from pydantic import EmailStr
from datetime import datetime

class User(Document):
    email : EmailStr
    password : str
    sign_up_date : datetime = datetime.now()

    class Settings:
        Collection = "users"