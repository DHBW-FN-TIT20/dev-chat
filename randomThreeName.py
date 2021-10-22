import json
from random import randint

def get_three_random_nouns():
    with open('nouns.json', 'r') as file:
        obj = json.loads(file.read())
    noun_array = []
    for element in obj:
        noun_array.append(element["value"])
    threeWords = ""
    for index in [0, 1, 2]:
        random_index = randint(0, len(noun_array))
        current_word = noun_array[random_index]
        current_word = current_word.capitalize()
        threeWords = threeWords + current_word
    return threeWords

