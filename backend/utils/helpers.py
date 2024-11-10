import json 

def clean_llm_response(raw_response : str ) -> dict:
    cleaned_response = raw_response.strip('```json\n').strip('```')
    cleaned_response = cleaned_response.replace(r'\n', '\n').replace(r'\"', '"')
    try:
        json_data = json.loads(cleaned_response)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse response: {e}")
    return json_data