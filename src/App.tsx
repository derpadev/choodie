import { Home } from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import { LastBiteStanding } from "./pages/LastBiteStanding";

function App() {
  return (
    <Routes>
      <Route path ="/" element={<Home />} />
       <Route path ="/LastBiteStanding" element={<LastBiteStanding/>} />
    </Routes>
  );
}

export default App;
