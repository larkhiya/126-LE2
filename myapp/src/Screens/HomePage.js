import React from "react";
import "./style/HomeStyle.css";
import "./style/BookStyle.css";
import "./style/NavBar.css";
import Book from "./components/Book.js";
import TopReviewer from "./components/TopReviewer.js";
import { books, users } from "./DummyData.js";

export default function Home() {
  return (
    <div className="home-container">
      <div className="banner">
        <img src="/images/readl.png" alt="Reader" />
        <h1>
          Track books you’ve read.
          <br />
          Stack your read list.
          <br />
          Share what’s worth the read.
        </h1>
        <img id="readr" src="/images/readr.png" alt="Reader" />
      </div>

      <div className="home-shelf">
        <div className="shelf-section">
          <h1>Highest rated</h1>
          <div className="book-row">
            {books
              .sort((a, b) => b.rating - a.rating)
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
              .sort((a, b) => b.review - a.review)
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
              .sort((a, b) => b.reviewsWritten - a.reviewsWritten)
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
