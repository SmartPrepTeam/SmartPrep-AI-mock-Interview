from pydantic import BaseModel
from enum import Enum
from utils.MistralAIModel import client
from prompts import generate_mock_interview_prompt,score_the_answers
from fastapi import FastAPI
import json

# Data Model Classes 
class difficulty(str,Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"

class InterviewFormSelection(BaseModel):
    difficulty_level : difficulty
    job_title : str
    job_description : str

app = FastAPI()

@app.post("/textualQuizzes/")
async def create_new_textual_quiz(selection : InterviewFormSelection):
    # generating questions
    prompt = generate_mock_interview_prompt(selection.job_title,selection.job_description,selection.difficulty_level)
    chat_response = client.chat.complete(
        model = "mistral-large-latest",
        messages = prompt
    )
    raw_response = chat_response.choices[0].message.content

    # Cleaning the response 
    cleaned_response = raw_response.strip('```json\n').strip('```')
    cleaned_response = cleaned_response.replace(r'\n', '\n').replace(r'\"', '"')
    json_data = json.loads(cleaned_response)

    # making a new entry in the db
    
    return json_data
    username = laibakhalil6194
    password = 7y2ylmMobXIMNd0T