from typing import Any,Dict
from passlib.context import CryptContext

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