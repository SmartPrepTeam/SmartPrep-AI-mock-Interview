from fastapi import UploadFile,File,Form,HTTPException,status
import pdfplumber
import magic,json
from utils.prompts import extract_user_details_prompt
from config.mistral_ai import client

class ResumeParserService():
    
    def clean_llm_response(self,raw_response : str ) -> dict:
        #  Remove the backticks and the `json` marker
        if raw_response.startswith("```json"):
            raw_response = raw_response[7:] 
        if raw_response.endswith("```"):
            raw_response = raw_response[:-3] 
    
        # Clean up newlines and escaped quotes
        raw_response = raw_response.replace(r'\n', '\n').replace(r'\"', '"')
        try:
            json_data = json.loads(raw_response)
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse response: {e}")
        return json_data

    async def get_text_from_resume(self,resume : UploadFile = File(...)):
        try:
            with pdfplumber.open(resume.file) as pdf:
                text = ""
                for page in pdf.pages:
                    text += page.extract_text()
            return text
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to process the resume: {e}"
            )

    async def extract_user_info(self,text : str):
        try:
            prompt = extract_user_details_prompt(text)
            chat_response = client.chat.complete(
            model = "mistral-large-latest",
            messages = prompt
            )
            raw_response = chat_response.choices[0].message.content
            # print(raw_response)
            cleaned_response = self.clean_llm_response(raw_response)

            return cleaned_response
        except Exception as e:
            raise HTTPException(
                status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail = "Failed to extract user details"
            )
    async def save_to_db(self,user_details):
        print(user_details)

    async def parse_resume(self,resume : UploadFile = File(...),user_id : str = Form(...)):
        # check resume format
        mime_type = magic.from_buffer(await resume.read(),mime = True)
        resume.file.seek(0) 
        if mime_type != "application/pdf":
            raise HTTPException(
                status_code = status.HTTP_400_BAD_REQUEST,
                detail = "Resume must be in pdf format"
            ) 
        # parse the resume
        text = await self.get_text_from_resume(resume)
        # send the text to LLM
        user_details = await self.extract_user_info(text)
        # save the reponse to db
        await self.save_to_db(user_details)
        return user_details