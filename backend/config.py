import json


def read_json():
    with open("source.json") as source:
        json_data = json.load(source)
    return json_data
