# Stage 1: Build React App
FROM node:14 AS frontend-builder

WORKDIR /frontend

# Copy only package.json and package-lock.json
COPY ./frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY ./frontend .

# Build the React app
RUN npm run build

# Stage 2: Build FastAPI Server
FROM python:3.11 AS backend-builder

WORKDIR /backend

# Copy only requirements.txt
COPY ./backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend 
COPY ./backend .

# Set the working directory for subsequent commands
WORKDIR /backend/db 

# For migrations database
RUN alembic revision --autogenerate -m "Initial"
RUN alembic upgrade head

# Reset working directory to the main backend directory
WORKDIR /backend

# Copy the frontend build artifacts from the first stage
COPY --from=frontend-builder /frontend/build ./frontend/build

# Expose ports
EXPOSE 3000 8000

# Use ENTRYPOINT to set the default command to run on container start
ENTRYPOINT ["python3", "main.py"]