#!/bin/bash
echo "Starting MongoDB..."
docker-compose up -d

echo "Starting FastAPI..."
uvicorn main:app --reload