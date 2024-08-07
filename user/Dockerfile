FROM python:3.12

RUN pip install poetry

WORKDIR /code

COPY . .

RUN poetry install

CMD ["poetry", "run", "fastapi", "run", "src/main.py", "--port", "8080"]
