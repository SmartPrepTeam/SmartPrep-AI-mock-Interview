from fastapi import APIRouter,status
from schemas import User
from controllers.auth_controller import AuthController

router = APIRouter(
    prefix="/auth",
    tags=['Authentication']
)

def get_auth_controller() -> AuthController():
    return AuthController()

@router.post('/signup',status_code = status.HTTP_201_CREATED)
async def register_new_user(user_data : User):
    return await get_auth_controller.register_new_user(user_data)

@router.post('/login')
async def login(user_data : User):
    return await get_auth_controller.login(user_data)

