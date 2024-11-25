from services.textual_interview_service import TextualInterviewService
from schemas import Answer,InterviewFormSelection
from typing import Any,Dict
from constants import SUCCESS_STATUS
from utils.helpers import create_response,create_error_response

class TextualInterviewController():
    def __init__(self):
        self.textual_interview_service = TextualInterviewService()
    
    async def get_questions(self,selection: InterviewFormSelection):
        try:
            data = await self.textual_interview_service.get_questions(selection)
            return create_response(SUCCESS_STATUS,"questions fetched successfully",data = data)
        except Exception as e:
            return create_error_response(ERROR_STATUS,"Failed to fetch questions",error = e)
    
    async def get_score(self,data : Answer,question_id : str):
        try:
            scores = await self.textual_interview_service.get_score(data,question_id)
            return create_response(SUCCESS_STATUS,"scores fetched successfully",data = scores)
        except Exception as e:
            return create_error_response(ERROR_STATUS,"Failed to fetch scores",error = e)

    async def remove_textual_interview(self,question_id : str):
        try:
            await self.textual_interview_service.remove_textual_interview(question_id)
            return create_response(SUCCESS_STATUS,"Textual Interview deleted successfully")
        except Exception as e:
            return create_error_response(ERROR_STATUS,"Failed to delete textual Interview",error = e)
            
