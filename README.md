# SPA App
This Single Page Application (SPA) is a simple web application with two main pages: Users and Banks. 
The application is designed to allow the management of users and banks, including the ability to add, edit, and delete entries. 
Users can be associated with multiple banks, and banks can have several associated users.

---
## Deployment

### Method 1: Docker

1. Clone the repository: `git clone "repository_url"`
2. Set your own data in the `alembic.ini`, `config`, `.env` files.
3. Check if the MySQL server is running with `docker ps`. If not, try `docker-compose restart db`.
4. Run `docker-compose up`.


### Method 2: Manual Setup

#### For the backend:
   - Navigate to the `backend` directory.
   - Create a virtual environment: `virtualenv env`.
   - Activate the virtual environment: `env/Scripts/activate`.
   - Install dependencies: `pip install -r requirements.txt`.
   - Navigate to the `db` directory.
   - Generate Alembic migration: `alembic revision --autogenerate -m "Initial"`.
   - Apply the migration: `alembic upgrade head`.
   - Navigate back to the root directory.
   - Start the FastAPI server: `python main.py`.


#### For the frontend:
   - Navigate to the `frontend` directory.
   - Install dependencies: `npm install`.
   - Start the React server: `npm start`.

Open your browser and access the application at the specified address.

[localhost](http://localhost:3000)



---

## Features
#### Users Page
List of users with the following fields:
- id
- first_name
- last_name
- username
- email
- password

Each user entry can be edited or deleted.

#### Banks Page

List of banks with the following fields:

- id
- bank_name
- routing_number
- swift_bic

Each bank entry can be edited or deleted.

- Relationship Support:
- Every user can have several banks.
- Every bank can have several users.

The edit page must support updates for these relations. A bank cannot be deleted if there are users associated with it.

#### Add Objects
- Both pages have an "add" button where you can specify the number of objects to add.

- Data for new objects is fetched from [Random Data API](https://random-data-api.com/) (id can  be auto-generated, no authentication required).

---
## Tech Stack
#### Backend

- FastAPI 
- SQLAlchemy 
- Alembic

#### Frontend

- React
- JavaScript

#### Database

- MySQL