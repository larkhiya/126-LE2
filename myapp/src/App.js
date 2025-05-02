import ReactDOM from "react-dom/client";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./Screens/components/NavBar.js";
import Discover from "./Screens/DiscoverPage.js";
import Home from "./Screens/HomePage.js";
import Profile from "./Screens/Profile.js";
import BookDetails from "./Screens/BookDetails.js";
import {
  sampleBook,
  sampleReviews,
  currentUser,
} from "./Screens/BookDetailsSample.js";
import BookDetails2 from "./Screens/BookDetails2.js";
import LoginPage from "./Screens/LoginPage.js";
import { AuthProvider } from "./context/AuthContext.js";
import SignupPage from "./Screens/SignUpPage.js";
import { DataProvider } from "./context/DataContext.js";

function App() {
  const location = useLocation();
  const bookDetailsElement = (
    <BookDetails
      book={sampleBook}
      initialReviews={sampleReviews}
      currentUser={currentUser}
    />
  );
  const hideNavRoutes = ["/signin", "/signup"];

  return (
    <>
        {!hideNavRoutes.includes(location.pathname) && <NavBar isSignedIn={true} />}
          <Routes>
            {/* <Route path="/" element={bookDetailsElement}/> */}
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/book/:id" element={<BookDetails2 />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signin" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
    </>
  );
}

export default App;
