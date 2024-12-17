from fastapi import APIRouter,Depends
from controllers.interview_controller import InterviewController

router = APIRouter(
    prefix="/interviews",
    tags=['Interview']
)

def get_interview_controller() -> InterviewController:
    return InterviewController()
    """  ENDPOINTS RELATED TO PREVIOUS INTERVIEWS """

@router.get("/{user_id}",name="Get list of all the previous interviews")
async def get_all_interviews(
    user_id : str,
    interview_controller : InterviewController = Depends(get_interview_controller)
):
    return await interview_controller.get_all_interviews(user_id)


@router.get("/questions/{question_id}",name="Get all questions and answers for a specific interview")
async def get_questions_with_answers(
    question_id : str,
    user_id : str,
    interview_controller : InterviewController = Depends(get_interview_controller)
    ):
    return await interview_controller.get_questions_with_answers(question_id,user_id)

@router.get("/scores/{question_id}",name="Get scores for a specific interview")
async def get_scores(
    question_id : str,
    user_id : str,
    interview_controller : InterviewController = Depends(get_interview_controller)
    ):
    return await interview_controller.get_scores(question_id,user_id)

@router.delete("/questions/{question_id}",name="Delete interview")
async def remove_interview(
    user_id : str,
    question_id: str,
    interview_controller: InterviewController =  Depends(get_interview_controller)
):
    return await interview_controller.remove_interview(question_id,user_id)