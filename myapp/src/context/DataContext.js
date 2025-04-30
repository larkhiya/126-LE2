import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext'; // adjust path if needed

// Create a Context
const DataContext = createContext();

// Custom hook to use the context
export const useData = () => {
  return useContext(DataContext);
};

// Data provider component
export const DataProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [contributedBooks, setContributedBooks] = useState([]);
  const [readBooks, setReadBooks] = useState([]);
  const [readingBooks, setReadingBooks] = useState([]);

  const { authTokens, logoutUser } = useContext(AuthContext);

  // Fetch public books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/books/');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching public books:', error);
      }
    };
    fetchBooks();
  }, []);

  // Fetch user-specific books
  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user/books/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens?.access}`,
          }
        });

        // Adjust based on your backend response keys
        setContributedBooks(response.data.contributed || []);
        setReadBooks(response.data.read || []);
        setReadingBooks(response.data.reading || []);
      } catch (error) {
        if (error.response?.status === 401) {
          console.warn("Unauthorized. Logging out...");
          logoutUser();
        } else {
          console.error('Error fetching user books:', error);
        }
      }
    };

    if (authTokens) {
      fetchUserBooks();
    }
  }, [authTokens, logoutUser]);

  return (
    <DataContext.Provider value={{
      books,
      contributedBooks,
      readBooks,
      readingBooks
    }}>
      {children}
    </DataContext.Provider>
  );
};