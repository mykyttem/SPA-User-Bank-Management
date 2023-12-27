# requests
import requests
from requests.exceptions import HTTPError

# fast api
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

# sqlalchemy
from sqlalchemy.exc import ProgrammingError, OperationalError, DatabaseError

# files
from log import logger
from database import engine
from models import Users


"""
    - Settings fast api
    - get random user, when click button
    - save in DB
    - display always from db
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

# request get random data user
def get_random_user(amount: int):
    try:
        random_user_url = f"https://random-data-api.com/api/users/random_user?size={amount}"
        response = requests.get(random_user_url)
        response.raise_for_status()
        jsonResponse = response.json()

        users_list = []

        for i in jsonResponse:
            user_dict = {
                "first_name": i["first_name"],
                "username": i["username"],
                "email": i["email"],
                "password": i["password"]
            }
            users_list.append(user_dict)

        return users_list

    except HTTPError as http_err:
        logger.error(f"HTTP error occurred: {http_err}")
        raise
    except Exception as err:
        logger.error(f"Other error occurred: {err}")
        raise


# fast api
class DataToReceive(BaseModel):
    data: int


@app.post("/api/users")
async def receive_data(amount: DataToReceive):
    # get amount 
    amount = amount.data
    user_data = get_random_user(amount=amount)

    try:
        with engine.connect() as connection:
            logger.info(f'Successfully connected to database')  

            for user_dict in user_data:
                # Save the users to the database
                connection.execute(Users.__table__.insert().values(user_dict))
                connection.commit()

            # Fetch all users from the "Users" table after insertion
            users_result = connection.execute(Users.__table__.select())
            users = users_result.fetchall()

            # Extract user data from the result set
            users_data = [
                {
                    "id": user.id,
                    "first_name": user.first_name,
                    "username": user.username,
                    "email": user.email,
                    "password": user.password
                }
                for user in users
            ]

        logger.info("Connection to the database closed")
    except (OperationalError, ProgrammingError, DatabaseError) as e:
        logger.error(f"Connection failed. Error: {e}")

        # Set users_data to an empty list in case of an error
        users_data = []


    return {"users": users_data}