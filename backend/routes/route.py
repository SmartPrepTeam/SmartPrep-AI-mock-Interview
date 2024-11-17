from fastapi import APIRouter
from config.mistral_ai import client
from utils.prompts import generate_mock_interview_prompt,score_the_answers
import json
from schemas import Difficulty,Answer,InterviewFormSelection
from typing import List
# from config.db import textQuiz_collection,textAns_collection
from datetime import datetime
from bson import Binary

router = APIRouter()

@router.post("/interviews/")
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

    mockId_binary = Binary.from_uuid(uuid4())
    # making a new entry in the db
    textQuiz_collection.insert_one(
        {
        "job_description": selection.job_description,
        "job_title": selection.job_title,
        "difficulty_level": selection.difficulty_level,
        "id": mockId_binary,
        "questions" : json_data,
        "userID" : selection.userID,
        "createdAt" : datetime.now()
    })
    return {"data" : json_data,"id" : str(mock_id)}

@router.post("/interviews/{mockId}")
async def score_textual_quiz(mockId:UUID, data : Answer):
    # Fetch questions from the DB
    mockId_binary = Binary.from_uuid(mockId)
    response = textQuiz_collection.find_one({"id": mockId_binary})

    if not response:
        # Handle no document found
        raise HTTPException(status_code=404, detail="Quiz not found")

    # scoring the answers
    prompt = score_the_answers(response["questions"],data.answers)
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
    textAns_collection.insert_one(
        {
            "id":Binary.from_uuid(uuid4()),
            "answers" : data.answers,
            "score" : json_data,
            "quizId" : mockId_binary,
            "createdAt" : datetime.now().strftime("%d-%m-%Y")
    })
    return json_data