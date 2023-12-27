# fast api
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# routers
from routers import users


"""
    - Settings fast api
"""


# settings fast api
app = FastAPI()

origins = [
    "http://localhost:3000"
]

# middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Include the routers
app.include_router(users.router, prefix="/api/users")


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)