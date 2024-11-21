from schemas import User as UserSchema
from models.user import User
from fastapi import status,HTTPException
from utils.helpers import hash_password


class AuthService():
    async def register_new_user(user_data:UserSchema):

        '''check the uniqueness of the email'''
        res = await User.find_one({"email" : user_data.email})
        if res:
            raise HTTPException(
                status_code = status.HTTP_400_BAD_REQUEST,
                detail = "Email already Registered"
            )

        '''hash the password'''
        hashed_password = hash_password(user_data.password)

        '''Register the user'''
        new_user = User(
            email = user_data.email,
            password = hashed_password
        )
        await new_user.insert()

    async def login(user_data : UserSchema):
        print("hello")
