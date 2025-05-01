import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "./AuthContext"; // adjust path if needed

// Create a Context
const DataContext = createContext();

// Custom hook to use the context
export const useData = () => {
  return useContext(DataContext);
};

// Data provider component
export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [contributedBooks, setContributedBooks] = useState([]);
  const [readBooks, setReadBooks] = useState([]);
  const [readingBooks, setReadingBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({});

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/users/");
      setUsers(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  // Define fetchBooks function at component level so it can be included in the context value
  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/books/");
      setBooks(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching public books:", error);
      return [];
    }
  };

  // Define fetchGenres function at component level
  const fetchGenres = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/genres/");
      setGenres(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching book genres:", error);
      return [];
    }
  };

  // Define fetchUserBooks function at component level
  const fetchUserBooks = async () => {
    if (!authTokens?.access) return;

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/user/books/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );

      // Adjust based on your backend response keys
      setContributedBooks(response.data.contributed || []);
      setReadBooks(response.data.read || []);
      setReadingBooks(response.data.reading || []);

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Unauthorized. Logging out...");
        logoutUser();
      } else {
        console.error("Error fetching user books:", error);
      }
      return { contributed: [], read: [], reading: [] };
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      });

      // Check for successful response status
      if (response.status === 200) {
        setProfile(response.data);
      }
    } catch (error) {
      // Handle errors (e.g., Unauthorized)
      if (error.response && error.response.status === 401) {
        logoutUser();
      } else {
        console.error("Error in the get method", error);
      }
    }
  };

  // Initial fetch of public data
  useEffect(() => {
    const initialFetch = async () => {
      setLoading(true);
      await Promise.all([fetchBooks(), fetchGenres(), fetchProfile(), fetchUserBooks(), fetchUsers()]);
      setLoading(false);
    };

    initialFetch();
  }, []);

  // Fetch user-specific books when authenticated
  useEffect(() => {
    if (authTokens) {
      fetchUserBooks();
      fetchProfile();
    }
  }, [authTokens]);

  // Combine all fetchFunctions into a refresh function
  const refreshAllData = async () => {
    setLoading(true);
    await Promise.all([fetchBooks(), fetchGenres(), fetchProfile(), fetchUserBooks(), fetchUsers()]);
    if (authTokens) {
      await fetchUserBooks();
      await fetchProfile();
    }
    setLoading(false);
  };

  const refreshBooks = async () => {
    fetchBooks();
    fetchUserBooks();
  };

  return (
    <DataContext.Provider
      value={{
        users,
        books,
        genres,
        contributedBooks,
        readBooks,
        readingBooks,
        loading,
        profile,
        fetchUsers,
        fetchProfile,
        fetchBooks,
        fetchGenres,
        fetchUserBooks,
        refreshAllData,
        refreshBooks,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
