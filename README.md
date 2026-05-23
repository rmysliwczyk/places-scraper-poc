# Places Scraper POC
This is a POC of a project that contains three components: scraper, backend, and frontend. It is very simple at the moment. No LLM's were used for this project.

## 📥 Deployment
If you wish to deploy the app yourself follow these steps:

- Install [Docker](https://docs.docker.com/engine/install/) with Docker Compose or [Podman](https://podman.io/docs/installation) with Podman Compose. If you use Podman, replace `docker` command with `podman` in the following steps.
- `git clone` the repository or download and extract the .zip with the source code.
- `cd /directory/with/the/sourcecode/scraper`
- `mv .env.example .env`
- Add your Google Places API key to .env in scraper directory
- `cd ../frontend`
- `mv .env.example .env`
- `docker compose up  --build -d`
- Visit `http://127.0.0.1:8988` to access the scraper frontend

## 💻 Technologies used
- **Typescript** + **React** for frontend
- **Python** + **FastAPI** for backend/scraper
- **SQLModel** for the ORM and database integration
- **SQLite** for the database
- **Jenkins** for CI/CD
- **Docker** + **Docker Compose** for CI/CD
- **Google Places API** as source for data

## 🌟 Possible future improvements
- MaterialUI or other component library for the UI
- Ingestion endpoint for the API, so that it can be fed data frome remote server
- Auth
- More reusable/extendable code
- Mode fields scraped from the Google Places API
