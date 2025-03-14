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
    global interviewDetails

    # Check if interview_id exists
    if question_id not in interviewDetails:
        return {"error": "Interview ID not found"}

    # Check if the user_id matches
    interview_info = interviewDetails[question_id]
    if interview_info["user_id"] != user_id:
        return {"error": "User ID mismatch for this interview"}
    confidence_scores = interview_info["results"]

    # **Delete all questions (reset results)**
    interview_info["results"] = {}

    # **Remove the interview_id if no more data exists**
    del interview_Details[interview_id]

    # **Reset the entire dictionary if empty**
    if not interview_Details:
        interview_Details = {}

    final_scores = await video_interview_controller.get_score(data,question_id,user_id,confidence_scores)
    confidence_scores.clear()
    return final_scores

@router.delete("/incomplete/{question_id}",name="Delete interview")
async def remove_incomplete_interview(
    user_id : str,
    question_id: str,
    token : TokenData = Depends(get_token_manager().get_current_user),
    video_interview_controller: VideoInterviewController =  Depends(get_video_interview_controller)
):
    return await video_interview_controller.remove_incomplete_interview(question_id,user_id)
