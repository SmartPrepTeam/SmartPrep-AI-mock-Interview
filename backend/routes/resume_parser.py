from fastapi import APIRouter,File,UploadFile,Depends,Form
from controllers.resume_parser_controller import ResumeParserController
from schemas import TokenData
from auth.token_manager import TokenManager

router = APIRouter(
    prefix = "/resume",
    tags = ["Resume Parser"]
)

def get_resume_parser_controller() -> ResumeParserController:
    return ResumeParserController()

def get_token_manager() -> TokenManager : 
    return TokenManager()

@router.post("/upload",name="Generate User profile from Resume")
async def parse_resume(
    resume : UploadFile = File(...),
    user_id: str = Form(...),
    token : TokenData = Depends(get_token_manager.get_current_user()),
    resume_parser_controller : ResumeParserController = Depends(get_resume_parser_controller)
    ):
    return await resume_parser_controller.parse_resume(resume,user_id)
    

