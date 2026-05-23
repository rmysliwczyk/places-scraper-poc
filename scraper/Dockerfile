FROM python:3.13-slim-trixie

WORKDIR /

COPY . /
RUN pip install -r requirements.txt

VOLUME /database

ENTRYPOINT ["python", "main.py"]
