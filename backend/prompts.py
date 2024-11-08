# Question Generation
def generate_mock_interview_prompt(job_title, job_description, difficulty_level):
    conversation = [
        {
            "role": "user",
            "content": f"""
        You are an interview question generation bot. Your task is to create a set of 10 interview questions in JSON format based on the following parameters:

        - Job Title: {job_title}
        - Job Description: {job_description}
        - Difficulty Level: {difficulty_level}

        Ensure each question aligns with the job title and job description provided and matches the specified difficulty level. Focus on assessing relevant skills, competencies, and situational judgment for the job.Only return the JSON. Do not include explanations or notes.
        """
        }
    ]
    return conversation

    # Scoring the answers
def score_the_answers(questions,answers):
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