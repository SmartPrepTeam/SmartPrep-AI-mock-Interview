from schemas import Answer,InterviewFormSelection
from utils.prompts import generate_mock_interview_prompt,score_the_answers
from config.mistral_ai import client
import json
from schemas import Answer,InterviewFormSelection,QuestionShortView,QuestionsList,AnswersList,ScoresView
from typing import List
from models.textual_question import TextualQuestion
from models.textual_answer import TextualAnswer
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
        '''   Generates questions   '''
        prompt = generate_mock_interview_prompt(selection.job_title,selection.job_description,selection.difficulty_level)
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
        new_question = TextualQuestion(
            job_description = selection.job_description,
            job_title = selection.job_title,
            difficulty_level = selection.difficulty_level,
            questions = json_data,
            user_id = user_object_id
        ) 
        await new_question.insert()
        return {"data" : json_data,"id" : str(new_question.id)}

    async def get_score(self,data : Answer,question_id : str):
        '''Fetch questions from the DB'''
        await self.validate_object_id(question_id)

        question_object_id =await self.convert_to_pydantic_object_id(question_id)
        print(f"Searching for question with ID: {question_object_id}")
        question = await TextualQuestion.find_one({"_id": question_object_id})
    
        if question is None:
            # Handle no document found
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Textual interview not found")


        ''' scores the answers '''
        prompt = score_the_answers(question.questions,data.answers)
        chat_response = client.chat.complete(
            model = "mistral-large-latest",
            messages = prompt
        )
        raw_response = chat_response.choices[0].message.content

        '''  Cleans the response   ''' 
        json_data = await self.clean_llm_response(raw_response)

        '''  makes a new entry in the db  '''
        new_scores = TextualAnswer(
            answers = data.answers,
            score = json_data,
           question_id = question_object_id
        )
        await new_scores.insert()
        return json_data


    async def get_all_interviews(self,user_id : str):

        await self.validate_object_id(user_id)
        user_object_id =await self.convert_to_pydantic_object_id(user_id)

        """Exclude the questions list using projection""" 
        questions_list = await TextualQuestion.find(
            {"user_id": user_object_id}
            ).project(QuestionShortView).to_list()

        # Convert user_id from ObjectId to string for all documents in the list
        for question in questions_list:
            question.user_id = str(question.user_id)
            question.id = str(question.id)

        return questions_list

    async def remove_textual_interview(self,question_id : str,user_id : str):

        await self.validate_object_id(question_id)
        await self.validate_object_id(user_id)

        question_object_id =await self.convert_to_pydantic_object_id(question_id)
        user_object_id = await self.convert_to_pydantic_object_id(user_id)

        """Deleting questions """
        await TextualQuestion.find({"_id" : question_object_id}).delete()
        """ Deleting answers and scores"""
        await TextualAnswer.find({"question_id" : question_object_id,"user_id": user_object_id}).delete()

    async def get_questions_with_answers(self , question_id : str,user_id : str):
        await self.validate_object_id(question_id)
        await self.validate_object_id(user_id)

        question_object_id =await self.convert_to_pydantic_object_id(question_id)
        user_object_id = await self.convert_to_pydantic_object_id(user_id)

        """ Get questions """
        res_questions = await TextualQuestion.find({"_id" : question_object_id}).project(QuestionsList)

        if not res_questions:
            raise HTTPException(
                status_code = HTTP_404_NOT_FOUND,
                detail = "Questions not found"
            )

        """ Get answers """
        res_answers = await TextualAnswer.find({"question_id" : question_object_id,"user_id": user_object_id}).project(AnswersList)

        if not res_answers:
            raise HTTPException(
                status_code = HTTP_404_NOT_FOUND,
                detail = "Answers not found"
            )
        return {
            "questions" : res_questions,
            "answers" : res_answers
        }

        async def get_scores(self,question_id : str, user_id : str):
            await self.validate_object_id(question_id)
            await self.validate_object_id(user_id)

            question_object_id =await self.convert_to_pydantic_object_id(question_id)
            user_object_id = await self.convert_to_pydantic_object_id(user_id)

            """ Get answers """
            scores = await TextualAnswer.find({"question_id" : question_object_id,"user_id": user_object_id}).project(ScoresView)

            if not scores:
                raise HTTPException(
                    status_code = HTTP_404_NOT_FOUND,
                    detail = "Scores not found"
                )
            return scores


