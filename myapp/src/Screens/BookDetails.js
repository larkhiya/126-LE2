import React, { useState } from "react";
import "./style/BookDetails.css";
import StarIcon from "@mui/icons-material/Star";
import LabelInput from "./components/Labelnput";
import ActionButton from "../Buttons/ActionButton";

function BookDetails({ book, initialReviews, currentUser }) {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [isEditing, setIsEditing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [activeCommentDropdown, setActiveCommentDropdown] = useState(null); // NEW for comments
  const [newCommentTexts, setNewCommentTexts] = useState({});

  const userReview = reviews.find((review) => review.name === currentUser.name);

  function handleDeleteComment(reviewId, commentId) {
    const updatedReviews = reviews.map((review) => {
      if (review.id === reviewId) {
        return {
          ...review,
          comments: review.comments.filter(
            (comment) => comment.id !== commentId
          ),
        };
      }
      return review;
    });
    setReviews(updatedReviews);
    setActiveCommentDropdown(null);
  }

  function handleEditClick(userReview) {
    setEditTitle(userReview.title);
    setEditText(userReview.text);
    setEditRating(userReview.rating);
    setIsEditing(true);
  }

  function handleDeleteReview() {
    const updatedReviews = reviews.filter(
      (review) => review.name !== currentUser.name
    );
    setReviews(updatedReviews);
    setShowDropdown(false);
  }

  function handleStarClick(star) {
    setEditRating(star);
  }

  function handleCommentInputChange(reviewId, text) {
    setNewCommentTexts((prev) => ({ ...prev, [reviewId]: text }));
  }

  function handleAddComment(reviewId) {
    const commentText = newCommentTexts[reviewId]?.trim();
    if (!commentText) return;

    const updatedReviews = reviews.map((review) => {
      if (review.id === reviewId) {
        return {
          ...review,
          comments: [
            ...review.comments,
            {
              id: Date.now(),
              name: currentUser.name,
              date: new Date().toLocaleDateString(),
              text: commentText,
            },
          ],
        };
      }
      return review;
    });

    setReviews(updatedReviews);
    setNewCommentTexts((prev) => ({ ...prev, [reviewId]: "" }));
  }

  function handleSubmitEdit() {
    const updatedReviews = [...reviews];
    const userIndex = updatedReviews.findIndex(
      (review) => review.name === currentUser.name
    );

    if (userIndex !== -1) {
      updatedReviews[userIndex] = {
        ...updatedReviews[userIndex],
        title: editTitle,
        text: editText,
        rating: editRating,
        date: new Date().toLocaleDateString(),
      };
    }

    setReviews(updatedReviews);
    setIsEditing(false);
  }

  function handleSubmitReview() {
    if (editText.trim() === "" || editRating === 0) {
      alert("Please provide both a review text and a star rating.");
      return;
    }

    const updatedReviews = [...reviews];
    updatedReviews.unshift({
      id: Date.now(),
      name: currentUser.name,
      date: new Date().toLocaleDateString(),
      rating: editRating,
      title: editTitle,
      text: editText,
      comments: [],
    });

    setReviews(updatedReviews);
    setEditTitle("");
    setEditText("");
    setEditRating(0);
  }

  return (
    <div className="book-details-page">
      <div className="book-main-section">
        {/* --- Book Cover --- */}
        <div className="book-cover-container">
          <img
            src={book.coverUrl}
            alt="Book Cover"
            className="book-cover-image"
          />
          <div className="read-button-wrapper">
            <button
              className="read-button"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              Read
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showDropdown && (
              <div className="read-dropdown-menu">
                <button>Currently Reading</button>
                <button>Done Reading</button>
                <button>Remove from Shelf</button>
              </div>
            )}
          </div>
        </div>

        {/* --- Book Info --- */}
        <div className="book-info-container">
          <h1>{book.title}</h1>
          <h2>{book.author}</h2>

          <div className="rating">
            <p>{book.rating}</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#F7D060" /* your star color */
              width="1.25rem"
              height="1.25rem"
            >
              <path d="M12 2l2.923 5.92 6.535.95-4.729 4.61 1.117 6.51L12 17.27l-5.846 3.07 1.117-6.51-4.729-4.61 6.535-.95z" />
            </svg>
            <p>| {book.reviewsCount} reviews</p>
          </div>

          <p>{book.description}</p>

          <hr className="divider" />

          {/* --- Genres --- */}

          <h2>Genres</h2>

          <div className="genres">
            {book.genres.map((genre, index) => (
              <p className="genre-tag" key={index}>
                {genre}
              </p>
            ))}
          </div>

          <hr className="divider" />

          {/* --- My Review Section --- */}
          {userReview && !isEditing && (
            <div className="my-review-section">
              <div className="my-review-header">
                <h2>My Review</h2>
                <div className="menu-wrapper">
                  <div
                    className="menu-dots"
                    onClick={() => setShowDropdown((prev) => !prev)}
                  >
                    ⋯
                  </div>
                  {showDropdown && (
                    <div className="dropdown-menu">
                      <button onClick={handleDeleteReview}>Delete</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="my-review-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={star <= userReview.rating ? "#F7D060" : "#fae5e5"}
                    width="1.5rem"
                    height="1.5rem"
                    style={{ margin: "0 0.3rem" }}
                  >
                    <path d="M12 2l2.923 5.92 6.535.95-4.729 4.61 1.117 6.51L12 17.27l-5.846 3.07 1.117-6.51-4.729-4.61 6.535-.95z" />
                  </svg>
                ))}
              </div>

              <div className="my-review-content">
                <p>{userReview.name}</p>
                {userReview.title && (
                  <p style={{ display: "block", marginTop: "0.5rem" }}>
                    {userReview.title}
                  </p>
                )}
                <p>{userReview.text}</p>
              </div>

              <div style={{ marginTop: "1rem", textAlign: "right" }}>
                <button
                  onClick={() => handleEditClick(userReview)}
                  style={{
                    backgroundColor: "#d96b63",
                    color: "white",
                    padding: "0.6rem 1.2rem",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          )}

          {/* --- Edit Review Form --- */}
          {userReview && isEditing && (
            <div className="review-section">
              <h2>Edit Your Review</h2>
              <div className="rating-stars-container">
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
                      onClick={() => handleStarClick(star)}
                    >
                      <path d="M12 2l2.923 5.92 6.535.95-4.729 4.61 1.117 6.51L12 17.27l-5.846 3.07 1.117-6.51-4.729-4.61 6.535-.95z" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="review-form-container">
                <div className="form-group">
                  <label className="input-label">Title</label>
                  <input
                    type="text"
                    placeholder="Edit review title (Optional)"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Review</label>
                  <textarea
                    placeholder="Edit your review"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onInput={(e) => {
                      e.target.style.height = "3rem";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                  ></textarea>
                </div>

                <div className="submit-wrapper">
                  <button
                    className="submit-review-button"
                    onClick={handleSubmitEdit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- Write New Review Section if no review --- */}
          {!userReview && (
            <div className="review-form-container">
              <h2>What do you think about this book?</h2>

              <div className="rating-stars-container">
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
                      onClick={() => handleStarClick(star)}
                    >
                      <path d="M12 2l2.923 5.92 6.535.95-4.729 4.61 1.117 6.51L12 17.27l-5.846 3.07 1.117-6.51-4.729-4.61 6.535-.95z" />
                    </svg>
                  ))}
                </div>
              </div>

              {/* <div className="form-group">
                  <label className="input-label">Title</label>
                  <input
                    type="text"
                    placeholder="Enter review title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div> */}

              <LabelInput
                label="Title"
                placeholder="Enter review title"
                onChange={(e) => setEditTitle(e.target.value)}
              />

              <LabelInput
                label="Review"
                placeholder="Enter your review"
                onChange={(e) => setEditText(e.target.value)}
              />

              {/* <div className="form-group">
                  <label className="input-label">Review</label>
                  <textarea
                    placeholder="Enter your review"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onInput={(e) => {
                      e.target.style.height = "3rem";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                  ></textarea>
                </div> */}

              <div className="submit-wrapper">
                <ActionButton label="Submit" onClick={handleSubmitReview} />
              </div>
            </div>
          )}

          {/* --- Public Reviews Section --- */}
          <hr className="divider" />

          <h2>Reviews</h2>

          {reviews.map((review) => (

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

                <div className="comment-action">
                 
                  <p className="comment-text">Comment</p>
                </div>

                <div className="custom-hr">Comments</div>

                <div className="comments">
                  {review.comments.map((comment) => (
                    <div className="single-comment" key={comment.id}>
                      <div className="avatar"></div>

                      <div className="comment-content">
                        <div className="comment-header">
                          <p>{comment.name}</p>
                          <div className="comment-right">
                            <span className="comment-date">{comment.date}</span>

                            {/* Dropdown Dots */}
                            <div className="menu-wrapper">
                              <div
                                className="menu-dots"
                                onClick={() =>
                                  setActiveCommentDropdown(
                                    activeCommentDropdown === comment.id
                                      ? null
                                      : comment.id
                                  )
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                >
                                  <path
                                    d="M9 9.75C9.41421 9.75 9.75 9.41421 9.75 9C9.75 8.58579 9.41421 8.25 9 8.25C8.58579 8.25 8.25 8.58579 8.25 9C8.25 9.41421 8.58579 9.75 9 9.75Z"
                                    stroke="#683737"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M14.25 9.75C14.6642 9.75 15 9.41421 15 9C15 8.58579 14.6642 8.25 14.25 8.25C13.8358 8.25 13.5 8.58579 13.5 9C13.5 9.41421 13.8358 9.75 14.25 9.75Z"
                                    stroke="#683737"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M3.75 9.75C4.16421 9.75 4.5 9.41421 4.5 9C4.5 8.58579 4.16421 8.25 3.75 8.25C3.33579 8.25 3 8.58579 3 9C3 9.41421 3.33579 9.75 3.75 9.75Z"
                                    stroke="#683737"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              {activeCommentDropdown === comment.id && (
                                <div className="dropdown-menu">
                                  <button
                                    onClick={() =>
                                      handleDeleteComment(review.id, comment.id)
                                    }
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                  
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
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10 14L21 3m0 0l-6 18-7-7-8-2 18-6z"
                          />
                        </svg>
                      </button>
                    </div>
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

export default BookDetails;
