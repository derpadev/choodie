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
  const [tagColorMap, setTagColorMap] = useState<Record<string, string>>({});

  const colors = [
    "bg-red-300",
    "bg-red-400",
    "bg-red-500",
    "bg-green-300",
    "bg-green-400",
    "bg-green-500",
    "bg-blue-300",
    "bg-blue-400",
    "bg-blue-500",
    "bg-yellow-300",
    "bg-yellow-400",
    "bg-yellow-500",
    "bg-purple-300",
    "bg-purple-400",
    "bg-purple-500",
    "bg-pink-300",
    "bg-pink-400",
    "bg-pink-500",
    "bg-orange-300",
    "bg-orange-400",
    "bg-orange-500",
    "bg-indigo-300",
    "bg-indigo-400",
    "bg-indigo-500",
    "bg-teal-300",
    "bg-teal-400",
    "bg-teal-500",
    "bg-cyan-300",
    "bg-cyan-400",
    "bg-cyan-500",
    "bg-lime-300",
    "bg-lime-400",
    "bg-lime-500",
    "bg-rose-300",
    "bg-rose-400",
    "bg-rose-500",
    "bg-fuchsia-300",
    "bg-fuchsia-400",
    "bg-fuchsia-500",
    "bg-violet-300",
    "bg-violet-400",
    "bg-violet-500",
    "bg-amber-300",
    "bg-amber-400",
    "bg-amber-500",
    "bg-sky-300",
    "bg-sky-400",
    "bg-sky-500",
    "bg-emerald-300",
    "bg-emerald-400",
    "bg-emerald-500",
    "bg-gray-300",
    "bg-gray-400",
    "bg-gray-500",
    "bg-stone-300",
    "bg-stone-400",
    "bg-stone-500",
    "bg-zinc-300",
    "bg-zinc-400",
    "bg-zinc-500",
    "bg-neutral-300",
    "bg-neutral-400",
    "bg-neutral-500",
  ];

  useEffect(() => {
    if (TEST_MODE) {
      // converts test.json into Restaurant[] interface
      function restConverter(places: any[]): Restaurant[] {
        return places.map((p) => ({
          title: p.displayName.text,
          image: TEST_MODE ? "choodie.png" : p.image,
          rating: "⭐".repeat(Math.round(p.rating || 0)),
          tags: p.types
            ?.slice(0, 2)
            .filter((item: string) => item !== "restaurant")
            .join(", ")
            .replaceAll("_", " ")
            .replaceAll(" restaurant", ""),
          address: p.formattedAddress,
          priceLevel: p.priceLevel,
        }));
      }
      const converted = restConverter(testData.places);
      setRestaurants(converted);
      setTournament(converted);
      setLoading(false);
    } else if (location && !hasFetched.current) {
      // converts Restaurant[] tags to be usable
      fetchNearbyRestaurants(location.lat, location.lon)
        .then((data) => {
          const cleanedData = data.map((restaurant) => {
            const cleanedTags = restaurant.tags
              .split(", ")
              .filter((item: string) => item !== "restaurant")
              .map((tag) =>
                tag.replaceAll("_", " ").replaceAll(" restaurant", "").trim()
              )
              .join(", ");

            return { ...restaurant, tags: cleanedTags };
          });
          setRestaurants(cleanedData);
          setTournament(cleanedData);
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

  // Tag to Color mapping
  useEffect(() => {
    const map: Record<string, string> = {};
    let colorIndex = 0;

    restaurants.forEach((restaurant) => {
      restaurant.tags.split(",").forEach((rawTag) => {
        const tag = rawTag.trim();
        if (!map[tag]) {
          map[tag] = colors[colorIndex % colors.length];
          colorIndex++;
        }
      });
    });
    setTagColorMap(map);
  }, [restaurants]);

  return (
    // Background
    <div className="bg-[url('/LastBiteStandingBackground.jpg')] bg-cover bg-center min-h-screen">
      {/* Blur Effect */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm bg-cover min-h-screen">
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
            <div className="flex flex-col justify-center min-h-screen items-center space-x-12">
              <div
                className="relative mx-auto w-[27rem] h-[36rem] bg-cover rounded-xl p-0 flex flex-col justify-end text-left"
                style={{
                  backgroundImage: `url(${tournament[0].image})`,
                }}
              >
                <button
                  onClick={() => {
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${tournament[0].title}${tournament[0].address}`,
                      "_blank"
                    );
                  }}
                  className="absolute top-4 right-4 bg-blue-500 text-white font-semibold rounded-xl px-3 py-1 hover:scale-105 active:scale-100 transition"
                >
                  Directions!
                </button>

                <div className="p-4 rounded-lg bg-black/30 backdrop-blur">
                  <h1 className="text-4xl font-bold mb-4 text-white text-shadow-lg">
                    {tournament[0].title}
                  </h1>
                  <p className="text-xl mb-2 text-white text-shadow-lg">
                    Rating: {tournament[0].rating}
                  </p>
                  <div className="space-x-4">
                    {tournament[0]?.tags.split(",").map((rawTag) => {
                      const tag = rawTag.trim();
                      const color = tagColorMap[tag];
                      return (
                        <p
                          className={`inline-block ${color} px-2 font-semibold text-white hover:scale-105 transition rounded-xl`}
                        >
                          {tag}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {TEST_MODE ? (
                <div className="relative flex justify-center min-h-screen items-center space-x-8 md:space-x-12 lg:space-x-16 p-8 md:p-12 ">
                  <div>
                    {tournament.map((tournament, index) => (
                      <div key={index}>
                        <h2 className="bg-white border ">
                          {tournament.tags.split(",")}
                        </h2>
                      </div>
                    ))}
                    {/* <div>
                      {Object.entries(tagColorMap).map(([tag, color], i) => (
                        <p
                          key={i}
                          className={`${color} px-2 rounded-xl inline-block`}
                        >
                          {tag}
                        </p>
                      ))}
                    </div> */}
                  </div>
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
                      <div className="text-sm md:text-md lg:text-lg text-white text-shadow-lg border space-x-4">
                        {tournament[firstIndex]?.tags
                          .split(",")
                          .map((rawTag) => {
                            const tag = rawTag.trim();
                            const color = tagColorMap[tag];
                            return (
                              <p
                                className={`inline-block ${color} px-2 rounded-xl`}
                              >
                                {tag}
                              </p>
                            );
                          })}
                      </div>
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
                      <p className="text-sm md:text-md lg:text-lg text-white text-shadow-lg space-x-4">
                        {tournament[secondIndex]?.tags
                          .split(",")
                          .map((rawTag) => {
                            const tag = rawTag.trim();
                            const color = tagColorMap[tag];
                            return (
                              <p
                                className={`inline-block ${color} px-2 rounded-xl`}
                              >
                                {tag}
                              </p>
                            );
                          })}
                      </p>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="relative flex justify-center min-h-screen items-center space-x-12">
                  {/* Card 1 */}
                  <button
                    onClick={() => handleSelect(secondIndex)}
                    className="w-78 md:w-92 lg:w-108 h-[20rem] md:h-[28rem] lg:h-[36rem] bg-cover bg-white rounded-xl hover:scale-105 active:scale-100 p-0 flex flex-col justify-end text-left"
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
                      <div className="space-x-4">
                        {tournament[firstIndex]?.tags
                          .split(",")
                          .map((rawTag) => {
                            const tag = rawTag.trim();
                            const color = tagColorMap[tag];
                            return (
                              <p
                                className={`text-sm md:text-md lg:text-lg inline-block ${color} px-2 font-semibold text-white hover:scale-105 transition rounded-xl`}
                              >
                                {tag}
                              </p>
                            );
                          })}
                      </div>
                    </div>
                  </button>

                  {/* Card 2 */}
                  <button
                    onClick={() => handleSelect(firstIndex)}
                    className="w-78 md:w-96 lg:w-108 h-[20rem] md:h-[28rem] lg:h-[36rem] bg-cover bg-white rounded-xl hover:scale-105 active:scale-100 p-0 flex flex-col justify-end text-left"
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
                      <div className="text-sm md:text-md lg:text-lg text-white text-shadow-lg space-x-4">
                        {tournament[secondIndex]?.tags
                          .split(",")
                          .map((rawTag) => {
                            const tag = rawTag.trim();
                            const color = tagColorMap[tag];
                            return (
                              <p
                                className={`inline-block ${color} px-2 font-semibold text-white hover:scale-105 transition rounded-xl`}
                              >
                                {tag}
                              </p>
                            );
                          })}
                      </div>
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
