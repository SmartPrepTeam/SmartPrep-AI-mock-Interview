from fastapi import APIRouter,status,Depends
from controllers.textual_interview_controller import TextualInterviewController
from schemas import InterviewFormSelection,Answer

router = APIRouter(
    prefix="/textual_interviews",
    tags=['Textual Interview']
)

def get_textual_interview_controller() -> TextualInterviewController:
    return TextualInterviewController()

@router.post("/questions",status_code=status.HTTP_201_CREATED)
async def get_questions(
    selection : InterviewFormSelection,
    textual_interview_controller: TextualInterviewController =  Depends(get_textual_interview_controller)
):
    return await textual_interview_controller.get_questions(selection)

@router.post("/questions/{question_id}",status_code=status.HTTP_201_CREATED)
async def get_score(
    data : Answer,
    question_id : str,
    textual_interview_controller: TextualInterviewController =  Depends(get_textual_interview_controller)
):
    return await textual_interview_controller.get_score(data,question_id)

@router.delete("/questions/{question_id}")
async def remove_textual_interview(
    question_id: str,
    textual_interview_controller: TextualInterviewController =  Depends(get_textual_interview_controller)
):
    return await textual_interview_controller.remove_textual_interview(question_id)


