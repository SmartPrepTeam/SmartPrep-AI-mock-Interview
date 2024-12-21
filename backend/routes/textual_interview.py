from fastapi import APIRouter,status,Depends
from controllers.textual_interview_controller import TextualInterviewController
from schemas import InterviewFormSelection,Answer

router = APIRouter(
    prefix="/textual_interviews",
    tags=['Textual Interview']
)

def get_textual_interview_controller() -> TextualInterviewController:
    return TextualInterviewController()

"""ENDPOINTS FOR INTERVIEWS RELATED TO QUESTION GENERATION AND SCORING"""

@router.post("/questions",status_code=status.HTTP_201_CREATED,name="Generate Questions based on given selections")
async def get_questions(
    selection : InterviewFormSelection,
    textual_interview_controller: TextualInterviewController =  Depends(get_textual_interview_controller)
):
    print("Comes here 1")
    return await textual_interview_controller.get_questions(selection)

@router.post("/questions/{question_id}",status_code=status.HTTP_201_CREATED,name="Get scores for the given answers")
async def get_score(
    data : Answer,
    question_id : str,
    user_id : str,
    textual_interview_controller: TextualInterviewController =  Depends(get_textual_interview_controller)
):
    return await textual_interview_controller.get_score(data,question_id,user_id)

@router.post("/feedback",name="Get feedback from AI on an answer")
async def get_feedback(
    question : str,
    answer : str,
    textual_interview_controller : TextualInterviewController = Depends(get_textual_interview_controller)
):
    return await textual_interview_controller.get_feedback(question,answer)