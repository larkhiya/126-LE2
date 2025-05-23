import React, { useContext } from "react";
import "./style/HomeStyle.css";
import "./style/BookStyle.css";
import "./style/NavBar.css";
import Book from "./components/Book.js";
import TopReviewer from "./components/TopReviewer.js";
// import { users } from "./DummyData.js";
import { useData } from "../context/DataContext.js";
import AuthContext from "../context/AuthContext.js";

export default function Home() {
  const { books, users, recommendedBooks } = useData();
  const { user } = useContext(AuthContext);

  return (
    <div className="home-container">
      <div className="banner">
        <img src="/images/readl.svg" alt="Reader" />
        <h1>
          Track books you’ve read.
          <br />
          Stack your read list.
          <br />
          Share what’s worth the read.
        </h1>
        <img id="readr" src="/images/readr.svg" alt="Reader" />
      </div>

      <div className="home-shelf">
        {user && (
          <div className="shelf-section">
            <h1>Recommended</h1>
            <div className="book-row">
              {recommendedBooks
                .slice(0, 5)
                .sort((a, b) => b.average_rating - a.average_rating)
                .map((book, index) => (
                  <div key={index}>
                    <Book labelType="author" book={book} />
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="shelf-section">
          <h1>Highest rated</h1>
          <div className="book-row">
            {books
              .slice(0, 5)
              .sort((a, b) => b.average_rating - a.average_rating)
              .map((book, index) => (
                <div key={index}>
                  <Book labelType="rating" book={book} />
                </div>
              ))}
          </div>
        </div>

        <div className="shelf-section">
          <h1>Most reviewed</h1>
          <div className="book-row">
            {books
              .slice(0, 5)
              .sort((a, b) => b.review_count - a.review_count)
              .map((book, index) => (
                <div key={index}>
                  <Book labelType="review" book={book} />
                </div>
              ))}
          </div>
        </div>

        <div className="shelf-section">
          <h1>Top reviewers</h1>
          <div className="book-row">
            {users
              .slice(0, 5)
              .sort((a, b) => b.review_count - a.review_count)
              .map((user, index) => (
                <div key={index}>
                  <TopReviewer user={user} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
