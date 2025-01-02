from fastapi.security import OAuth2PasswordBearer
from utils.helpers import verify_token
from fastapi import HTTPException,status,Depends
from schemas import TokenData
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='auth/login')
class TokenManager:
    def get_current_user(self,access_token : str = Depends(oauth2_scheme)) -> TokenData:
        # verify the access token
        user_id = verify_token(access_token)
        if not user_id:
            raise HTTPException(
                status_code = status.HTTP_401_UNAUTHORIZED,
                detail = "Expired or Invalid Access Token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return TokenData(user_id)

