FROM python:3.12

WORKDIR /code

# Install poetry separately to cache the layer
RUN pip install poetry

# Copy dep files
COPY pyproject.toml poetry.lock* /code/

# Install and cache dependencies
# --no-root option to not install the current project package
RUN poetry config virtualenvs.create false \
    && poetry install --no-dev --no-interaction --no-ansi

COPY . /code/

CMD ["poetry", "run", "fastapi", "run", "src/main.py", "--port", "8080"]
