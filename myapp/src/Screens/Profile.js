import React from "react";
import "./style/ProfileStyle.css";
import { books } from "./DummyData.js";
import Book from "./components/Book.js";

export default function Profile() {
  return (
    <div className="profile-container">
      <div className="profile-content-container">
        <div className="reviewer"></div>
        <div className="user-shelf">
          <h1>Ethan's shelf</h1>
          <div className="shelf-section">
            <h2>Contributed books</h2>
            <div className="book-row">
              {books
                .sort((a, b) => b.rating - a.rating)
                .map((book, index) => (
                  <div key={index}>
                    <Book labelType="author" book={book} />
                  </div>
                ))}
            </div>

            <div className="shelf-section">
              <h2>Read</h2>
              <div className="book-row">
                {books
                  .sort((a, b) => b.rating - a.rating)
                  .map((book, index) => (
                    <div key={index}>
                      <Book labelType="author" book={book} />
                    </div>
                  ))}
              </div>
            </div>

            <div className="shelf-section">
              <h2>Currently reading</h2>
              <div className="book-row">
                {books
                  .sort((a, b) => b.rating - a.rating)
                  .map((book, index) => (
                    <div key={index}>
                      <Book labelType="author" book={book} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
