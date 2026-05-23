from pydantic import BaseModel
from sqlmodel import SQLModel, Field

class AddressComponent(BaseModel):
    longText: str | None = None
    shortText: str | None = None
    types: list[str] | None = None
    languageCode: str | None = None

class PostalAddress(BaseModel):
    revision: int | None = None
    regionCode: str | None = None
    languageCode: str | None = None
    postalCode: str | None = None
    sortingCode: str | None = None
    administrativeArea: str | None = None
    locality: str | None = None
    sublocality: str | None = None
    addressLines: list[str]
    recipients: list[str] | None = None
    organization: str | None = None

class DisplayName(BaseModel):
    text: str
    languageCode: str

class Place(BaseModel):
    id: str
    displayName: DisplayName
    addressComponents: list[AddressComponent]
    postalAddress: PostalAddress
    internationalPhoneNumber: str | None = Field(default=None)
    websiteUri: str | None = Field(default=None)
    rating: float | None = Field(default=None)

class PlacesAPIResponse(BaseModel):
    places: list[Place]

class ParsedPlace(SQLModel):
    id: str
    name: str = Field()
    address: str = Field()
    district: str = Field()
    phoneNumber: str = Field()
    website: str = Field()
    rating: float = Field()

class ParsedPlaceDB(ParsedPlace, table=True):
    id: str = Field(primary_key=True)

