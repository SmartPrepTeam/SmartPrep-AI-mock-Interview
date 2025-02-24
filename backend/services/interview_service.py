from schemas import Answer
import json
from schemas import Answer,QuestionShortView,QuestionsList,AnswersList,ScoresView,InterviewType
from typing import List
from models.interview_question import InterviewQuestion
from models.interview_answer import InterviewAnswer
from fastapi import HTTPException,status
from beanie import PydanticObjectId
from bson import ObjectId


class InterviewService():

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
     

    async def get_all_interviews(self,user_id : str):

        await self.validate_object_id(user_id)
        user_object_id =await self.convert_to_pydantic_object_id(user_id)

        """Exclude the questions list using projection""" 
        questions_list = await InterviewQuestion.find(
            {"user_id": user_object_id}
            ).project(QuestionShortView).to_list()

        # Convert user_id from ObjectId to string for all documents in the list
        for question in questions_list:
            print(question)
            question.user_id = str(question.user_id)
            question.id = str(question.id)

        return questions_list

    async def remove_interview(self,question_id : str,user_id : str):

        await self.validate_object_id(question_id)
        await self.validate_object_id(user_id)

        question_object_id =await self.convert_to_pydantic_object_id(question_id)
        user_object_id = await self.convert_to_pydantic_object_id(user_id)

        """Deleting questions """
        await InterviewQuestion.find({"_id" : question_object_id}).delete()
        """ Deleting answers and scores"""
        await InterviewAnswer.find({"question_id" : question_object_id,"user_id": user_object_id}).delete()

    async def get_questions_with_answers(self , question_id : str,user_id : str):
        await self.validate_object_id(question_id)
        await self.validate_object_id(user_id)

        question_object_id =await self.convert_to_pydantic_object_id(question_id)
        user_object_id = await self.convert_to_pydantic_object_id(user_id)

        """ Get questions """
        res_questions = await InterviewQuestion.find_one({"_id" : question_object_id}).project(QuestionsList)

        if not res_questions:
            raise HTTPException(
                status_code = HTTP_404_NOT_FOUND,
                detail = "Questions not found"
            )

        """ Get answers """
        res_answers = await InterviewAnswer.find_one({"question_id" : question_object_id,"user_id": user_object_id}).project(AnswersList)

        if not res_answers:
            raise HTTPException(
                status_code = HTTP_404_NOT_FOUND,
                detail = "Answers not found"
            )
        return {
            "questions_object" : res_questions,
            "answers_object" : res_answers
        }

    async def get_scores(self,question_id : str, user_id : str):
        await self.validate_object_id(question_id)
        await self.validate_object_id(user_id)

        question_object_id =await self.convert_to_pydantic_object_id(question_id)
        user_object_id = await self.convert_to_pydantic_object_id(user_id)

        """ Get answers """
        scores = await InterviewAnswer.find_one({"question_id" : question_object_id,"user_id": user_object_id}).project(ScoresView)

        if not scores:
            raise HTTPException(
                status_code = HTTP_404_NOT_FOUND,
                detail = "Scores not found"
            )
        return scores
    async def get_recent_interviews(self,user_id : str , page : int,page_size : int):
        if page < 1 :
            raise HTTPException(
                status_code = HTTP_400_BAD_REQUEST,
                detail = "Page does not exist"
            )

        await self.validate_object_id(user_id)

        user_object_id = await self.convert_to_pydantic_object_id(user_id)
        skip_count = (page - 1)*page_size
        interview_cursor = ( InterviewQuestion.find({"user_id": user_object_id}).sort([("createdAt",-1)]).skip(skip_count).limit(page_size).project(QuestionShortView))
        interviews = await interview_cursor.to_list(length=page_size)
        for interview in interviews:
            interview.user_id = str(interview.user_id)
            interview.id = str(interview.id)
        # check if there are more documents
        total_interviews = await InterviewQuestion.find({"user_id": user_object_id}).count()
        has_next_page = (page*page_size) < total_interviews
        print(interviews)
        return {
            "results" : interviews,
            "hasNextPage" : has_next_page
        }