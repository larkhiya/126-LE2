import { React, useState, useEffect, useRef, useContext } from "react";
import "./style/DiscoverStyle.css";
import "./style/SearchStyle.css";
import "./style/InputStyle.css";
import ActionButton from "../Buttons/ActionButton";
import AddIcon from "@mui/icons-material/Add";
import Book from "./components/Book";
import {
  Autocomplete,
  Checkbox,
  Dialog,
  IconButton,
  Menu,
} from "@mui/material";
import OutlineButton from "../Buttons/OutlineButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchBar from "./components/SearchBar";
import LabelInput from "./components/Labelnput";
import { BookX } from "lucide-react";
import LabelTextArea from "./components/LabelTextArea";
import { useData } from "../context/DataContext";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function Discover() {
  const { books, refreshBooks, genres } = useData();
  const { user, authTokens } = useContext(AuthContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openFilter = Boolean(anchorEl);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);

  const [booksPerPage, setBooksPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const booksRef = useRef(null); // ref to scroll to books grid
  const [selectedGenreId, setSelectedGenreId] = useState(null);
  const selectedGenre = genres.find((g) => g.id === selectedGenreId);
  const [error, setError] = useState("")

  const handleContributeBook = async () => {
    setError("");
    try {
      // Create request data from form state
      const bookData = {
        title: title,
        author: author,
        synopsis: synopsis,
        cover_url: coverUrl,
        genres: selectedGenres.map((genre) => genre.id),
      };

      console.log("Sending book data:", bookData); // Debug logging

      // Make POST request to your Django API with correct token
      const response = await axios.post(
        "http://127.0.0.1:8000/api/books/",
        bookData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      // Handle successful creation
      console.log("Book added successfully:", response.data);

      // Reset form and close dialog

      refreshBooks();
      setDialogOpen(false);
      disposeState();

      // Optional: Refresh the book list or trigger a refresh
      // You may want to call a function to refresh the books list here
    } catch (error) {
      // Enhanced error logging
      console.error("Error adding book:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", error.response.data);
        console.error("Status code:", error.response.status);
        // if(error.response.data == 'Enter a valid URL.'){}
        const errorData = error.response.data;
        const firstKey = Object.keys(errorData)[0];
        const firstMessage = errorData[firstKey][0];
        setError(`Error: ${firstMessage}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        setError("No response from server. Check your network connection.");
      } else {
        // Something happened in setting up the request
        console.error("Error setting up request:", error.message);
        setError(`Error: ${error.message}`);
      }
    }
  };

  const handleFilter = (genre) => {
    setSelectedGenreId(genre.id);
    setAnchorEl(null);
  };
  // Get booksPerPage from CSS variable and track window width
  useEffect(() => {
    const updateBooksPerPage = () => {
      const cssValue = getComputedStyle(document.documentElement)
        .getPropertyValue("--books-per-page")
        .trim();
      const parsedValue = parseInt(cssValue, 10);
      if (!isNaN(parsedValue)) {
        setBooksPerPage(parsedValue);
      }
      setWindowWidth(window.innerWidth);
    };

    updateBooksPerPage();
    window.addEventListener("resize", updateBooksPerPage);
    return () => window.removeEventListener("resize", updateBooksPerPage);
  }, []);

  // Scroll to top of books grid on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const disposeState = () => {
    setTitle("");
    setAuthor("");
    setCoverUrl("");
    setSynopsis("");
  };

  const isButtonDisabled = !(
    title.trim() &&
    author.trim() &&
    coverUrl.trim() &&
    synopsis.trim() &&
    selectedGenres.length != 0
  );

  const filteredBooks = books
    .sort((a, b) => a.title.localeCompare(b.title))
    .filter((book) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query);

      const matchesGenre =
        !selectedGenreId || book.genres.some((g) => g.id === selectedGenreId);

      return matchesSearch && matchesGenre;
    });

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  // Function to calculate columns per row based on current viewport
  const getColumnsPerRow = () => {
    if (windowWidth <= 767) return 3;
    if (windowWidth <= 1023) return 4;
    return 5;
  };

  // Calculate how many empty slots needed to complete only the last row
  const calculateEmptySlots = () => {
    const columnsPerRow = getColumnsPerRow();
    const booksInLastRow = paginatedBooks.length % columnsPerRow;
    // If the last row is complete (booksInLastRow is 0), don't add empty slots
    return booksInLastRow === 0 ? 0 : columnsPerRow - booksInLastRow;
  };

  const emptySlots = calculateEmptySlots();

  return (
    <div className="home-container">
      <Dialog
        open={openDialog}
        onClose={() => {
          setDialogOpen(false);
          disposeState();
          setError("");
        }}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#FBE5DC",
            borderRadius: "10px",
            width: "100%",
            maxWidth: "40rem",
          },
        }}
      >
        <div className="contribute-container">
          <h1>Contribute a book</h1>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <form
            style={{
              gap: "1.25rem",
              maxHeight: "50vh", // or any height constraint
              overflowY: "auto",
            }}
          >
            <LabelInput
              label="Title"
              placeholder="Enter book's title"
              onChange={(e) => setTitle(e.target.value)}
            />
            <LabelInput
              label="Author"
              placeholder="Enter book's author"
              onChange={(e) => setAuthor(e.target.value)}
            />
            <LabelTextArea
              outlined={false}
              label="Synopsis"
              placeholder="Enter book's synopsis"
              onChange={(e) => setSynopsis(e.target.value)}
            />
            <LabelInput
              label="Cover"
              placeholder="Enter image URL"
              onChange={(e) => setCoverUrl(e.target.value)}
            />

            <Autocomplete
              multiple
              onChange={(event, newValue) => setSelectedGenres(newValue)}
              id="checkboxes-tags-demo"
              options={genres}
              disableCloseOnSelect
              getOptionLabel={(option) => option.name}
              renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                  <li
                    key={key}
                    {...optionProps}
                    style={{
                      fontFamily: "Inter",
                      fontWeight: 500,
                      letterSpacing: "-0.03375rem",
                      fontSize: "1.25rem",
                      color: "#683737",
                    }}
                  >
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      checked={selected}
                      sx={{
                        marginRight: 1,
                        color: "#683737",
                        "&.Mui-checked": {
                          color: "#d96b63", // Checked color
                        },
                      }}
                    />
                    {option.name}
                  </li>
                );
              }}
              style={{ width: "100%" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select genre"
                  placeholder=""
                  sx={{
                    width: "100%",
                    fontFamily: "Inter",
                    fontWeight: 500, // Base font for TextField
                    "& .MuiInputBase-root": {
                      borderColor: "transparent",
                      backgroundColor: "#fff",
                      fontFamily: "Inter",
                      fontWeight: 500,
                      color: "#8e6969",
                      letterSpacing: "-0.03375rem",
                      fontSize: {
                        xs: "0.85rem",
                        sm: "1rem",
                        md: "1.125rem",
                      },
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "transparent",
                      },
                      "&:hover fieldset": {
                        borderColor: "transparent",
                      },
                      "&.Mui-focused fieldset": {
                        borderWidth: "1px",
                        borderColor: "#d96b63",
                        color: "#9F9F9F",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: "Inter",
                      fontWeight: 500,
                      letterSpacing: "-0.03375rem",
                      fontSize: {
                        xs: "0.85rem",
                        sm: "1rem",
                        md: "1.125rem",
                      },
                      color: "#9F9F9F", // Font for label
                    },
                    "& .MuiAutocomplete-tag": {
                      fontFamily: "Inter",
                      fontWeight: 500,
                      color: "white",
                      letterSpacing: "-0.03375rem",
                      fontSize: {
                        xs: "0.85rem",
                        sm: "1rem",
                        md: "1.125rem",
                      },
                      backgroundColor: "#D77676", // Font for selected tags
                    },
                  }}
                />
              )}
            />
          </form>

          <ActionButton
            stretched="true"
            onClick={handleContributeBook}
            label="Contribute"
            disabled={isButtonDisabled}
          />
        </div>
      </Dialog>

      <div className="home-shelf">
        <div className="discover-header">
          <div className="discover-contribute">
            <h1>All books</h1>

            {user && (
              <ActionButton
                icon={<AddIcon sx={{ color: "white", fontSize: "1.2rem;" }} />}
                onClick={() => setDialogOpen(true)}
                label="Contribute"
              />
            )}
          </div>

          <div className="search-filter">
            <SearchBar onChange={(e) => setSearchQuery(e.target.value)} />
            <div>
              <OutlineButton
                onIconTap={() => setSelectedGenreId(null)}
                icon={
                  !selectedGenreId ? (
                    <FilterListIcon
                      sx={{ color: "#D77676", fontSize: {
                        sm: "0.8rem",  
                        md: "1.2rem",  
                      }}}
                    />
                  ) : (
                    <CloseIcon sx={{ color: "#D77676", fontSize: "1.2rem" }} />
                  )
                }
                onClick={(e) => setAnchorEl(e.currentTarget)}
                label={selectedGenre ? selectedGenre.name : "Filter"}
              />

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openFilter}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                  style: {
                    maxHeight: "20rem",
                    overflowY: "auto",
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.08)",
                    border: "1px solid #d77676",
                    marginTop: "5px",
                  },
                }}
              >
                {genres.map((genre, index) => (
                  <div key={index} onClick={() => handleFilter(genre)}>
                    <p className="filter-button">{genre.name}</p>
                  </div>
                ))}
              </Menu>
            </div>
          </div>
        </div>

        {/* Books container with consistent structure regardless of content */}
        <div className="books-container">
          <div
            ref={booksRef}
            className={
              filteredBooks.length > 0
                ? "discover-books"
                : "discover-books not-found"
            }
          >
            {filteredBooks.length > 0 ? (
              <>
                {paginatedBooks.map((book, index) => (
                  <div key={index}>
                    <Book labelType="author" book={book} />
                  </div>
                ))}

                {/* Only add empty slots needed to complete the current row */}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <div key={`empty-${i}`} className="empty-book-slot" />
                ))}
              </>
            ) : (
              <div className="empty-state">
                <BookX color="#683737" size={64} strokeWidth={1} />
                <p>
                  No books found.
                  <br />
                  Contribute this book to add in our library!
                </p>
              </div>
            )}
          </div>

          {/* Pagination controls with sliding window - always showing 2 page numbers */}
          <div className="pagination-controls">
            {filteredBooks.length > booksPerPage ? (
              <>
                {/* Left chevron button - always visible but disabled on page 1 */}
                <button
                  className="chevron-button"
                  onClick={() => {
                    // Go to previous page
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                  }}
                  disabled={currentPage === 1}
                >
                  <ChevronLeftIcon fontSize="inherit" />
                </button>
                
                {/* Calculate which 2 page numbers to show */}
                {(() => {
                  // If we're on page 1, show pages 1 and 2
                  // If we're on the last page, show the last 2 pages
                  // Otherwise, show currentPage and currentPage+1
                  let startPage = currentPage;
                  
                  // Adjust if we'd show an incomplete window at the end
                  if (startPage === totalPages) {
                    startPage = Math.max(1, totalPages - 1);
                  }
                  
                  // Create array of pages to display (at most 2)
                  const pagesToShow = [];
                  for (let i = 0; i < 2; i++) {
                    const pageNum = startPage + i;
                    if (pageNum <= totalPages) {
                      pagesToShow.push(pageNum);
                    }
                  }
                  
                  // Return the page buttons
                  return pagesToShow.map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={currentPage === pageNum ? "active" : ""}
                    >
                      {pageNum}
                    </button>
                  ));
                })()}
                
                {/* Right chevron button - always visible but disabled on last page */}
                <button
                  className="chevron-button"
                  onClick={() => {
                    // Go to next page
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  }}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRightIcon fontSize="inherit" />
                </button>
              </>
            ) : (
              <div className="pagination-placeholder"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Discover;