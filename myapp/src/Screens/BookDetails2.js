import { React, useState, useEffect, useContext } from "react";
import Book from "./components/Book";
import LabelInput from "./components/Labelnput";
import ActionButton from "../Buttons/ActionButton";
import StarIcon from "@mui/icons-material/Star";
import { MessageCircleMore, PlayIcon, PlusIcon, Send } from "lucide-react";
import LabelTextArea from "./components/LabelTextArea.js";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress, Dialog, Rating } from "@mui/material";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import DataContext from "../context/DataContext.js";
import OutlineButton from "../Buttons/OutlineButton.js";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import StatusButton from "../Buttons/StateButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function BookDetails2() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, authTokens } = useContext(AuthContext);
  const { refreshBooks, userBookStatus, fetchBookStatus, contributedBooks } =
    useContext(DataContext);
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review form state
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Comment states
  const [newCommentTexts, setNewCommentTexts] = useState({});
  const [submittingComment, setSubmittingComment] = useState(false);

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [bookStateDialog, setbookStateDialog] = useState(false);
  const [isContributed, setIsContributed] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [editDialog, setEditDialog] = useState(false);

  const shelfLabel =
    userBookStatus === "reading"
      ? "Currently Reading"
      : userBookStatus === "read"
      ? "Have read"
      : userBookStatus === "want"
      ? "Want to Read"
      : "Shelf";

  // Fetch book details and reviews
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        // Get book details
        const bookResponse = await axios.get(
          `http://127.0.0.1:8000/api/books/${id}/`,
          authTokens
            ? {
                headers: {
                  Authorization: `Bearer ${authTokens.access}`,
                },
              }
            : {}
        );
        setBook(bookResponse.data);
        setIsContributed(
          contributedBooks.some(
            (contributedBook) => contributedBook.id === bookResponse.data.id
          )
        );
        // Get reviews for this book
        const reviewsResponse = await axios.get(
          `http://127.0.0.1:8000/api/books/${id}/reviews/`,
          authTokens
            ? {
                headers: {
                  Authorization: `Bearer ${authTokens.access}`,
                },
              }
            : {}
        );

        setReviews(reviewsResponse.data);

        fetchBookStatus(id);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id, authTokens]);

  // Submit a new review
  const handleSubmitReview = async () => {
    if (rating === 0 || !reviewText) {
      alert("Please provide both a rating and review text");
      return;
    }

    try {
      setSubmittingReview(true);

      const reviewData = {
        rating: rating,
        title: reviewTitle,
        text: reviewText,
      };

      const response = await axios.post(
        `http://127.0.0.1:8000/api/books/${id}/reviews/`,
        reviewData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );

      // Add the new review to the reviews list
      const updatedReviews = [...reviews, response.data];
      setReviews(updatedReviews);

      // Reset form
      setRating(0);
      setReviewTitle("");
      setReviewText("");

      // Refresh book data to get updated average rating
      const bookResponse = await axios.get(
        `http://127.0.0.1:8000/api/books/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );
      setBook(bookResponse.data);

      setSubmittingReview(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      if (error.response && error.response.status === 400) {
        alert("You have already reviewed this book");
      } else {
        alert("Error submitting review. Please try again.");
      }
      setSubmittingReview(false);
    }
  };

  // Handle comment input change
  const handleCommentInputChange = (reviewId, text) => {
    setNewCommentTexts({
      ...newCommentTexts,
      [reviewId]: text,
    });
  };

  // Add a new comment to a review
  const handleAddComment = async (reviewId) => {
    const commentText = newCommentTexts[reviewId];
    if (!commentText || commentText.trim() === "") {
      return;
    }

    try {
      setSubmittingComment(true);

      const response = await axios.post(
        `http://127.0.0.1:8000/api/books/${id}/reviews/${reviewId}/comments/`,
        { text: commentText },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );

      // Update the reviews list with the new comment
      const updatedReviews = reviews.map((review) => {
        if (review.id === reviewId) {
          return {
            ...review,
            comments: [...(review.comments || []), response.data],
          };
        }
        return review;
      });

      setReviews(updatedReviews);

      // Clear the comment input
      setNewCommentTexts({
        ...newCommentTexts,
        [reviewId]: "",
      });

      setSubmittingComment(false);
    } catch (error) {
      console.error("Error adding comment:", error);
      if (error.response && error.response.status === 400) {
        alert("You have already commented on this review");
      } else {
        alert("Error adding comment. Please try again.");
      }
      setSubmittingComment(false);
    }
  };

  const setBookStatus = async (status) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/bookStatus/",
        { book: id, status },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      refreshBooks();
      fetchBookStatus(id);
      setbookStateDialog(false);
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
      fetchBookStatus(id);
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

  if (loading) return <CircularProgress color="secondary" />;
  if (!book) return <p>Book not found</p>;

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
        <h1>Add to shelf</h1>
        <StatusButton
          label="Want to read"
          buttonStatus="want"
          bookStatus={userBookStatus}
          onClick={() => setBookStatus("want")}
        />
        <StatusButton
          label="Have read"
          buttonStatus="read"
          bookStatus={userBookStatus}
          onClick={() => setBookStatus("read")}
        />
        <StatusButton
          label="Currently reading"
          buttonStatus="reading"
          bookStatus={userBookStatus}
          onClick={() => setBookStatus("reading")}
        />
        <button onClick={() => removeBookFromShelf()}>
          <p className="remove-from-shelf">Remove from shelf</p>
        </button>
      </Dialog>

      <Dialog
        open={deleteConfirmation}
        onClose={() => {
          setDeleteConfirmation(false);
        }}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#FBE5DC",
            borderRadius: "10px",
            width: "100%",
            maxWidth: "30rem",
            padding: "1rem",
            gap: "1.5rem",
          },
        }}
      >
        <h1>Delete contributed book?</h1>
        <p>
          {" "}
          Are you sure you want to remove your contibuted book in our library?
          This action cannot be undone and it will remove the contributed book
          permanently.
        </p>
        <ActionButton label="Remove from library" onClick={uncontribute} />
      </Dialog>

      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
        <h1>Edit contributed book</h1>
      </Dialog>

      <div className="book-main-section">
        <div className="book-cover-container">
          <Book book={book} showLabel={false} />
        </div>

        <div className="book-info-container">
          <div>
            <h1>{book.title}</h1>
            <h2>{book.author}</h2>
          </div>

          {user && (
          <div className="button-group">
            <ActionButton
              icon={
                !userBookStatus ? (
                  <AddIcon
                    sx={{
                      color: "white",
                      fontSize: {
                        xs: "1rem",
                        sm: "1rem",
                        md: "1.2rem",
                        lg: "1.2rem",
                      },
                    }}
                  />
                ) : (
                  <ExpandMoreIcon
                    sx={{
                      color: "white",
                      fontSize: {
                        xs: "1rem",
                        sm: "1rem",
                        md: "1.6rem",
                        lg: "1.6rem",
                      },
                    }}
                  />
                )
              }
              label={shelfLabel}
              stretched={true}
              onClick={() => setbookStateDialog(true)}
              disabled={updatingStatus}
            />

            {isContributed && (
              <div className="button-group2">
                {/* <ActionButton
                  iconOnly={true}
                  icon={
                    <EditIcon
                      className="icon-button"
                      onClick={() => setEditDialog(true)}
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
                  onClick={() => {}}
                  stretched={true}
                /> */}

                <ActionButton
                  iconOnly={true}
                  icon={
                    <DeleteIcon
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
                  onClick={() => {
                    setDeleteConfirmation(true);
                  }}
                  stretched={true}
                />
              </div>
            )}
          </div>
          )}

          <div className="rating">
            <p>
              {book.average_rating ? book.average_rating.toFixed(1) : "0.0"}
            </p>
            <StarIcon sx={{ color: "#FFD53D", fontSize: 20 }} />
            <p style={{ padding: "0 8px" }}>|</p>
            <p>{book.review_count} {book.review_count === 1 ? 'review' : 'reviews'}</p>
          </div>

          <p>{book.synopsis}</p>

          <hr className="divider" />

          <h2>Genres</h2>
          <div className="genres">
            {book.genres.map((genre) => (
              <p className="genre-tag" key={genre.id}>
                {genre.name}
              </p>
            ))}
          </div>

          <hr className="divider" />
          {authTokens ? (
            <>
              <div className="review-form-container">
                <h2>What do you think about this book?</h2>
              </div>

              <Rating
                name="rating"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                size="large"
              />

              <div className="input-form-container">
                <LabelInput
                  outlined={true}
                  required={false}
                  label="Title"
                  placeholder="Enter review title (optional)"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                />

                <LabelTextArea
                  outlined={true}
                  label="Review"
                  placeholder="Enter your review"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />

                <ActionButton
                  label={submittingReview ? "Submitting..." : "Submit"}
                  onClick={handleSubmitReview}
                  disabled={submittingReview || rating === 0 || !reviewText}
                />
              </div>
            </>
          ) : (
            <p>
              Please sign in to leave a review.
            </p>
          )}

          <hr className="divider" />

          <h2>Reviews</h2>
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <div className="single-review" key={review.id}>
                <div className="avatar"></div>

                <div className="review-content">
                  <div className="review-header">
                    <p>{review.user.username}</p>
                    <p>{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>

                  <div className="rating">
                    <Rating value={review.rating} readOnly size="small" />
                  </div>

                  {review.title && (
                    <p
                      style={{
                        display: "block",
                        marginTop: "0.5rem",
                        fontWeight: "500",
                      }}
                    >
                      {review.title}
                    </p>
                  )}
                  <p className="review-text">{review.text}</p>

                  <div className="custom-hr">Comments</div>

                  {review.comments && review.comments.length > 0 ? (
                    review.comments.map((comment) => (
                      <div className="single-comment" key={comment.id}>
                        <div className="avatar"></div>

                        <div className="review-content">
                          <div className="comment-content">
                            <div className="comment-header">
                              <p>{comment.user.username}</p>
                              <p>
                                {new Date(
                                  comment.created_at
                                ).toLocaleDateString()}
                              </p>
                            </div>

                            <p>{comment.text}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No comments yet</p>
                  )}

                  {authTokens ? (
                    <div className="add-comment-wrapper">
                      <div className="add-comment-input">
                        <input
                          type="text"
                          placeholder="Add a comment"
                          value={newCommentTexts[review.id] || ""}
                          onChange={(e) =>
                            handleCommentInputChange(review.id, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleAddComment(review.id);
                            }
                          }}
                        />
                        <button
                          className="send-icon"
                          onClick={() => handleAddComment(review.id)}
                          disabled={submittingComment}
                        >
                          <Send />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p>
                      <em>Log in to comment on this review.</em>
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetails2;
