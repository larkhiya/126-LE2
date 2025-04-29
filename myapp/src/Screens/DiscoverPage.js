import { React, useState } from "react";
import "./style/DiscoverStyle.css";
import "./style/SearchStyle.css";
import "./style/InputStyle.css";
import ActionButton from "../Buttons/ActionButton";
import AddIcon from "@mui/icons-material/Add";
import { discoverBooks } from "./DummyData";
import Book from "./components/Book";
import { Dialog, Menu } from "@mui/material";
import OutlineButton from "../Buttons/OutlineButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchBar from "./components/SearchBar";
import LabelInput from "./components/Labelnput";
import { BookX } from 'lucide-react';

function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openFilter = Boolean(anchorEl);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  const disposeState = () => {
    setTitle("");
    setAuthor("");
    setCoverUrl("");
  };

  const isButtonDisabled = !(title.trim() && author.trim() && coverUrl.trim());

  const filteredBooks = discoverBooks.filter((book) => {
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
  });

  return (
    <div className="home-container">
      <Dialog
        open={openDialog}
        onClose={() => {
          setDialogOpen(false);
          disposeState();
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
          <form>
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
            <LabelInput
              label="Cover"
              placeholder="Enter image URL"
              onChange={(e) => setCoverUrl(e.target.value)}
            />
          </form>

          <ActionButton
            stretched="true"
            onClick={() => {
              setDialogOpen(false);
              disposeState();
            }}
            label="Contribute"
            disabled={isButtonDisabled}
          />
        </div>
      </Dialog>

      <div className="home-shelf">
        <div className="discover-header">
          <div className="discover-contribute">
            <h1>All books</h1>

            <ActionButton
              icon={<AddIcon sx={{ color: "white", fontSize: "1.2rem;" }} />}
              onClick={() => setDialogOpen(true)}
              label="Contribute"
            />
          </div>

          <div className="search-filter">
            <SearchBar onChange={(e) => setSearchQuery(e.target.value)} />

            <div>
              <OutlineButton
                icon={
                  <FilterListIcon
                    sx={{ color: "#D77676", fontSize: "1.2rem;" }}
                  />
                }
                onClick={(e) => setAnchorEl(e.currentTarget)}
                label="Filter"
              />

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openFilter}
                onClose={() => setAnchorEl(null)}
              ></Menu>
            </div>
          </div>
        </div>

        <div
          className={
            filteredBooks.length > 0
              ? "discover-books"
              : "discover-books not-found"
          }
        >
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book, index) => (
              <div key={index}>
                <Book labelType="author" book={book} />
              </div>
            ))
          ) : (
            <div className="empty-state">
              <BookX color="#683737" size={64} strokeWidth={1}/>
              <p>
                No books found.
                <br />
                Contribute this book to add in our library!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Discover;
