import React from "react";
import StarIcon from "@mui/icons-material/Star";
import { Box } from "@mui/material";

function Book({ labelType, book, showLabel = true }) {
  let label;
  switch (labelType) {
    case "author":
      label = book.author;
      break;
    case "rating":
      label = (
        <Box display="flex" alignItems="center" justifyContent="center">
          {book.average_rating} <StarIcon sx={{ color: "#FFD700", ml: 0.5 }} />
        </Box>
      );
      break;
    case "review":
      label = `${book.review_count} reviews`;
      break;
    default:
      label = book.author;
  }

  return (
    <div className="book-container">
      <div className="stack">
        <div className="spine"></div>
        <div className="book" style={{ backgroundImage: `url(${book.cover_url})`, backgroundSize: "cover",
    backgroundPosition: "center",}}></div>
      </div>

      {showLabel && (
        <div className="book-container label">
          <p>{book.title}</p>
          <p>{label}</p>
        </div>
      )}
    </div>
  );
}

export default Book;
