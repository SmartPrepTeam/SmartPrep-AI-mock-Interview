from services.auth_service import AuthService
from schemas import User, ChangeEmailSchema, ChangePasswordSchema
from constants import SUCCESS_STATUS,ERROR_STATUS
from utils.helpers import create_response,create_error_response,hash_password,verify_password
from fastapi import Request
from fastapi.responses import Response
from fastapi import HTTPException
 



class AuthController():

    def __init__(self):
        self.auth_service = AuthService()

    async def register_new_user(self,user_data:User):
        await self.auth_service.register_new_user(user_data)
        return create_response(SUCCESS_STATUS,"User registered successfully")

    async def login(self,response : Response,user_data:User):
        data = await self.auth_service.login(response,user_data)
        return create_response(SUCCESS_STATUS,"logged in successfully",data = data)


    async def generate_new_access_token(self,response : Response, request: Request):
        token = await self.auth_service.generate_new_access_token(response,request)
        return create_response(SUCCESS_STATUS,"New access token generated successfully",data = {"access_token" : token})

    async def blacklistToken(self,user_id : str):
        await self.auth_service.blacklistToken(user_id)
        return create_response(SUCCESS_STATUS,"token blacklisted successfully")
    
    async def change_password(self, user_id: str, user_data: ChangePasswordSchema):
        try:
           
            result = await self.auth_service.change_password(user_id, user_data)
            return create_response(SUCCESS_STATUS, result["message"])

        except HTTPException as e:
            return create_error_response(e.status_code, e.detail)

    async def change_email(self, user_id: str, user_data: ChangeEmailSchema):
        try:
            
            result = await self.auth_service.change_email(user_id, user_data)
            return create_response(SUCCESS_STATUS, result["message"], data={"new_email": result["new_email"]})

        except HTTPException as e:
            return create_error_response(e.status_code, e.detail)
    



 