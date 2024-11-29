from services.textual_interview_service import TextualInterviewService
from schemas import Answer,InterviewFormSelection
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

    async def remove_textual_interview(self,question_id : str,user_id : str):
        await self.textual_interview_service.remove_textual_interview(question_id,user_id)
        return create_response(SUCCESS_STATUS,"Textual Interview deleted successfully")

    async def get_all_interviews(self,user_id : str):
        questions_list = await self.textual_interview_service.get_all_interviews(user_id)
        return create_response(SUCCESS_STATUS,"All previous Textual Interview Questions fetched Successfully",data = questions_list)

    async def get_questions_with_answers(self,question_id : str,user_id : str):
        res = await self.textual_interview_service.get_questions_with_answers(question_id,user_id)
        return create_response(SUCCESS_STATUS,f"Questions and answers for interview with id {question_id} fetched successfully",data = res)

    async def get_scores(self,question_id : str,user_id : str):
        res = await self.textual_interview_service.get_scores(question_id,user_id)
        return create_response(SUCCESS_STATUS,f"Scores for interview with id {question_id} fetched successfully",data = res)

    async def get_feedback(self,question : str,answer : str):
        res = await self.textual_interview_service.get_feedback(question,answer)
        return create_response(SUCCESS_STATUS,f"Feedback fetched successfully",data = res)
            
