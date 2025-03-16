from services.video_interview_service import VideoInterviewService
from schemas import Answer
from constants import SUCCESS_STATUS
from utils.helpers import create_response

class VideoInterviewController():
    def __init__(self):
        self.video_interview_service = VideoInterviewService()
    
    async def get_score(self,data : Answer,question_id : str,user_id : str):
        scores = await self.video_interview_service.get_score(data,question_id,user_id)
        return create_response(SUCCESS_STATUS,"scores fetched successfully",data = scores)

    async def remove_incomplete_interview(self,question_id : str,user_id : str):
        await self.video_interview_service.remove_incomplete_interview(question_id,user_id)
        return create_response(SUCCESS_STATUS,"Interview deleted successfully")

    def remove_confidence_scores(self,interview_id : str,user_id : str,question_no : int):
        self.video_interview_service.remove_confidence_for_question(interview_id,user_id,question_no)
        return create_response(SUCCESS_STATUS,"Confidence Scores for question {question_no} deleted successfully") 
