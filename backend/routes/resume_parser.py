from fastapi import APIRouter,File,UploadFile,Depends,Form
from controllers.resume_parser_controller import ResumeParserController

router = APIRouter(
    prefix = "/resume",
    tags = ["Resume Parser"]
)

def get_resume_parser_controller() -> ResumeParserController:
    return ResumeParserController()

@router.post("/upload",name="Generate User profile from Resume")
async def parse_resume(
    resume : UploadFile = File(...),
    user_id: str = Form(...),
    resume_parser_controller : ResumeParserController = Depends(get_resume_parser_controller)
    ):
    print("comes here ....")
    return await resume_parser_controller.parse_resume(resume,user_id)
    

