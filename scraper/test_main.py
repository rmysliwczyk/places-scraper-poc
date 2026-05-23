from main import text_search, search_nearby

def test_text_search_request_returns_requested_data():
    places = text_search("Pałac Kultury i Nauki")
    assert places != None
    assert len(places) > 0
    assert places[0].displayName.text == "Palace of Culture and Science"

def test_search_nearby_by_category_request_returns_studio_fryzur_beauty():
    places = search_nearby("52.32126028070235 21.094355344393595", 100.0, ["hair_salon"])
    expected_place = None
    for place in places:
        if place.displayName.text == "Studio fryzur Beauty":
            expected_place = place
    assert expected_place != None



