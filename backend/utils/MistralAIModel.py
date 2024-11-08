import os
from mistralai import Mistral
from .Constants import MISTRAL_API_KEY

api_key = os.environ["MISTRAL_API_KEY"] = MISTRAL_API_KEY

client = Mistral(api_key=api_key)
