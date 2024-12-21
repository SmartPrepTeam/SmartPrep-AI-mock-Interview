from services.interview_service import InterviewService
from typing import Any,Dict
from constants import SUCCESS_STATUS
from utils.helpers import create_response

class InterviewController():
    def __init__(self):
        self.interview_service = InterviewService()

    async def remove_interview(self,question_id : str,user_id : str):
        await self.interview_service.remove_interview(question_id,user_id)
        return create_response(SUCCESS_STATUS,"Interview deleted successfully")

    async def get_all_interviews(self,user_id : str):
        questions_list = await self.interview_service.get_all_interviews(user_id)
        return create_response(SUCCESS_STATUS,"All previous Interview Details fetched Successfully",data = questions_list)

    async def get_questions_with_answers(self,question_id : str,user_id : str):
        res = await self.interview_service.get_questions_with_answers(question_id,user_id)
        return create_response(SUCCESS_STATUS,f"Questions and answers for interview with id {question_id} fetched successfully",data = res)

    async def get_scores(self,question_id : str,user_id : str):
        res = await self.interview_service.get_scores(question_id,user_id)
        return create_response(SUCCESS_STATUS,f"Scores for interview with id {question_id} fetched successfully",data = res)
            
