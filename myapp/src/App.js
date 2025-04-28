import logo from "./logo.svg";
import "./App.css";
import NavBar from "./Screens/components/AppBar.js";
import Discover from "./Screens/DiscoverPage.js";
import Home from "./Screens/HomePage.js";

function App() {
  return (
    <div>
      <NavBar isSignedIn={true} />
      <Home />
    </div>
  );
}

export default App;
