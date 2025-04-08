FROM python:3.10-slim

WORKDIR /api

# Install system dependencies for TensorFlow/Keras
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && apt-get clean \
    && apt-get install -y libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY ./requirements.txt /api/requirements.txt

RUN pip install tensorflow

RUN pip install --no-cache-dir -r /api/requirements.txt

# Copy backend code including the Keras model
COPY . /api

RUN mkdir -p /api/uploads

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]