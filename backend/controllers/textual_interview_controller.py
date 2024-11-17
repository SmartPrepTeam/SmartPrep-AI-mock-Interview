from services.textual_interview_service import TextualInterviewService
from utils import create_response
from schemas import Answer,InterviewFormSelection

class TextualInterviewController():
    def __init__(self):
        self.textual_interview_service = TextualInterviewService()
    
    async def get_questions(self,selection: InterviewFormSelection):
        data = await self.textual_interview_service.get_questions(selection)
        return create_response(SUCCESS_STATUS,"questions fetched successfully",data = data)
    
    async def get_score(self,data : Answer,question_id : str):
        scores = await self.textual_interview_service.get_score(data,question_id)
        return create_response(SUCCESS_STATUS,"scores fetched successfully",data = scores)

    async def remove_textual_interview(self,question_id : str):
        await self.textual_interview_service.remove_textual_interview(question_id)
        return create_response(SUCCESS_STATUS,"Textual Interview deleted successfully")
