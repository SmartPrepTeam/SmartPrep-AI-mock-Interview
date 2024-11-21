from schemas import User as UserSchema
from models.user import User
from fastapi import status,HTTPException,Request
from utils.helpers import hash_password,verify_password,create_access_token,create_refresh_token,verify_refresh_token
from fastapi.responses import Response
from models.blacklist import BlackList

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
    async def register_new_user(self,user_data:UserSchema):

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

    async def login(self,response : Response,user_data : UserSchema):
        print("call 3")
        '''check for a user with given email '''
        existing_user = await User.find_one({"email": user_data.email})

        ''' verfiy password and missing user '''
        if not existing_user or not verify_password(user_data.password,existing_user.password):
            raise HTTPException(
                status_code = status.HTTP_400_BAD_REQUEST,
                detail = "Invalid Credentials"
            )
        
        ''' Generate JWT tokens '''
        access_token = create_access_token({"user_id" : str(existing_user.id)})
        refresh_token = create_refresh_token({"user_id" : str(existing_user.id)})
        
        '''Set the refresh token in HTTP Only Cookie'''
        self.set_refresh_token(response,refresh_token)

        '''Send the access token back to the client'''
        return {
            "access_token" : access_token,
            "user_id" : str(existing_user.id)
        }
        
    async def generate_new_access_token(self,response : Response,request: Request):

        """get the refresh token"""
        refresh_token = request.cookies.get("refresh_token")

        if not refresh_token:
            raise HTTPException(
                status_code = status.HTTP_401_UNAUTHORIZED,
                detail = "Refresh token not present"
            )
        """Check if its black listed """
        blacklisted = await BlackList.find_one({"token" : refresh_token})
        if blacklisted :
             raise HTTPException(
                status_code = status.HTTP_401_UNAUTHORIZED,
                detail = "Blacklisted Refresh token"
            )

        """verify its correct and still has not expired and get user id from it"""
        user_id = verify_refresh_token(refresh_token)

        if not user_id:
            raise HTTPException(
                status_code = status.HTTP_401_UNAUTHORIZED,
                detail = "Invaild or Expired Refresh token"
            )
        
        """Generate new tokens for more security"""
        access_token = create_access_token({"user_id" : user_id})
        new_refresh_token  = create_refresh_token({"user_id" :  user_id})

        self.set_refresh_token(response,new_refresh_token)

        return access_token


    async def blacklistToken(self , request : Request):

        refresh_token = request.cookies.get("refresh_token")

        if not refresh_token:
            raise HTTPException(
                status_code = status.HTTP_400_BAD_REQUEST,
                detail = "Refresh token not present"
            )

        new_token = BlackList(
            token = refresh_token
        )

        await new_token.insert()


        
