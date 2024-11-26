from fastapi import APIRouter,status,Depends
from controllers.textual_interview_controller import TextualInterviewController
from schemas import InterviewFormSelection,Answer

router = APIRouter(
    prefix="/textual_interviews",
    tags=['Textual Interview']
)

def get_textual_interview_controller() -> TextualInterviewController:
    return TextualInterviewController()

@router.post("/questions",status_code=status.HTTP_201_CREATED,name="Generate Questions based on given selections")
async def get_questions(
    selection : InterviewFormSelection,
    textual_interview_controller: TextualInterviewController =  Depends(get_textual_interview_controller)
):
    return await textual_interview_controller.get_questions(selection)

@router.post("/questions/{question_id}",status_code=status.HTTP_201_CREATED,name="Get scores for the given answers")
async def get_score(
    data : Answer,
    question_id : str,
    textual_interview_controller: TextualInterviewController =  Depends(get_textual_interview_controller)
):
    return await textual_interview_controller.get_score(data,question_id)

@router.delete("/questions/{question_id}",name="Delete interview")
async def remove_textual_interview(
    user_id : str,
    question_id: str,
    textual_interview_controller: TextualInterviewController =  Depends(get_textual_interview_controller)
):
    return await textual_interview_controller.remove_textual_interview(question_id,user_id)

@router.get("/{user_id}",name="Get list of all the previous interviews")
async def get_all_interviews(
    user_id : str,
    textual_interview_controller : TextualInterviewController = Depends(get_textual_interview_controller)
):
    return await textual_interview_controller.get_all_interviews(user_id)

@router.get("/questions/{question_id}",name="Get all questions and answers for a specific interview")
async def get_questions_with_answers(
    question_id : str,
    user_id : str,
    textual_interview_controller : TextualInterviewController = Depends(get_textual_interview_controller)
    ):
    return await textual_interview_controller.get_questions_with_answers(question_id,user_id)

@router.get("/scores/{question_id}",name="Get scores for a specific interview")
async def get_scores(
    question_id : str,
    user_id : str,
    textual_interview_controller : TextualInterviewController = Depends(get_textual_interview_controller)
    ):
    return await textual_interview_controller.get_scores(question_id,user_id)