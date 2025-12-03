# Last Bite Standing 🍽️

**A location-based restaurant recommendation game.**

---

## Overview

**Last Bite Standing** helps users find restaurants in a fun and interactive way. Using a **tournament-style bracket**, users make quick choices between two restaurants at a time, eliminating indecision until a single winner is crowned.

Perfect for friends, dates, or anyone struggling to decide where to eat!

---

## Features

- **Location-based**: Get restaurants near you.  
- **Tournament format**: Choose between two restaurants until a winner emerges.  
- **Customizable search**: Select by **radius** (1–10 miles) or **number of restaurants** (8, 16, 32).  
- **Preference tracking**: Each round collects user choices for better recommendations.  
- **Final recommendation screen**:  
  - Restaurant name, photo, rating, distance, hours  
  - Map & directions  
  - Option to save to favorites or start over  

---

## How It Works

1. **Ask for Location Permission**  
   The app requests access to your device location.

2. **Fetch Restaurants**  
   Using the **Google Places API** or **Yelp API**, the app retrieves nearby restaurants based on the user's location and chosen criteria.

3. **Create Tournament Bracket**  
   Restaurants are randomly paired in a bracket:  

   
4. **Play the Game**  
- Two restaurants appear at a time.  
- User selects one restaurant per match.  
- Winners move forward until only one restaurant remains.

5. **Final Recommendation**  
- Shows the winning restaurant with reasoning based on your choices.  
- Provides map, directions, photos, and hours.  
- Options to **Start Over** or **Save to Favorites**.

---

## Tech Stack

- **Frontend**: React, TailwindCSS  
- **APIs**: Google Places API 
- **State Management**: React Context / Hooks  
- **Optional Features**: Favorites, category/mood-based filters  

---

## Why This App is Great

- Always relevant: recommendations are location-based.  
- Addictive tournament format.  
- Simple to build and scale.  
- Collects valuable user preference data.  
- Expandable: food categories, cuisines, moods, or social features.

---

## Future Enhancements

- **Social sharing**: compete with friends or see others’ winners.  
- **Food mood categories**: “comfort food”, “healthy”, “adventurous”, etc.  
- **User profiles & history**: track past tournaments and favorites.  
- **Notifications**: alert users about nearby trending restaurants.

---

## How To Build

```bash
# Open your terminal and run:

# Clone the repository
$ git clone https://github.com/derpadev/choodie.git

# Navigate into the project root
$ cd choodie

# Install dependencies 
$ npm install    # or yarn install

# Start the project
$ npm run dev    # or yarn dev 
