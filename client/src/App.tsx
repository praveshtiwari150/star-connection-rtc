import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Peer from "./components/Peer";
import Room from "./components/Room";
import { useHost } from "./context/HostProvider";

function App() {


  return (
    <>
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path="/room/:sessionID" element={<Room/>}/>
        <Route path="/peer" element={<Peer/>} />
      </Routes>
    </>
  )
}

export default App
