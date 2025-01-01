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

        Ensure each question aligns with the job title and job description provided and matches the specified difficulty level. Focus on assessing relevant skills, competencies, and situational judgment for the job.Only return the JSON. Do not include explanations or notes.
        """
        }
    ]
    return conversation

    # Scoring the answers
def score_the_answers_prompt(questions,answers):
    conversation = [
        {
            "role":"user",
            "content":f""" 
            You are an interview answer evaluator bot. For each question, generate an ideal answer and compare it with the user’s answer based on the following criteria: Tone, Clarity, Accuracy, and Grammar. Rate each criterion from 1 to 10 and provide overall feedback in 3 to 5 lines. Return the evaluation in JSON format as shown below.

            - Question : {questions}
            - Ideal Answer: [Your Generated Answer]
            - User Answer: {answers}

            Evaluate the user’s answer based on these criteria:

            - Tone: Rate the alignment of tone with professional expectations.
            - Clarity: Rate how clear and understandable the answer is.
            - Accuracy: Rate how accurately the answer addresses the question.
            - Grammar: Rate grammar quality.

            Provide the output strictly in the following JSON format:
            {{
            "Tone": [1-10],
            "Clarity": [1-10],
            "Accuracy": [1-10],
            "Grammar": [1-10],
            "Feedback": "[Brief overall feedback in 3 to 5 lines]"
            }}

            Do not include any other text in your response.
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
