from fastapi import APIRouter,status,Request,Depends
from schemas import User,TokenData, ChangeEmailSchema, ChangePasswordSchema
from controllers.auth_controller import AuthController
from fastapi.responses import Response
from auth.token_manager import TokenManager

 
router = APIRouter(
    prefix="/auth",
    tags=['Authentication']
)

def get_auth_controller() -> AuthController:
    return AuthController()
def get_token_manager() -> TokenManager:
    return TokenManager()
@router.post('/signup',status_code = status.HTTP_201_CREATED)
async def register_new_user(user_data : User, auth_controller : AuthController = Depends(get_auth_controller)):
    return await auth_controller.register_new_user(user_data)

@router.post('/login')
async def login(response : Response,user_data : User,auth_controller : AuthController = Depends(get_auth_controller)):
    print("call 1")
    return await auth_controller.login(response,user_data)

@router.post('/refresh')
async def generate_new_access_token(response : Response , request : Request,auth_controller : AuthController = Depends(get_auth_controller)):
    return await auth_controller.generate_new_access_token(response , request)

@router.post('/logout')
async def logout(request : Request , auth_controller : AuthController = Depends(get_auth_controller),token : TokenData = Depends(get_token_manager().get_current_user)):
    user_id = token.user_id
    return await auth_controller.blacklistToken(user_id)

@router.put("/change-email")
async def change_email(
    user_data: ChangeEmailSchema, auth_controller: AuthController = Depends(get_auth_controller), token: TokenData = Depends(get_token_manager().get_current_user)):
    user_id = token.user_id  
    return await auth_controller.change_email(user_id, user_data)

@router.put('/change-password', status_code=status.HTTP_200_OK)
async def change_password(request: Request, password_data: ChangePasswordSchema, auth_controller: AuthController = Depends(get_auth_controller),token_data: TokenData = Depends(get_token_manager().get_current_user) ):
    user_id = token_data.user_id 
    return await auth_controller.change_password(user_id, password_data)  