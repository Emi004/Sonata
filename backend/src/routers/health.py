from fastapi import APIRouter

health = APIRouter()

@health.get("/health", status_code=200,
            summary='Check that the service is healthy.',
            description='Ensure that the service is up and running')
def healthcheck():
    return {
        "status": "UP"
    }
