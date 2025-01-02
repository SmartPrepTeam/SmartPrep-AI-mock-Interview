from fastapi import APIRouter,status,Depends
from controllers.textual_interview_controller import TextualInterviewController
from schemas import InterviewFormSelection,Answer,FeedbackData
from schemas import TokenData
from auth.token_manager import TokenManager

router = APIRouter(
    prefix="/textual_interviews",
    tags=['Textual Interview']
)

def get_textual_interview_controller() -> TextualInterviewController:
    return TextualInterviewController()

def get_token_manager() -> TokenManager : 
    return TokenManager()

@router.post("/questions",status_code=status.HTTP_201_CREATED,name="Generate Questions based on given selections")
async def get_questions(
    selection : InterviewFormSelection,
    token : TokenData = Depends(get_token_manager().get_current_user),
    textual_interview_controller: TextualInterviewController =  Depends(get_textual_interview_controller)
):
    return await textual_interview_controller.get_questions(selection)

@router.post("/questions/{question_id}",status_code=status.HTTP_201_CREATED,name="Get scores for the given answers")
async def get_score(
    data : Answer,
    question_id : str,
    user_id : str,
    token : TokenData = Depends(get_token_manager().get_current_user),
    textual_interview_controller: TextualInterviewController =  Depends(get_textual_interview_controller)
):
    return await textual_interview_controller.get_score(data,question_id,user_id)

@router.post("/feedback")
async def get_feedback(
    data : FeedbackData,
    token : TokenData = Depends(get_token_manager().get_current_user),
    textual_interview_controller : TextualInterviewController = Depends(get_textual_interview_controller)
):
    return await textual_interview_controller.get_feedback(data.question,data.answer)