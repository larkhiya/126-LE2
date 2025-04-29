import ReactDOM from "react-dom/client";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./Screens/components/NavBar.js";
import Discover from "./Screens/DiscoverPage.js";
import Home from "./Screens/HomePage.js";
import Profile from "./Screens/Profile.js";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar isSignedIn={true} />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/discover" element={<Discover />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
