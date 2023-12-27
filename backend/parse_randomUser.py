import requests
from requests.exceptions import HTTPError

from log import logger


# request get random data user
def random_user(amount: int):
    try:
        random_user_url = f"https://random-data-api.com/api/users/random_user?size={amount}"

        # response
        response = requests.get(random_user_url)
        response.raise_for_status()
        jsonResponse = response.json()

        # random data users
        users_list = []

        for i in jsonResponse:
            user_dict = {
                "first_name": i["first_name"],
                "last_name": i["last_name"],
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