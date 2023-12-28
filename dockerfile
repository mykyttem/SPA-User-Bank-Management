# FAST API SERVER
FROM python:3.11

WORKDIR /backend

# Copy only requirements.txt
COPY ./backend/requirements.txt ./ 
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything else
COPY ./backend /backend/

# Set the working directory for subsequent commands
WORKDIR /backend/db 

# For migrations database
RUN alembic revision --autogenerate -m "Initial"
RUN alembic upgrade head

# Reset working directory to the main backend directory
WORKDIR /backend

CMD ["python3", "main.py"]