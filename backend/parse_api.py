import requests
from requests.exceptions import HTTPError, JSONDecodeError

from log import logger


def fetch_random_data(url, keys):
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        result_list = []

        for i in data:
            result_dict = {key: i[key] for key in keys}
            result_list.append(result_dict)

        return result_list

    except HTTPError as http_err:
        logger.error(f"HTTP error occurred: {http_err} for URL: {url}")
        raise
    except JSONDecodeError as json_err:
        logger.error(f"JSON decoding error occurred: {json_err} for URL: {url}")
        raise
    except Exception as err:
        logger.error(f"Other error occurred: {err} for URL: {url}")
        raise


def random_bank(amount: int):
    bank_url = f"https://random-data-api.com/api/v2/banks?size={amount}"
    bank_keys = ["bank_name", "routing_number", "swift_bic"]

    return fetch_random_data(bank_url, bank_keys)

def random_user(amount: int):
    user_url = f"https://random-data-api.com/api/users/random_user?size={amount}"
    user_keys = ["first_name", "last_name", "username", "email", "password"]

    return fetch_random_data(user_url, user_keys)