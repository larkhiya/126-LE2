import {React, useContext, useState, useEffect} from "react";
import "./style/ProfileStyle.css";
import { books } from "./DummyData.js";
import Book from "./components/Book.js";
import AuthContext from "../context/AuthContext.js";

export default function Profile() {
    const { authTokens, logoutUser } = useContext(AuthContext);
    let [profile, setProfile] = useState({})

    useEffect(() => {
        getProfile()
    },[])

    const getProfile = async() => {
        let response = await fetch('http://127.0.0.1:8000/api/profile', {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization':'Bearer ' + String(authTokens.access)
        }
        })
        let data = await response.json()
        console.log(data)
        if(response.status === 200){
            setProfile(data)
        } else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
    }
  return (
    <div className="profile-container">
      <div className="profile-content-container">
        <div className="reviewer"></div>
        <div className="user-shelf">
          <h1>{profile.full_name}'s Shelf</h1>
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
