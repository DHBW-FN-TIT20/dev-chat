import json

with open('nouns.json', 'r') as file:
    obj = json.loads(file.read())
    print(obj)