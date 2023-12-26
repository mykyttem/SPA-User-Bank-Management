## Deployment

1. Clone the repository: `git clone "url repository"`
2. Create virtual venv
3. Activate venv
4. Install dependencies: `pip install -r requirements.txt`
5. In file alembic.init and config, set own data
6. `cd backend`
7. for migrations database `alembic revision --autogenerate -m "Initial` 
8. `alembic upgrade head`