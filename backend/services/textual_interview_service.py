from schemas import Answer,InterviewFormSelection
from utils.prompts import generate_mock_interview_prompt,score_the_answers_prompt,generate_feedback_prompt
from config.mistral_ai import client
import json
from schemas import Answer,InterviewFormSelection,QuestionShortView,QuestionsList,AnswersList,ScoresView,InterviewType
from typing import List
from models.interview_question import InterviewQuestion
from models.interview_answer import InterviewAnswer
from fastapi import HTTPException,status
from beanie import PydanticObjectId
from bson import ObjectId


class TextualInterviewService():

    @staticmethod
    async def validate_object_id(id: str):
        """Validates the given ID format."""
        if not ObjectId.is_valid(id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid ID format"
            )

    @staticmethod
    async def convert_to_pydantic_object_id(id: str) -> PydanticObjectId:
        """Converts a string ID to a PydanticObjectId."""
        return PydanticObjectId(id)

    @staticmethod
    async def clean_llm_response(raw_response : str ) -> dict:
        cleaned_response = raw_response.strip('```json\n').strip('```')
        cleaned_response = cleaned_response.replace(r'\n', '\n').replace(r'\"', '"')
        try:
            json_data = json.loads(cleaned_response)
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse response: {e}")
        return json_data

    async def get_questions(self,selection : InterviewFormSelection):
        print("Comes here 3")
        '''   Generates questions   '''
        prompt = generate_mock_interview_prompt(selection.job_title,selection.job_description,selection.difficulty_level,selection.no_of_questions)
        chat_response = client.chat.complete(
            model = "mistral-large-latest",
            messages = prompt
        )
        raw_response = chat_response.choices[0].message.content

        '''  Cleans the response '''
        json_data = await self.clean_llm_response(raw_response)
        if isinstance(json_data, dict):
            json_data = json_data.get('questions', [])

        await self.validate_object_id(selection.userID)
        user_object_id =await self.convert_to_pydantic_object_id(selection.userID)

        '''  makes a new entry in the db  '''
        new_question = InterviewQuestion(
            job_description = selection.job_description,
            job_title = selection.job_title,
            difficulty_level = selection.difficulty_level,
            no_of_questions = selection.no_of_questions,
            question_type = selection.question_type,
            questions = json_data,
            user_id = user_object_id
        ) 
        await new_question.insert()
        return {"data" : json_data,"id" : str(new_question.id)}

    async def get_score(self,data : Answer,question_id : str,user_id : str):
        '''Fetch questions from the DB'''
        await self.validate_object_id(question_id)
        await self.validate_object_id(user_id)

        question_object_id =await self.convert_to_pydantic_object_id(question_id)
        user_object_id = await self.convert_to_pydantic_object_id(user_id)

        question = await InterviewQuestion.find_one({"_id": question_object_id})
    
        if question is None:
            # Handle no document found
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Textual interview not found")


        ''' scores the answers '''
        prompt = score_the_answers_prompt(question.questions,data.answers)
        chat_response = client.chat.complete(
            model = "mistral-large-latest",
            messages = prompt
        )
        raw_response = chat_response.choices[0].message.content

        '''  Cleans the response   ''' 
        json_data = await self.clean_llm_response(raw_response)
        if isinstance(json_data, list) and len(json_data) == 1:
            json_data = json_data[0]  # Extract the dictionary from the list
        '''  makes a new entry in the db  '''
        new_scores = InterviewAnswer(
            answers = data.answers,
            score = json_data,
            user_id = user_object_id,
           question_id = question_object_id
        )
        await new_scores.insert()
        return json_data

    async def get_feedback(self,question : str,answer : str):

        prompt = generate_feedback_prompt(question,answer)

        chat_response = client.chat.complete(
            model = "mistral-large-latest",
            messages = prompt
        )
        raw_response = chat_response.choices[0].message.content
        '''  Cleans the response '''
        json_data = await self.clean_llm_response(raw_response)
        return json_data

