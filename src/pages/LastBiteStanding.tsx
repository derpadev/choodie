import { useEffect, useState } from "react";

interface Location {
  lat: number;
  lon: number;
}

export const LastBiteStanding = () => {
  const [location, setLocation] = useState<Location | null>(null);

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
              <button className="w-108 h-[36rem] bg-[url('/TLC.jpg')] bg-cover rounded-xl hover:bg-gray-200 active:scale-105 p-0 flex flex-col justify-end text-left">
                <div className="p-4 rounded-lg bg-black/30 backdrop-blur">
                  <h1 className="text-4xl font-bold mb-4 text-white text-shadow-lg">
                    Tacos Los Cholos
                  </h1>
                  <p className="text-xl mb-2 text-white text-shadow-lg">
                    Rating: ⭐⭐⭐⭐
                  </p>
                  <p className="text-lg text-white text-shadow-lg">Food</p>
                </div>
              </button>
              {/* Card 2 */}
              <button className="w-108 h-[36rem] bg-[url('/ITEASL.jpg')] bg-cover bg-white rounded-xl text-center hover:bg-gray-200 active:scale-105 p-0 flex flex-col justify-end text-left">
                <div className="p-4 rounded-lg bg-black/30 backdrop-blur">
                  <h1 className="text-4xl font-bold mb-4 text-white text-shadow-lg">
                    i-Tea
                  </h1>
                  <p className="text-xl mb-2 text-white text-shadow-lg">
                    Rating: ⭐⭐⭐
                  </p>
                  <p className="text-lg text-white text-shadow-lg">Drinks</p>
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
