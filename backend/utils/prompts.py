# Question Generation
def generate_mock_interview_prompt(job_title, job_description, difficulty_level,no_of_questions):
    conversation = [
       {
            "role": "user",
            "content": f"""
        You are an interview question generation bot. Your task is to create a set of {no_of_questions} interview questions in JSON format based on the following parameters:

        - Job Title: {job_title}
        - Job Description: {job_description}
        - Difficulty Level: {difficulty_level}

        Ensure each question aligns with the job title and job description provided and matches the specified difficulty level. Focus on assessing relevant skills, competencies, and situational judgment for the job.

        **Return the output strictly in this JSON format:**
        ```json
        {{
            "questions": [
                "Question 1?",
                "Question 2?",
                "Question 3?",
                ...
            ]
        }}
        ```

        Do not include any additional metadata like question type. Only return the JSON object.
        """
        }
    ]
    return conversation

    # Scoring the answers
def score_the_answers_prompt(questions,answers):
    conversation = [
        {
            "role": "user",
            "content": f"""
            You are an AI-powered interview evaluator. For each question, compare the user’s answer with an ideal response and score it based on four criteria: Tone, Clarity, Accuracy, and Grammar.

            Use the following Evaluation Process:
            - Question : {questions}
            - Ideal Answer: [Your Generated Answer]
            - User Answer: {answers}
            
            Scoring Rules:
            - Rate each category as a single integer (1-10).
            - If an answer is too brief (less than 5 words) or a generic response like "I don’t know", assign 0 for all categories.
            - Do NOT use arrays or lists —each category should have a single integer score.


            Give Output in Strict JSON Format
            ```json
            {{
            "Tone":  [0-10],  
            "Clarity": [0-10],  
            "Accuracy": [0-10],  
            "Grammar": [0-10],  
            "Feedback": "Provide a short overall performance review."
            }}
            ```
            """
            }
    ]
    return conversation 

def generate_feedback_prompt(question,user_answer):
    conversation = [
        {
        "role": "user",
        "content": f""" 
        You are an interview answer evaluator bot. For each question, generate an ideal answer in 5 lines and compare it with the user’s answer. Provide improvements related to Tone, Clarity, Accuracy, and Grammar within a single property called "Improvements." Return the output strictly in JSON format as shown below.

        - Question: {question}
        - Ideal Answer: [Your Generated Answer]
        - User Answer: {user_answer}

        Evaluate the user’s answer based on these criteria: Tone, Clarity, Accuracy, and Grammar. Provide detailed textual improvements addressing all these criteria.

        Provide the output strictly in the following JSON format:
        {{
        "Improvements": "[Combined suggestions for improving tone, clarity, accuracy, and grammar in the user’s answer]"
        }}

        Do not include any other text in your response.
        """
            }
    ]
    return conversation

def extract_user_details_prompt(resume):
    conversation = [
        {
            "role": "user",
            "content": f"""You are an AI bot specialized in resume parsing. Your task is to extract specific details from the provided {resume}. You should extract the following information:
            - full_name
            - email_address
            - linkedin_profile_url
            - github_profile_url
            - employment_history (extract details for the most recent two jobs, including job_title, company_name, dates_of_employment, location, and job_type (remote, full-time, part-time))
            - current_position (with fields job_title and company_name if available)
            - programming_languages
            - databases
            - frameworks_libraries
            - soft_skills
            - current_country
            - current_state
            Return the extracted information in JSON format only. Ensure the data is structured clearly, with appropriate fields for each piece of information. If any information is not available or not found, leave the corresponding field empty or null."""
        }
    ]
    return conversation
