from fastapi import APIRouter,Depends,UploadFile,File,Form
from controllers.user_profile_controller import UserProfileController
from schemas import UserProfile
from typing import Optional,List
from pydantic import HttpUrl,EmailStr
import json,os
router = APIRouter(
    prefix = "/user/profile",
    tags = ["User Profile"]
)

def get_user_profile_controller() -> UserProfileController:
    return UserProfileController()

@router.post("/{user_id}")
async def save_user_profile(
    user_id: str,
    profile_image : UploadFile = File(...),
    programming_languages : Optional[List[str]] = Form(None),
    frameworks_libraries : Optional[List[str]]  = Form(None),
    databases : Optional[List[str]]  = Form(None),
    soft_skills : List[str] = Form(...),
    job_title : str  = Form(...),
    full_name : str = Form(...),
    linkedin_profile_url : HttpUrl = Form(...),
    github_profile_url : HttpUrl = Form(...),
    email_address : EmailStr = Form(...),
    current_location : Optional[str] = Form(None),
    user_profile_controller : UserProfileController = Depends(get_user_profile_controller)
    ):
    upload_dir = "../uploads"
    os.makedirs(upload_dir,exist_ok = True)
    file_path = os.path.join(upload_dir,profile_image.filename)
    with open(file_path,"wb") as file:
        file.write(profile_image.file.read())

    user_details = UserProfile(
        profileImage = file_path,
        programming_languages = programming_languages,
        frameworks_libraries = frameworks_libraries,
        databases = databases,
        soft_skills = soft_skills,
        job_title = job_title,
        full_name = full_name,
        linkedin_profile_url = linkedin_profile_url,
        github_profile_url = github_profile_url,
        email_address = email_address,
        current_location = json.loads(current_location) if current_location else None,
    )
    return await user_profile_controller.save_user_profile(user_details,user_id)

@router.get("/{user_id}")
async def get_user_profile(
    user_id: str,
    user_profile_controller : UserProfileController = Depends(get_user_profile_controller)
):
    return await user_profile_controller.get_user_profile(user_id)

@router.put("/{user_id}")
async def update_user_profile(
    user_details: UserProfile,
    user_id: str,
    user_profile_controller : UserProfileController = Depends(get_user_profile_controller)):
    return await user_profile_controller.update_user_profile(user_details,user_id)