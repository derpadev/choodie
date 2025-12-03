import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="bg-[url('/LastBiteStandingBackground.jpg')] bg-cover bg-center min-h-screen">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm">
        <div className="flex flex-col justify-center min-h-screen items-center">
          <h1 className="text-9xl font-bold text-white text-shadow-lg font-serif">CHOODIE</h1>
          <p className="text-6xl text-white font-serif text-shadow-lg mt-4">Find the best restaurants near you</p>
          <Link to="/LastBiteStanding">
            <button className="w-32 h-24 bg-green-500 border border-black/30 text-white font-semibold rounded-xl text-5xl font-serif mt-8 hover:bg-green-400 active:scale-105">
              GO
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
