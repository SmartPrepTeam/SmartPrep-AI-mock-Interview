import os
from mistralai import Mistral
from .setting import settings

api_key = os.environ["MISTRAL_API_KEY"] = settings.mistral_api_key

client = Mistral(api_key=api_key)
