import requests

from models import *
from pydantic import ValidationError
from settings import settings
from sqlalchemy.exc import IntegrityError
from sqlmodel import SQLModel, create_engine, Session

def text_search(text_query: str) -> list[Place]:
    response = requests.post(
        "https://places.googleapis.com/v1/places:searchText",
        json={"textQuery": text_query},
        headers={"X-Goog-Api-Key": settings.api_key, "X-Goog-FieldMask": "places.id,places.displayName,places.postalAddress,places.internationalPhoneNumber,places.websiteUri,places.rating,places.addressComponents"}
    )
    PlacesAPIResponse.model_validate(response.json())
    places = []
    for place in response.json()["places"]:
        places.append(Place.model_validate(place))
    return places

def search_nearby(latitude_longitude: str, radius: float, primary_types: list[str]) -> list[Place]:
    latitude, longitude = latitude_longitude.split(" ")
    latitude = latitude.strip()
    longitude = longitude.strip()

    response = requests.post(
        "https://places.googleapis.com/v1/places:searchNearby",
        json={
            "includedPrimaryTypes": [primary_types],
            "locationRestriction": {
                "circle": {
                    "center": {
                        "latitude": latitude,
                        "longitude": longitude
                    },
                    "radius": radius
                }
            },
            "rankPreference": "DISTANCE"
        },
        headers={
            "X-Goog-Api-Key": settings.api_key,
            "X-Goog-FieldMask": "places.id,places.displayName,places.postalAddress,places.internationalPhoneNumber,places.websiteUri,places.rating,places.addressComponents"
        }
    )
    places = []
    try:
        for place in response.json()["places"]:
            try:
                places.append(Place.model_validate(place))
            except ValidationError as e:
                print(f"Skipping {place['displayName']} | Validation Error: {str(e)}")
    except Exception as e:
        print(str(e))


    return places

def parse_place(place: Place):
    district = "Unkown"
    for component in place.addressComponents:
        if component.types:
            if "sublocality_level_1" in component.types and component.longText:
                district=component.longText

    parsed_place = ParsedPlace(
            id=place.id,
            name=place.displayName.text,
            address=" ".join(place.postalAddress.addressLines),
            district=district,
            phoneNumber=place.internationalPhoneNumber if place.internationalPhoneNumber else "",
            website=place.websiteUri if place.websiteUri else "",
            rating=place.rating if place.rating else 0.0
        )
    return parsed_place


if __name__ == "__main__":
    engine = create_engine("sqlite:///database/database.db")
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
    # Getting at least 100 hair/beauty salons for Warsaw.
    # The query returns at most 20 results, so we have to get creative and change the latitude and longitude to probe different areas
        left_top_coords = [52.2800, 20.8000]
        right_bottom_coords = [52.1700, 21.0965]
        current_coords = left_top_coords
        added_places = []
        places_nearby = []
        while(current_coords[0] > right_bottom_coords[0]):
            while(current_coords[1] < right_bottom_coords[1]):
                places_nearby = search_nearby(f"{current_coords[0]} {current_coords[1]}", 400, ["hair_care", "hair_salon", "beautician", "beauty_salon"])
                current_coords[1] += 0.020
                for place in places_nearby:
                    if place.id not in added_places:
                        try:
                            session.add(ParsedPlaceDB(**parse_place(place).model_dump()))
                            session.commit()
                        except IntegrityError:
                            print(f"{place.displayName.text} already in DB")
                            session.rollback()
                        added_places.append(place.id)
            current_coords[1] = left_top_coords[1]
            current_coords[0] -= 0.005







