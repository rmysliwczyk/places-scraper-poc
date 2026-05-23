from typing import Annotated, Sequence

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, col, create_engine, select

from app.models import *

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = create_engine("sqlite:///database/database.db")


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]


@app.get(
    "/",
    response_model=list[ParsedPlaceDB],
)
def read_assets(
    session: SessionDep,
    district: str = "",
    name: str = "",
) -> Sequence[ParsedPlaceDB]:
    results = session.exec(
        select(ParsedPlaceDB)
        .where(col(ParsedPlaceDB.name).ilike(f"%{name}%"))
        .where(col(ParsedPlaceDB.district).ilike(f"%{district}%"))
    ).all()
    return results


@app.get(
    "/{parsed_place_id}",
    response_model=ParsedPlaceDB,
)
def read_asset(session: SessionDep, parsed_place_id: str) -> ParsedPlaceDB:
    result = session.exec(
        select(ParsedPlaceDB).where(parsed_place_id == ParsedPlaceDB.id)
    ).first()
    if not result:
        raise HTTPException(
            status_code=404, detail="Couldn't find the place with the provided id."
        )
    return result


@app.patch("/{parsed_place_id}", response_model=ParsedPlaceDB)
def update(
    session: SessionDep, parsed_place_id: str, data: ParsedPlace
) -> ParsedPlaceDB:
    parsed_place = session.exec(
        select(ParsedPlaceDB).where(parsed_place_id == ParsedPlaceDB.id)
    ).first()
    if not parsed_place:
        raise HTTPException(
            status_code=404, detail="Couldn't find the place with the provided id."
        )
    parsed_place.sqlmodel_update(data.model_dump(exclude_unset=True))
    session.add(parsed_place)
    session.commit()
    session.refresh(parsed_place)
    return parsed_place
