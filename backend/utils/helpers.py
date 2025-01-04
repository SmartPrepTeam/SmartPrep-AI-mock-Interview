from typing import Any,Dict,Optional
from passlib.context import CryptContext
from config.setting import settings
from datetime import datetime,timedelta
from jose import jwt,JWTError
pwd_context=CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_response(status : str,msg : str,data : Any = None) -> Dict:
        return {
            "status" : status,
            "msg" : msg,
            "data" : data
        }

def create_error_response(status : str,msg : str , error : Any = None) -> Dict :
    return {
        "status" : status,
        "msg" : msg,
        "error" :error 
    }

def hash_password(password : str):
    return pwd_context.hash(password)

def verify_password(given_password : str,stored_hashed_password : str):
    return pwd_context.verify(given_password,stored_hashed_password)

def create_token(data: dict, exp : timedelta) -> str:
    to_encode = data.copy()
    expire = datetime.now() + exp
    to_encode.update({"exp":expire})
    encoded_token = jwt.encode(to_encode,settings.secret_key,algorithm=settings.algorithm)
    return encoded_token

def create_access_token(data : dict) -> str:
    expires_delta = timedelta(minutes = settings.access_token_expire_minutes)
    return create_token(data,expires_delta)

def create_refresh_token(data : dict) -> str :
    expires_delta = timedelta(minutes = settings.refresh_token_expire_minutes)
    return create_token(data,expires_delta)

def verify_token(token : str)->Optional[str]:
    try:
        payload = jwt.decode(token,settings.secret_key,algorithms= [settings.algorithm])

        user_id = payload.get("user_id")

        if not user_id:
            return None
        return user_id

    except JWTError as e:
        print(f"JWT ERROR : {e}")
        return None