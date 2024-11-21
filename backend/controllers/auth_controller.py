from services.auth_service import AuthService
from schemas import User
from constants import SUCCESS_STATUS,ERROR_STATUS
from utils.helpers import create_response,create_error_response

class AuthController():

    def __init__(self):
        self.auth_service = AuthService()

    async def register_new_user(self,user_data:User):
        try:
            await self.auth_service.register_new_user(user_data)
            return create_response(SUCCESS_STATUS,"User registered successfully")
        except Exception as e:
            return create_error_response(ERROR_STATUS,"Failed to register user",error = e)

    async def login(self,user_data:User):

        try:
            token = await self.auth_service.login(user_data)
            return create_response(SUCCESS_STATUS,"logged in successfully",data = {'access_token' = token })
        except Exception as e:
            return create_error_response(ERROR_STATUS,"Failed to login",error = e)

