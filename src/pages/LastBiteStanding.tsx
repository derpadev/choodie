const TEST_MODE = false;

import { useEffect, useRef, useState } from "react";
import { fetchNearbyRestaurants, type Restaurant } from "../services/placesApi";
import testData from "../test.json";
import confetti from "canvas-confetti";

interface Location {
  lat: number;
  lon: number;
}

export const LastBiteStanding = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [firstIndex, setFirstIndex] = useState(0);
  const [secondIndex, setSecondIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tournament, setTournament] = useState<Restaurant[]>([]);
  const [winner, setWinner] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (TEST_MODE) {
      // converts test.json into Restaurant[] interface
      function restConverter(places: any[]): Restaurant[] {
        return places.map((p) => ({
          title: p.displayName.text,
          image: "choodie.png",
          rating: "⭐".repeat(Math.round(p.rating || 0)),
          tags: p.types?.slice(0, 2).join(", ") || "Restaurant",
          address: p.formattedAddress,
          priceLevel: p.priceLevel,
        }));
      }

      const converted = restConverter(testData.places);
      setRestaurants(converted);
      setTournament(converted);
      setLoading(false);
    } else if (location && !hasFetched.current) {
      fetchNearbyRestaurants(location.lat, location.lon)
        .then((data) => {
          setRestaurants(data);
          setTournament(data);
          setLoading(false);
          hasFetched.current = true;
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [location]);

  // Enable Location Services
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
          setError(
            "Unable to get your location. Please enable location services."
          );
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, []);

  // Confetti effect from canvas-confetti
  useEffect(() => {
    if (winner) {
      const count = 500;
      const defaults = {
        origin: { y: 0.5, x: 0.5 },
      };

      function Fire(particleRatio: number, opts: {}) {
        confetti(
          Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio),
          })
        );
      }

      Fire(0.25, { spread: 26, startVelocity: 55 });
      Fire(0.2, {
        spread: 60,
      });
      Fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.4,
      });
      Fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      Fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  }, [winner]);

  // Pick Between Card 1 & Card 2
  const handleSelect = (indexToRemove: number) => {
    setTournament((prevArray) => {
      const itemToRemove = prevArray[indexToRemove].title;
      const updatedArray = prevArray.filter(
        (element) => element.title !== itemToRemove
      );

      if (updatedArray.length === 1) {
        setWinner(true);
      } else {
        const newLength = updatedArray.length;

        setFirstIndex((prev) => Math.min(prev, newLength - 1));
        setSecondIndex((prev) => Math.min(prev, newLength - 1));
      }
      // return updatedArray to update the state for tournament
      return updatedArray;
    });
  };

  return (
    // Background
    <div className="bg-[url('/LastBiteStandingBackground.jpg')] bg-cover bg-center min-h-screen">
      {/* Blur Effect */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm">
        {loading ? (
          <div className="flex justify-center min-h-screen items-center font-bold text-white text-9xl text-shadow-lg">
            Loading...
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center min-h-screen items-center font-bold text-white text-6xl text-shadow-lg text-center px-8">
            <p className="mb-4">😔</p>
            <p>{error}</p>
          </div>
        ) : restaurants.length > 0 ? (
          winner ? (
            // Winner
            <div className="relative flex justify-center min-h-screen items-center space-x-12">
              <div
                className="w-108 h-[36rem] bg-cover rounded-xl hover:bg-gray-200 active:scale-105 p-0 flex flex-col justify-end text-left"
                style={{ backgroundImage: `url(${tournament[0].image})` }}
              >
                <div className="p-4 rounded-lg bg-black/30 backdrop-blur">
                  <h1 className="text-4xl font-bold mb-4 text-white text-shadow-lg">
                    {tournament[0].title}
                  </h1>
                  <p className="text-xl mb-2 text-white text-shadow-lg">
                    Rating: {tournament[0].rating}
                  </p>
                  <p className="text-lg text-white text-shadow-lg">
                    {tournament[0].tags}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {TEST_MODE ? (
                <div className="relative flex justify-center min-h-screen items-center space-x-8 md:space-x-12 lg:space-x-16 p-8 md:p-12 ">
                  {/* <div>
                    {tournament.map((tournament, index) => (
                      <div key={index}>
                        <h2 className="bg-white border ">{tournament.title}</h2>
                      </div>
                    ))}
                  </div> */}
                  {/* TEST Card 1 */}
                  <button
                    onClick={() => handleSelect(secondIndex)}
                    className="w-78 md:w-92 lg:w-108 h-[20rem] md:h-[28rem] lg:h-[36rem] bg-cover bg-white rounded-xl hover:bg-gray-200 active:scale-105 p-0 flex flex-col justify-end text-left"
                    style={{
                      backgroundImage: `url(${tournament[firstIndex].image})`,
                    }}
                  >
                    <div className="p-4 rounded-lg bg-black/30 backdrop-blur">
                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white text-shadow-lg">
                        {tournament[firstIndex].title}
                      </h1>
                      <p className="text-md md:text-lg lg:text-xl mb-2 text-white text-shadow-lg">
                        Rating: {tournament[firstIndex].rating}
                      </p>
                      <p className="text-sm md:text-md lg:text-lg text-white text-shadow-lg">
                        {tournament[firstIndex].tags}
                      </p>
                    </div>
                  </button>

                  {/* TEST Card 2 */}
                  <button
                    onClick={() => handleSelect(firstIndex)}
                    className="w-78 md:w-96 lg:w-108 h-[20rem] md:h-[28rem] lg:h-[36rem] bg-cover bg-white rounded-xl hover:bg-gray-200 active:scale-105 p-0 flex flex-col justify-end text-left"
                    style={{
                      backgroundImage: `url(${tournament[secondIndex].image})`,
                    }}
                  >
                    <div className="p-4 rounded-lg bg-black/30 backdrop-blur">
                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white text-shadow-lg">
                        {tournament[secondIndex].title}
                      </h1>
                      <p className="text-md md:text-lg lg:text-xl mb-2 text-white text-shadow-lg">
                        Rating: {tournament[secondIndex].rating}
                      </p>
                      <p className="text-sm md:text-md lg:text-lg text-white text-shadow-lg">
                        {tournament[secondIndex].tags}
                      </p>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="relative flex justify-center min-h-screen items-center space-x-12">
                  {/* Card 1 */}
                  <button
                    onClick={() => handleSelect(secondIndex)}
                    className="w-108 h-[36rem] bg-cover rounded-xl hover:bg-gray-200 active:scale-105 p-0 flex flex-col justify-end text-left"
                    style={{
                      backgroundImage: `url(${tournament[firstIndex].image})`,
                    }}
                  >
                    <div className="p-4 rounded-lg bg-black/30 backdrop-blur">
                      <h1 className="text-4xl font-bold mb-4 text-white text-shadow-lg">
                        {tournament[firstIndex].title}
                      </h1>
                      <p className="text-xl mb-2 text-white text-shadow-lg">
                        Rating: {tournament[firstIndex].rating}
                      </p>
                      <p className="text-lg text-white text-shadow-lg">
                        {tournament[firstIndex].tags}
                      </p>
                    </div>
                  </button>

                  {/* Card 2 */}
                  <button
                    onClick={() => handleSelect(firstIndex)}
                    className="w-108 h-[36rem] bg-cover bg-white rounded-xl text-center hover:bg-gray-200 active:scale-105 p-0 flex flex-col justify-end text-left"
                    style={{
                      backgroundImage: `url(${tournament[secondIndex].image})`,
                    }}
                  >
                    <div className="p-4 rounded-lg bg-black/30 backdrop-blur">
                      <h1 className="text-4xl font-bold mb-4 text-white text-shadow-lg">
                        {tournament[secondIndex].title}
                      </h1>
                      <p className="text-xl mb-2 text-white text-shadow-lg">
                        Rating: {tournament[secondIndex].rating}
                      </p>
                      <p className="text-lg text-white text-shadow-lg">
                        {tournament[secondIndex].tags}
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </>
          )
        ) : null}
      </div>
    </div>
  );
};
