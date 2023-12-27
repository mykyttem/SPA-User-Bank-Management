import json

import requests
from requests.exceptions import HTTPError

from log import logger


# request get random data user
def random_bank(amount: int):
    try:
        random_bank_url = f"https://random-data-api.com/api/v2/banks?size={amount}"

        # response
        response = requests.get(random_bank_url)
        response.raise_for_status()
        jsonResponse = json.loads(response.text)

        # random data users
        banks_list = []

        for i in jsonResponse:
            bank_dict = {
                "bank_name": i["bank_name"],
                "routing_number": i["routing_number"],
                "swift_bic": i["swift_bic"]
            }
            banks_list.append(bank_dict)

        return banks_list

    except HTTPError as http_err:
        logger.error(f"HTTP error occurred: {http_err}")
        raise
    except Exception as err:
        logger.error(f"Other error occurred: {err}")
        raise