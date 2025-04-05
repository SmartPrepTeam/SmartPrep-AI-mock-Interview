import os
import json
from statistics import mean
from schemas import Answer
from utils.prompts import score_the_answers_prompt
from config.mistral_ai import client
from typing import List
from models.interview_question import InterviewQuestion
from models.interview_answer import InterviewAnswer
from fastapi import HTTPException, status
from beanie import PydanticObjectId
from bson import ObjectId

# Directory to store interview scores
SCORES_DIR = "interview_scores"
os.makedirs(SCORES_DIR, exist_ok=True)

class VideoInterviewService():
    
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
    async def clean_llm_response(raw_response: str) -> dict:
        cleaned_response = raw_response.strip('```json\n').strip('```')
        cleaned_response = cleaned_response.replace(r'\n', '\n').replace(r'\"', '"')
        try:
            json_data = json.loads(cleaned_response)
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse response: {e}")
        return json_data

    @staticmethod
    def findConfidenceForEachQuestion(interview_data: dict) -> List[float]:
        """Calculates the mean confidence score for each question."""
        return [mean(scores) for scores in interview_data.values() if scores]

    @staticmethod
    def deleteConfidenceFile(question_id : str):
        file_path = os.path.join(SCORES_DIR, f"{question_id}.json")
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                print(f"File {file_path} deleted successfully.")
            else:
                print(f"File {file_path} does not exist.")
        except Exception as e:
            print(f"Error deleting file {file_path}: {e}")

    async def get_score(self, data: Answer, question_id: str, user_id: str):
        """Fetches the interview data, calculates confidence, and scores the answers."""
        # getting confidence for each question
        file_path = os.path.join(SCORES_DIR, f"{question_id}.json")

        if os.path.exists(file_path):
            with open(file_path, "r") as f:
                interview_data = json.load(f)
        else:
            print("file ka masla hai")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to predict confidence"
            )
        
        if "results" not in interview_data:
            print("results are not there")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Invalid interview data format"
            )
        confidence_for_each = self.findConfidenceForEachQuestion(interview_data["results"])

        self.deleteConfidenceFile(question_id)

        # finding scores using llm
        await self.validate_object_id(question_id)
        await self.validate_object_id(user_id)
        
        question_object_id = await self.convert_to_pydantic_object_id(question_id)
        user_object_id = await self.convert_to_pydantic_object_id(user_id)

        question = await InterviewQuestion.find_one({"_id": question_object_id})
    
        if question is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Video interview not found"
            )
        
        prompt = score_the_answers_prompt(question.questions, data.answers)
        chat_response = client.chat.complete(
            model="mistral-large-latest",
            messages=prompt
        )
        raw_response = chat_response.choices[0].message.content
        print(raw_response)
        json_data = await self.clean_llm_response(raw_response)
        
        if isinstance(json_data, list) and len(json_data) == 1:
            json_data = json_data[0]  # Extract the dictionary from the list
        
        new_scores = InterviewAnswer(
            answers=data.answers,
            score=json_data,
            user_id=user_object_id,
            question_id=question_object_id,
            type = "video",
            video_confidence = confidence_for_each,
        )
        await new_scores.insert()
        return {"llm_scores" : json_data,"video_confidence" : confidence_for_each}

    async def remove_incomplete_interview(self, question_id: str, user_id: str):
        """Deletes an incomplete interview record."""
        # delete confidence file
        self.deleteConfidenceFile(question_id)
        # delete questions
        await self.validate_object_id(question_id)
        await self.validate_object_id(user_id)

        question_object_id = await self.convert_to_pydantic_object_id(question_id)
        user_object_id = await self.convert_to_pydantic_object_id(user_id)

        await InterviewQuestion.find_one({"_id": question_object_id}).delete()

    def remove_confidence_for_question(self,interview_id : str,user_id : str,question_no : int):
        # open the file
        file_path = os.path.join(SCORES_DIR, f"{interview_id}.json")
        print("comes here 1.1")
        if os.path.exists(file_path):
            with open(file_path, "r") as f:
                interview_data = json.load(f)
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to predict confidence"
            )
        print("comes here 1.2")
        if "results" in interview_data and str(question_no) in interview_data["results"]:
            del interview_data["results"][str(question_no)]
            print(f"Deleted confidence score for question {question_no}")
        print("comes here 1.3")
        # Write the updated data back to the file
        with open(file_path, "w") as f:
            json.dump(interview_data, f, indent=4)