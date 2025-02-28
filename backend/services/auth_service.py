from schemas import User as UserSchema, ChangeEmailSchema, ChangePasswordSchema
from models.user import User
from fastapi import status,HTTPException,Request
from utils.helpers import hash_password,verify_password,create_access_token,create_refresh_token,verify_token
from fastapi.responses import Response
from models.blacklist import BlackList
from beanie import PydanticObjectId
from models.user import User as UserModel   
 
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

        # get the refresh token
        refresh_token = request.cookies.get("refresh_token")

        if not refresh_token:
            raise HTTPException(
                status_code = status.HTTP_401_UNAUTHORIZED,
                detail = "Refresh token not present"
            )

        # verify its correct and still has not expired and get user id from it
        user_id = verify_token(refresh_token)

        if not user_id:
            raise HTTPException(
                status_code = status.HTTP_401_UNAUTHORIZED,
                detail = "Invaild or Expired Refresh token"
            )

        # Check if its black listed 
        blacklisted = await BlackList.find_one({"token" : user_id})
        if blacklisted :
             raise HTTPException(
                status_code = status.HTTP_401_UNAUTHORIZED,
                detail = "Blacklisted Refresh token"
            )
        
        # Generate new tokens for more security
        access_token = create_access_token({"user_id" : user_id})
        new_refresh_token  = create_refresh_token({"user_id" :  user_id})

        self.set_refresh_token(response,new_refresh_token)

        return access_token


    async def blacklistToken(self , user_id : str):

        if not user_id:
            raise HTTPException(
                status_code = status.HTTP_400_BAD_REQUEST,
                detail = "Token missing"
            )

        new_token = BlackList(
            token = user_id
        )

        await new_token.insert()
    
    async def change_password(self, user_id: str, user_data: ChangePasswordSchema):
        # find user
        existing_user = await UserModel.find_one({"_id": PydanticObjectId(user_id)})
        if not existing_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

        # check if current password is correct one
        if not verify_password(user_data.current_password, existing_user.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect"
            )

        # update the current password with new one
        existing_user.password = hash_password(user_data.new_password)
        await existing_user.save()

        return {"message": "Password changed successfully"}

    async def change_email(self, user_id: str, user_data: ChangeEmailSchema):
        # find user
        existing_user = await UserModel.find_one({"_id": PydanticObjectId(user_id)})
        if not existing_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

    
        if existing_user.email == user_data.new_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="New email is the same as the current email"
            )

        
        email_in_use = await UserModel.find_one({"email": user_data.new_email})
        if email_in_use:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Email already in use"
            )

        
        existing_user.email = user_data.new_email
        await existing_user.save()

        return {"message": "Email changed successfully", "new_email": existing_user.email}
    


       

        
