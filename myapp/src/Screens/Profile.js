import { React } from "react";
import "./style/ProfileStyle.css";
// import { books } from "./DummyData.js";
import Book from "./components/Book.js";
import { useData } from "../context/DataContext.js";
import ActionButton from "../Buttons/ActionButton.js";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

export default function Profile() {
  const { profile, contributedBooks, readBooks, readingBooks, wantBooks, recommendedBooks } =
    useData();

  function exportBooksToCSV() {
    const allBooks = [
      ...contributedBooks,
      ...readBooks,
      ...readingBooks,
      ...wantBooks,
    ];
    const uniqueBooks = Array.from(
      new Map(allBooks.map((book) => [book.id, book])).values()
    );

    const headers = ["Title", "Author", "Status"];
    const rows = uniqueBooks.map((book) => {
      let status = "";
      if (readBooks.includes(book)) status = "Read";
      else if (readingBooks.includes(book)) status = "Currently Reading";
      else if (wantBooks.includes(book)) status = "Want to Read";
      else if (contributedBooks.includes(book)) status = "Contributed";
      return [book.title, book.author || "", status];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((e) => e.map((v) => `"${v}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_books.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return (
    <div className="profile-container">
      <div className="profile-content-container">
        <div className="profile-export">
          <div className="reviewer"></div>
          <ActionButton
            icon={
              <SaveAltIcon
                className="icon-button"
                sx={{
                  fontSize: {
                    xs: "1rem",
                    sm: "1rem",
                    md: "1.2rem",
                    lg: "1.2rem",
                  },
                }}
              />
            }
            onClick={exportBooksToCSV}
            label="Books"
            stretched={true}
          />
        </div>

        <div className="user-shelf">
          <h1>{profile.full_name}'s Shelf</h1>
          <div className="shelf-section">
            <h2>Contributed books</h2>
            <div className="book-row">
              {contributedBooks.length > 0 ? (
                contributedBooks
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((book, index) => (
                    <div key={index}>
                      <Book labelType="author" book={book} />
                    </div>
                  ))
              ) : (
                <p className="empty-state">No contributed books yet.</p>
              )}
            </div>
          </div>

          <div className="shelf-section">
            <h2>Want to read</h2>
            <div className="book-row">
              {wantBooks.length > 0 ? (
                wantBooks
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((book, index) => (
                    <div key={index}>
                      <Book labelType="author" book={book} />
                    </div>
                  ))
              ) : (
                <p className="empty-state">
                  You dont have any books you currently want to read.
                </p>
              )}
            </div>
          </div>

          <div className="shelf-section">
            <h2>Have read</h2>
            <div className="book-row">
              {readBooks.length > 0 ? (
                readBooks
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((book, index) => (
                    <div key={index}>
                      <Book labelType="author" book={book} />
                    </div>
                  ))
              ) : (
                <p className="empty-state">
                  You haven't marked any books as read.
                </p>
              )}
            </div>
          </div>

          <div className="shelf-section">
            <h2>Currently reading</h2>
            <div className="book-row">
              {readingBooks.length > 0 ? (
                readingBooks
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((book, index) => (
                    <div key={index}>
                      <Book labelType="author" book={book} />
                    </div>
                  ))
              ) : (
                <p className="empty-state">
                  You're not currently reading any books.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
