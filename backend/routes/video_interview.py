from fastapi import APIRouter,status,Depends,Query
from controllers.video_interview_controller import VideoInterviewController
from schemas import Answer
from schemas import TokenData
from auth.token_manager import TokenManager

router = APIRouter(
    prefix="/video_interviews",
    tags=['Video Interview']
)

def get_video_interview_controller() -> VideoInterviewController:
    return VideoInterviewController()

def get_token_manager() -> TokenManager : 
    return TokenManager()

@router.post("/questions/{question_id}",status_code=status.HTTP_201_CREATED,name="Get scores for the given answers")
async def get_score(
    data : Answer,
    question_id : str,
    user_id : str = Query(...),
    token : TokenData = Depends(get_token_manager().get_current_user),
    video_interview_controller: VideoInterviewController =  Depends(get_video_interview_controller)
):
    return await video_interview_controller.get_score(data,question_id,user_id)

@router.delete("/incomplete/{question_id}",name="Delete interview")
async def remove_incomplete_interview(
    user_id : str,
    question_id: str,
    token : TokenData = Depends(get_token_manager().get_current_user),
    video_interview_controller: VideoInterviewController =  Depends(get_video_interview_controller)
):
    return await video_interview_controller.remove_incomplete_interview(question_id,user_id)

@router.delete("/frames/question/{interview_id}/{user_id}/{question_no}")
def remove_confidence_scores(
    interview_id : str,
    user_id : str,
    question_no : int,
    token : TokenData = Depends(get_token_manager().get_current_user),
    video_interview_controller: VideoInterviewController =  Depends(get_video_interview_controller)
):
    print("comes here hee")
    return video_interview_controller.remove_confidence_scores(interview_id,user_id,question_no)