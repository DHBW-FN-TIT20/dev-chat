/**
 * This function generates a string of three random english words.
 */
export function getThreeWords(): string {

  const words: string[] = ["Actor", "Afternoon", "Airport", "Ambulance", "Animal", "Answer", "Apple", "Army", "Australia", "Banana", "Battery", "Beach", "Bed", "Boy", "Branch", "Breakfast", "Brother", "Camera", "Candle", "Car", "Carpet", "Cartoon", "China", "Church", "Daughter", "Diamond", "Dinner", "Doctor", "Dog", "Dream", "Dress", "Easter", "Egg", "Egypt", "Energy", "Engine", "England", "Evening", "Family", "Finland", "Fish", "Flag", "Flower", "Football", "Forest", "France", "Garage", "Gold", "Greece", "Guitar", "Hair", "Hamburger", "Helicopter", "Helmet", "Holiday", "Horse", "Hospital", "House", "Hydrogen", "Ice", "Iron", "Island", "Jelly", "Jordan", "Juice", "King", "Kitchen", "Knife", "Lamp", "Library", "Lighter", "Lion", "London", "Lunch", "Magazine", "Manchester", "Market", "Match", "Microphone", "Monkey", "Morning", "Motorcycle", "Nail", "Napkin", "Needle", "Nest", "Nigeria", "Night", "Notebook", "Ocean", "Oil", "Orange", "Oxygen", "Oyster", "Ghost", "Painting", "Parrot", "Pencil", "Piano", "Pillow", "Pizza", "Planet", "Plastic", "Portugal", "Potato", "Queen", "Quill", "Rain", "Rainbow", "Raincoat", "Refrigerator", "Restaurant", "River", "Rocket", "Room", "Rose", "Russia", "Sandwich", "School", "Scooter", "Shampoo", "Shoe", "Soccer", "Spoon", "Stone", "Sugar", "Sweden", "Teacher", "Telephone", "Television", "Tent", "Thailand", "Tomato", "Toothbrush", "Traffic", "Train", "Truck", "Uganda", "Umbrella", "Van", "Vase", "Vegetable", "Vulture", "Wall", "Whale", "Window", "Wire", "Xylophone", "Yacht", "Yak", "Zebra", "Zoo"]

  /**
   * This function capitalizes the given string
   */
  function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  const randomWords: string[] = []

  for (let i = 0; i < 3; i++) {
    const randomWord = capitalize(words[Math.floor(Math.random() * words.length)].toLowerCase());
    if (randomWords.includes(randomWord)) {
      i--;
    } else {
      randomWords.push(randomWord)
    }
  }

  return randomWords.join("")
}