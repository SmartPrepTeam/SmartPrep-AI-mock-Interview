from services.resume_parser_service import ResumeParserService
from fastapi import UploadFile,File,Form
from constants import SUCCESS_STATUS
from utils.helpers import create_response

class ResumeParserController():
    def __init__(self):
        self.resume_parser_service = ResumeParserService()
    async def parse_resume(self,resume : UploadFile = File(...),user_id : str = Form(...)):
        user_profile = await self.resume_parser_service.parse_resume(resume,user_id)
        print("comes here as well ....")
        return create_response(SUCCESS_STATUS,"profile made successfully",data = user_profile)
