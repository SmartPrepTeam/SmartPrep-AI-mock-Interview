from services.user_profile_service import UserProfileService
from constants import SUCCESS_STATUS
from utils.helpers import create_response
from schemas import UserProfile
class UserProfileController():
    def __init__(self):
        self.user_profile_service = UserProfileService()
    async def save_user_profile(self,user_details : UserProfile,user_id : str ):
        print("comes here 2")
        await self.user_profile_service.save_user_profile(user_details,user_id)
        return create_response(SUCCESS_STATUS,"User Details saved successfully")

    async def get_user_profile(self,user_id : str ):
        user_details = await self.user_profile_service.get_user_profile(user_id)
        return create_response(SUCCESS_STATUS,"User Details fetched successfully",data = user_details)

    async def update_user_profile(self,user_details : UserProfile,user_id : str ):
        await self.user_profile_service.update_user_profile(user_details,user_id)
        return create_response(SUCCESS_STATUS,"User Details updated successfully")
