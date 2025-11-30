import { useEffect, useState } from "react";

interface Location {
  lat: number;
  lon: number;
}

const restaurants = [
  {
    title: "Tacos Los Cholos",
    image: "/TLC.jpg",
    rating: "⭐⭐⭐⭐",
    tags: "Food",
  },
  {
    title: "i-Tea",
    image: "/ITEASL.jpg",
    rating: "⭐⭐⭐",
    tags: "Drinks",
  },
  {
    title: "Happy Lamb",
    image: "/HAPPYLAMB.jpg",
    rating: "⭐⭐⭐⭐⭐",
    tags: "Food",
  },
  {
    title: "Din Tai Fung",
    image: "/DTF.jpg",
    rating: "⭐⭐",
    tags: "Food",
  },
];

export const LastBiteStanding = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [firstIndex, setFirstIndex] = useState(0);
  const [secondIndex, setSecondIndex] = useState(1);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Error getting location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  const handleSelect = (selectedIndex: number) => {
    const nextIndex =
      (Math.max(firstIndex, secondIndex) + 1) % restaurants.length;
    if (selectedIndex === firstIndex) {
      setSecondIndex(nextIndex);
    } else {
      setFirstIndex(nextIndex);
    }
  };

  return (
    <div className="bg-[url('/LastBiteStandingBackground.jpg')] bg-cover bg-center min-h-screen">
      {/* Blur Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm">
        {location ? (
          <>
            {" "}
            {/* Cards Container */}
            <div className="relative flex justify-center min-h-screen items-center space-x-12">
              {/* Card 1 */}
              <button
                onClick={() => handleSelect(firstIndex)}
                className="w-108 h-[36rem] bg-cover rounded-xl hover:bg-gray-200 active:scale-105 p-0 flex flex-col justify-end text-left"
                style={{
                  backgroundImage: `url(${restaurants[firstIndex].image})`,
                }}
              >
                <div className="p-4 rounded-lg bg-black/30 backdrop-blur">
                  <h1 className="text-4xl font-bold mb-4 text-white text-shadow-lg">
                    {restaurants[firstIndex].title}
                  </h1>
                  <p className="text-xl mb-2 text-white text-shadow-lg">
                    Rating: {restaurants[firstIndex].rating}
                  </p>
                  <p className="text-lg text-white text-shadow-lg">
                    {" "}
                    {restaurants[firstIndex].tags}
                  </p>
                </div>
              </button>
              {/* Card 2 */}
              <button
                onClick={() => handleSelect(secondIndex)}
                className="w-108 h-[36rem] bg-cover bg-white rounded-xl text-center hover:bg-gray-200 active:scale-105 p-0 flex flex-col justify-end text-left"
                style={{
                  backgroundImage: `url(${restaurants[secondIndex].image})`,
                }}
              >
                <div className="p-4 rounded-lg bg-black/30 backdrop-blur">
                  <h1 className="text-4xl font-bold mb-4 text-white text-shadow-lg">
                    {restaurants[secondIndex].title}
                  </h1>
                  <p className="text-xl mb-2 text-white text-shadow-lg">
                    Rating: {restaurants[secondIndex].rating}
                  </p>
                  <p className="text-lg text-white text-shadow-lg">
                    {" "}
                    {restaurants[secondIndex].tags}
                  </p>
                </div>
              </button>
            </div>
          </>
        ) : (
          <>
            {" "}
            <div className="flex justify-center min-h-screen items-center font-bold text-white text-9xl text-shadow-lg">
              {" "}
              Loading...{" "}
            </div>{" "}
          </>
        )}
      </div>
    </div>
  );
};
