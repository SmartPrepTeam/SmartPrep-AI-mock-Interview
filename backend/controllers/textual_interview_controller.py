from services.textual_interview_service import TextualInterviewService
from schemas import Answer,InterviewFormSelection,InterviewType
from typing import Any,Dict
from constants import SUCCESS_STATUS
from utils.helpers import create_response,create_error_response

class TextualInterviewController():
    def __init__(self):
        self.textual_interview_service = TextualInterviewService()
    
    async def get_questions(self,selection: InterviewFormSelection):
        data = await self.textual_interview_service.get_questions(selection)
        return create_response(SUCCESS_STATUS,"questions fetched successfully",data = data)
    
    async def get_score(self,data : Answer,question_id : str,user_id : str):
        scores = await self.textual_interview_service.get_score(data,question_id,user_id)
        return create_response(SUCCESS_STATUS,"scores fetched successfully",data = scores)

    async def get_feedback(self,question : str,answer : str):
        res = await self.textual_interview_service.get_feedback(question,answer)
        return create_response(SUCCESS_STATUS,f"Feedback fetched successfully",data = res)
            
