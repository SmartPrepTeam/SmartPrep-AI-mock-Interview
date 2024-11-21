from services.auth_service import AuthService
from schemas import User
from constants import SUCCESS_STATUS,ERROR_STATUS
from utils.helpers import create_response,create_error_response
from fastapi import Request
from fastapi.responses import Response

class AuthController():

    def __init__(self):
        self.auth_service = AuthService()

    async def register_new_user(self,user_data:User):
        try:
            await self.auth_service.register_new_user(user_data)
            return create_response(SUCCESS_STATUS,"User registered successfully")
        except Exception as e:
            return create_error_response(ERROR_STATUS,"Failed to register user",error = e)

    async def login(self,response : Response,user_data:User):

        try:
            data = await self.auth_service.login(response,user_data)
            return create_response(SUCCESS_STATUS,"logged in successfully",data = data)
        except Exception as e:
            return create_error_response(ERROR_STATUS,"Failed to login",error = e)

    async def generate_new_access_token(self,response : Response, request: Request):
    try:
        token = await self.auth_service.generate_new_access_token(response,request)
        return create_response(SUCCESS_STATUS,"New access token generated successfully",data = {"access_token" : token})
    except Exception as e:
        return create_error_response(ERROR_STATUS,"Failed to generate the access token",error = e)
    