import React from "react"; 

function Book({ labelType, book }) {
  let label;
  switch (labelType) {
    case "author":
      label = book.author;
      break;
    case "rating":
      label = book.rating;
      break;
    case "review":
      label = `${book.review} reviews`;
      break;
    default:
      label = book.author;
  }

  return (
    <div className="book-container">
      <div className="stack">
        <div className="spine"></div>
        <div className="book" style={{ backgroundColor: book.cover }}></div>
      </div>

      <div className="book-container label">
        <p>{book.title}</p>
        <p>{label}</p>
      </div>
    </div>
  );
}

export default Book;
