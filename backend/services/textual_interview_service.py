from schemas import Answer,InterviewFormSelection
from utils.prompts import generate_mock_interview_prompt,score_the_answers
from config.mistral_ai import client
import json
from schemas import Difficulty,Answer,InterviewFormSelection
from typing import List
from models.textual_question import TextualQuestion
from datetime import datetime
from bson import Binary
from fastapi import HTTPException,status

class TextualInterviewService():

    @staticmethod
    async def clean_llm_response(raw_response : str ) -> dict:
        cleaned_response = raw_response.strip('```json\n').strip('```')
        cleaned_response = cleaned_response.replace(r'\n', '\n').replace(r'\"', '"')
        try:
            json_data = json.loads(cleaned_response)
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse response: {e}")
        return json_data

    async def get_questions(selection : InterviewFormSelection):
        # generating questions
        prompt = generate_mock_interview_prompt(selection.job_title,selection.job_description,selection.difficulty_level)
        chat_response = client.chat.complete(
            model = "mistral-large-latest",
            messages = prompt
        )
        raw_response = chat_response.choices[0].message.content

        # Cleaning the response 
        json_data = clean_llm_response(raw_response)

        # making a new entry in the db
        new_question = TextualQuestion(
            job_description = selection.job_description,
            job_title = selection.job_title,
            difficulty_level = selection.difficulty_level,
            questions = json_data,
            user_id : selection.userID
        ) 
        await new_question.insert()
        return {"data" : json_data,"id" : str(mock_id)}

    async def get_scores(data : Answer,question_id : str):
        # Fetch questions from the DB
        validateObjectId(question_id)

        question_object_id = convert_to_pydantic_object_Id(question_id)
        question = await TextualQuestion.find_one({"_id": question_object_id})

        if not question:
            # Handle no document found
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Textual interview not found")

        # scoring the answers
        prompt = score_the_answers(question["questions"],data.answers)
        chat_response = client.chat.complete(
            model = "mistral-large-latest",
            messages = prompt
        )
        raw_response = chat_response.choices[0].message.content

        # Cleaning the response 
        json_data = clean_llm_response(raw_response)

        # making a new entry in the db
        new_scores = TextualAnswer(
            answers = data.answers,
            score = json_data,
           question_id = question_object_id
        )
        await new_scores.insert()
        return json_data