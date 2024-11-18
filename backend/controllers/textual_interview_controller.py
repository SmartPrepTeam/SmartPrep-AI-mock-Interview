from services.textual_interview_service import TextualInterviewService
from schemas import Answer,InterviewFormSelection
from typing import Any,Dict
from constants import SUCCESS_STATUS

class TextualInterviewController():
    def __init__(self):
        self.textual_interview_service = TextualInterviewService()
    
    @staticmethod
    async def create_response(status : str,msg : str,data : Any = None) -> Dict:
        return {
            "status" : status,
            "msg" : msg,
            "data" : data
        }
    async def get_questions(self,selection: InterviewFormSelection):
        data = await self.textual_interview_service.get_questions(selection)
        return await self.create_response(SUCCESS_STATUS,"questions fetched successfully",data = data)
    
    async def get_score(self,data : Answer,question_id : str):
        scores = await self.textual_interview_service.get_score(data,question_id)
        return await self.create_response(SUCCESS_STATUS,"scores fetched successfully",data = scores)

    async def remove_textual_interview(self,question_id : str):
        await self.textual_interview_service.remove_textual_interview(question_id)
        return await self.create_response(SUCCESS_STATUS,"Textual Interview deleted successfully")
