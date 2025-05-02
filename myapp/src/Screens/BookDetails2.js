import { React, useState, useEffect, useContext } from "react";
import Book from "./components/Book";
import LabelInput from "./components/Labelnput";
import ActionButton from "../Buttons/ActionButton";
import StarIcon from "@mui/icons-material/Star";
import { MessageCircleMore, Send } from "lucide-react";
import LabelTextArea from "./components/LabelTextArea.js";
import { useParams } from "react-router-dom";
import { Rating } from "@mui/material";
import axios from "axios";
import AuthContext from "../context/AuthContext";

function BookDetails2() {
  const { id } = useParams();
  const { authTokens } = useContext(AuthContext);
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

  // Book status state
  const [bookStatus, setBookStatus] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch book details and reviews
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        // Get book details
        const bookResponse = await axios.get(`http://127.0.0.1:8000/api/books/${id}/`, 
          authTokens ? {
            headers: {
              'Authorization': `Bearer ${authTokens.access}`
            }
          } : {}
        );
        setBook(bookResponse.data);

        // Get reviews for this book
        const reviewsResponse = await axios.get(`http://127.0.0.1:8000/api/books/${id}/reviews/`, 
          authTokens ? {
            headers: {
              'Authorization': `Bearer ${authTokens.access}`
            }
          } : {}
        );
        setReviews(reviewsResponse.data);

        // Check if user has a status for this book
        try {
          const statusResponse = await axios.get(
            `http://127.0.0.1:8000/api/book-statuses/`,
            {
              headers: {
                Authorization: `Bearer ${authTokens?.access}`,
              },
            }
          );
          const userStatus = statusResponse.data.find(
            (status) => status.book === parseInt(id)
          );

          if (userStatus) {
            setBookStatus(userStatus.status);
          }
        } catch (error) {
          console.error("Error fetching book status:", error);
        }

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

  // Update book status (read/reading)
  const handleUpdateBookStatus = async (status) => {
    try {
      setUpdatingStatus(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/book-statuses/",
        {
          book: parseInt(id),
          status: status,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );

      setBookStatus(status);
      setUpdatingStatus(false);
    } catch (error) {
      console.error("Error updating book status:", error);
      alert("Error updating book status. Please try again.");
      setUpdatingStatus(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!book) return <p>Book not found</p>;

  return (
    <div className="book-details-page">
      <div className="book-main-section">
        <div className="book-cover-container">
          <Book book={book} showLabel={false} />
          <ActionButton
            label={bookStatus === "reading" ? "Reading" : "Read"}
            stretched={true}
            onClick={() =>
              handleUpdateBookStatus(
                bookStatus === "reading" ? "read" : "reading"
              )
            }
            disabled={updatingStatus}
          />
        </div>

        <div className="book-info-container">
          <div>
            <h1>{book.title}</h1>
            <h2>{book.author}</h2>
          </div>

          <div className="rating">
            <p>
              {book.average_rating ? book.average_rating.toFixed(1) : "0.0"}
            </p>
            <StarIcon sx={{ color: "#FFD53D", fontSize: 20 }} />
            <p style={{ padding: "0 8px" }}>|</p>
            <p>{book.review_count} reviews</p>
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
              <strong>Please sign in to leave a review.</strong>
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
                        fontWeight: "bold",
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
