import ReactDOM from "react-dom/client";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
  const bookDetailsElement = (
    <BookDetails
      book={sampleBook}
      initialReviews={sampleReviews}
      currentUser={currentUser}
    />
  );

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <NavBar isSignedIn={true} />
            <Routes>
              {/* <Route path="/" element={bookDetailsElement}/> */}
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<SignupPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/book/:id" element={<BookDetails2 />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
