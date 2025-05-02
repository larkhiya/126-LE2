import { React, useContext, useState, useEffect } from "react";
import "./style/ProfileStyle.css";
// import { books } from "./DummyData.js";
import Book from "./components/Book.js";
import AuthContext from "../context/AuthContext.js";
import axios from "axios";
import { useData } from "../context/DataContext.js";

export default function Profile() {
  const { profile, contributedBooks, readBooks, readingBooks } = useData();
  
  return (
    <div className="profile-container">
      <div className="profile-content-container">
        <div className="reviewer"></div>
        <div className="user-shelf">
          <h1>{profile.full_name}'s Shelf</h1>
          <div className="shelf-section">
            <h2>Contributed books</h2>
            <div className="book-row">
              {contributedBooks
                .sort((a, b) => a.title - b.title)
                .map((book, index) => (
                  <div key={index}>
                    <Book labelType="author" book={book} />
                  </div>
                ))}
            </div>

            <div className="shelf-section">
              <h2>Have read</h2>
              <div className="book-row">
                {readBooks
                  .sort((a, b) => a.title - b.title)
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
                {readingBooks
                  .sort((a, b) => a.title - b.title)
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
