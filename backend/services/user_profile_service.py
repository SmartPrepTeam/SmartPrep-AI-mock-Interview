from fastapi import UploadFile,File,Form,HTTPException,status
from schemas import UserProfile
from beanie import PydanticObjectId
from bson import ObjectId
import os
from models.user_profile import UserProfileModel
class UserProfileService():

    @staticmethod
    async def validate_object_id(id: str):
        """Validates the given ID format."""
        if not ObjectId.is_valid(id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid ID format"
            )

    @staticmethod
    async def convert_to_pydantic_object_id(id: str) -> PydanticObjectId:
        """Converts a string ID to a PydanticObjectId."""
        return PydanticObjectId(id)

    async def get_user_profile(self,user_id : str):
        await self.validate_object_id(user_id)

        user_object_id = await self.convert_to_pydantic_object_id(user_id)

        profile = await UserProfileModel.find_one({"user_id": user_object_id})
        if profile is None:
            # Handle no document found
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User Profile not found")
        if profile and profile.profileImage:
            file_name = os.path.basename(profile.profileImage)
            profile.profileImage = f"/uploads/{file_name}"
        return profile

    async def save_user_profile(self,user_details : UserProfile ,user_id : str):
        await self.validate_object_id(user_id)

        user_object_id = await self.convert_to_pydantic_object_id(user_id)

        profile = await UserProfileModel.find_one({"user_id": user_object_id})
        print("comes here 3")
        if profile :
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User Profile already registered")
        '''  makes a new entry in the db  '''
        new_profile = UserProfileModel(
            user_id = user_id,
            programming_languages = user_details.programming_languages,
            frameworks_libraries = user_details.frameworks_libraries,
            databases = user_details.databases,
            soft_skills = user_details.soft_skills,
            job_title = user_details.job_title,
            full_name = user_details.full_name,
            linkedin_profile_url = user_details.linkedin_profile_url,
            github_profile_url = user_details.github_profile_url,
            email_address = user_details.email_address,
            current_location = user_details.current_location,
            profileImage = user_details.profileImage,
        ) 
        await new_profile.insert() 

    async def update_user_profile(self,user_details : UserProfile ,user_id : str):

        await self.validate_object_id(user_id)
        user_object_id = await self.convert_to_pydantic_object_id(user_id)

        profile = await UserProfile.find_one({"user_id": user_object_id})
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="User Profile not found"
            )

        update_data = {
            "programming_languages": user_details.programming_languages,
            "frameworks_libraries": user_details.frameworks_libraries,
            "databases": user_details.databases,
            "soft_skills": user_details.soft_skills,
            "job_title": user_details.job_title,
            "full_name": user_details.full_name,
            "linkedin_profile_url": user_details.linkedin_profile_url,
            "github_profile_url": user_details.github_profile_url,
            "email_address": user_details.email_address,
            "current_location": user_details.current_location,
            "profileImage": user_details.profileImage,
        }

        await UserProfile.find_one_and_update(
            {"user_id": user_object_id},  # Query to find the user profile
            {"$set": update_data}         # Update operator to modify fields
        )
        