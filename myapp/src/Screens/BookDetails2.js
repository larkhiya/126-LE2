import { React, useState, useEffect, useContext } from "react";
import Book from "./components/Book";
import { books } from "./DummyData.js";
import { sampleBook, sampleReviews } from "./BookDetailsSample.js";
import LabelInput from "./components/Labelnput";
import ActionButton from "../Buttons/ActionButton";
import StarIcon from "@mui/icons-material/Star";
import { MessageCircleMore, Send } from "lucide-react";
import LabelTextArea from "./components/LabelTextArea.js";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, Rating } from "@mui/material";
import AuthContext from "../context/AuthContext.js";
import DataContext from "../context/DataContext.js";
import OutlineButton from "../Buttons/OutlineButton.js";

function BookDetails2({}) {
  let { user, authTokens } = useContext(AuthContext);
  let { refreshBooks } = useContext(DataContext);
  const [editRating, setEditRating] = useState(0);
  const [value, setValue] = useState(0);

  const { id } = useParams();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();

  const [bookStateDialog, setbookStateDialog] = useState(false);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/books/${id}`)
      .then((res) => setBook(res.data))
      .catch((err) => console.error("Error fetching book:", err));
  }, [id]);

  const setBookStatus = async (status) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/bookStatus/",
        { book: id, status},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      refreshBooks();
      console.log("Status set:", response.data);
    } catch (error) {
      if (error.response?.status === 400) {
        alert("Bad request: " + JSON.stringify(error.response.data));
      } else if (error.response?.status === 401) {
        alert("Unauthorized: Please log in.");
      } 
    }
  };

  const removeBookFromShelf = async () => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/user/bookStatus/remove/?book=${id}`,
        {
          headers: {
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      console.log("Book removed from shelf");
      refreshBooks();
      setbookStateDialog(false); 
     
    } catch (error) {
      if (error.response?.status === 404) {
        alert("Book not found on your shelf");
      } else if (error.response?.status === 401) {
        alert("Unauthorized: Please log in.");
      } else {
        console.error("Error removing book from shelf:", error);
        alert("Failed to remove book from shelf. Please try again.");
      }
    }
  };

  const uncontribute = () => {
    axios
      .delete(`http://127.0.0.1:8000/api/books/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      })
      .then(() => {
        console.log("Book deleted");
        refreshBooks();
        navigate("/discover");
      })
      .catch((err) => console.error("Delete failed:", err));
  };

  if (!book) return <p>Loading...</p>;
  return (
    <div className="book-details-page">
      <Dialog
        open={bookStateDialog}
        onClose={() => {
          setbookStateDialog(false);
        }}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#FBE5DC",
            borderRadius: "10px",
            width: "100%",
            maxWidth: "20rem",
            padding: "1rem",
            gap: "0.5rem",
          },
        }}
      >
        <OutlineButton label="read" onClick={() => setBookStatus('read')} />
        <OutlineButton label="currently reading" onClick={() => setBookStatus('reading')} />
        <OutlineButton label="remove from shelf" onClick={() => removeBookFromShelf()} />
      </Dialog>

      <div className="book-main-section">
        <div className="book-cover-container ">
          <Book book={book} showLabel={false} />
          <ActionButton
            label="Read"
            onClick={() => setbookStateDialog(true)}
            stretched={true}
          />
          <ActionButton
            label="Delete"
            onClick={uncontribute}
            stretched={true}
          />
        </div>

        <div className="book-info-container">
          <div>
            <h1>{book.title}</h1>
            <h2>{book.author}</h2>
          </div>

          <div className="rating">
            <p>{book.average_rating}</p>
            <StarIcon sx={{ color: "#FFD53D", fontSize: 20 }} />
            <p style={{ padding: "0 8px" }}>|</p>
            <p>{book.review_count} reviews</p>
          </div>

          <p>{book.synopsis}</p>

          <hr className="divider" />

          <h2>Genres</h2>
          <div className="genres">
            {book.genres.map((genre, index) => (
              <p className="genre-tag" key={genre.id}>
                {genre.name}
              </p>
            ))}
          </div>

          {user && (
            <>
              <hr className="divider" />

              <div className="review-form-container">
                <h2>What do you think about this book?</h2>
              </div>

              <Rating
                name="simple-controlled"
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
                size="large"
              />
              {/* <div className="rating-stars-container">
            <div className="review-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={star <= editRating ? "#F7D060" : "#fae5e5"}
                  width="3.75rem"
                  height="3.75rem"
                  style={{ cursor: "pointer", margin: "0 0.4rem" }}
                  onClick={() => {}}
                >
                  <path d="M12 2l2.923 5.92 6.535.95-4.729 4.61 1.117 6.51L12 17.27l-5.846 3.07 1.117-6.51-4.729-4.61 6.535-.95z" />
                </svg>
              ))}
            </div>
          </div> */}
              <div className="input-form-container">
                <LabelInput
                  outlined={true}
                  required={false}
                  label="Title"
                  placeholder="Enter review title (optional)"
                  onChange={(e) => {}}
                />

                <LabelTextArea
                  outlined={true}
                  label="Review"
                  placeholder="Enter your review"
                  onChange={(e) => {}}
                />

                <ActionButton label="Submit" onClick={() => {}} />
              </div>
            </>
          )}
          <hr className="divider" />

          <h2>Reviews</h2>
          {sampleReviews.map((review) => (
            <div className="single-review" key={review.id}>
              <div className="avatar"></div>

              <div className="review-content">
                <div className="review-header">
                  <p>{review.name}</p>
                  <p>{review.date}</p>
                </div>

                {review.title && (
                  <p style={{ display: "block", marginTop: "0.5rem" }}>
                    {review.title}
                  </p>
                )}
                <p className="review-text">{review.text}</p>

                <button className="comment-action">
                  <MessageCircleMore color="#683737" />
                  <p className="comment-text">Comment</p>
                </button>

                <div className="custom-hr">Comments</div>

                {review.comments.map((comment) => (
                  <div className="single-comment" key={comment.id}>
                    <div className="avatar"></div>

                    <div className="review-content">
                      <div className="comment-content">
                        <div className="comment-header">
                          <p>{comment.name}</p>
                          <p>{comment.date}</p>
                        </div>

                        <p>{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="add-comment-wrapper">
                  <div className="add-comment-input">
                    <input
                      type="text"
                      placeholder="Add a comment"
                      //   value={newCommentTexts[review.id] || ""}
                      onChange={
                        (e) => {}
                        // handleCommentInputChange(
                        //   review.id,
                        //   e.target.value
                        // )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          //   handleAddComment(review.id);
                        }
                      }}
                    />
                    <button
                      className="send-icon"
                      onClick={
                        () => {}
                        // handleAddComment(review.id)
                      }
                    >
                      <Send />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookDetails2;
