import { React, useState } from "react";
import "./style/DiscoverStyle.css";
import "./style/SearchStyle.css";
import ActionButton from "../Buttons/ActionButton";
import AddIcon from "@mui/icons-material/Add";
import { discoverBooks } from "./DummyData";
import Book from "./components/Book";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import OutlineButton from "../Buttons/OutlineButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchBar from "./components/SearchBar";

function Discover() {
  const [openDialog, setDialogOpen] = useState(false);

  return (
    <div className="home-container">
      <Dialog open={openDialog} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Test</DialogTitle>
        <DialogContent>
          <DialogContentText>Hello</DialogContentText>
        </DialogContent>
        <DialogActions></DialogActions>
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
            <SearchBar />
            <OutlineButton
              icon={
                <FilterListIcon
                  sx={{ color: "#D77676", fontSize: "1.2rem;" }}
                />
              }
              onClick={() => setDialogOpen(true)}
              label="Filter"
            />
          </div>
        </div>

        <div className="discover-books">
          {discoverBooks.map((book, index) => (
            <div key={index}>
              <Book labelType="authoe" book={book} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Discover;
