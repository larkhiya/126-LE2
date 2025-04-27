import logo from "./logo.svg";
import "./App.css";
import HomePage from "./Home/HomePage";
import NavBar from "./Home/components/AppBar.js";
import Discover from "./Home/DiscoverPage.js";

function App() {
  return (
    
    <div>
      <NavBar isSignedIn={true} />
      <Discover />
    </div>
  );
}

export default App;
