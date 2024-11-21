from schemas import User as UserSchema
from models.user import User
from fastapi import status,HTTPException,Response
from utils.helpers import hash_password,verify_password,create_access_token,create_refresh_token


class AuthService():

    @staticmethod
    def set_refresh_token(response:Response, token : str):
        response.set_cookie(
            key  = "refresh_token",
            value = token,
            httponly = True,
            samesite = 'strict',
            secure = True
        )
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

    async def login(response : Response,user_data : UserSchema):
        '''check for a user with given email '''
        existing_user = await User.find_one({"email": user_data.email})

        ''' verfiy password and missing user '''
        if not existing_user or not verify_password(user_data.password,existing_user.password):
            raise HTTPException(
                status_code = status.HTTP_403_FORBIDDEN_REQUEST,
                detail = "Invalid Credentials"
            )
        
        ''' Generate JWT tokens '''
        access_token = create_access_token({"user_id" : str(existing_user.id)})
        refresh_token = create_refresh_token({"user_id" : str(existing_user.id)})
        
        '''Set the refresh token in HTTP Only Cookie'''
        self.set_refresh_token(response,refresh_token)

        '''Send the access token back to the client'''
        return access_token
        

        
