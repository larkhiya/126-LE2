import { React, useState, useEffect, useContext } from "react";
import Book from "./components/Book";
import LabelInput from "./components/Labelnput";
import ActionButton from "../Buttons/ActionButton";
import StarIcon from "@mui/icons-material/Star";
import MenuButton from "../Buttons/MenuButton.js";
import { MessageCircleMore, PlayIcon, PlusIcon, Send } from "lucide-react";
import LabelTextArea from "./components/LabelTextArea.js";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress, Dialog, Rating, TextField } from "@mui/material";
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

  // Edit review dialog state
  const [editReviewDialog, setEditReviewDialog] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editReviewTitle, setEditReviewTitle] = useState("");
  const [editReviewText, setEditReviewText] = useState("");
  const [deleteReviewDialog, setDeleteReviewDialog] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [deletingReview, setDeletingReview] = useState(false);

  // Comment visibility
  const [visibleComments, setVisibleComments] = useState({});

  //Comment deletion
  const [deleteCommentDialog, setDeleteCommentDialog] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState({
    reviewId: null,
    commentId: null,
  });
  const [deletingComment, setDeletingComment] = useState(false);

  // User reviewed
  const [userReview, setUserReview] = useState(null);

  // For review editing
  const [originalReview, setOriginalReview] = useState(null);

  // Menu state for review actions
  const [activeMenu, setActiveMenu] = useState(null);

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
        // Check if user has already reviewed this book
        if (user && authTokens) {
          const userReviewFound = reviewsResponse.data.find(
            (review) => review.user.id === user.user_id
          );
          if (userReviewFound) {
            setUserReview(userReviewFound);
          } else {
            setUserReview(null); // Reset if no review found
          }
        } else {
          setUserReview(null); // Reset when not logged in
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id, authTokens, user]);

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

      // Set this as the user's review
      setUserReview(response.data);

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
      if (error.response && error.response.data && error.response.data.detail) {
        alert(error.response.data.detail);
      } else if (error.response && error.response.status === 400) {
        alert("You have already reviewed this book");
      } else {
        alert("Error submitting review. Please try again.");
      }
      setSubmittingReview(false);
    }
  };

  // Add this with your other handler functions
  const openDeleteReviewDialog = (reviewId) => {
    setReviewToDelete(reviewId);
    setDeleteReviewDialog(true);
  };

  const openEditReviewDialog = (review) => {
    console.log("Editing review:", review);

    setEditReviewId(review.id);
    setEditRating(review.rating);
    setEditReviewTitle(review.title || "");
    setEditReviewText(review.text);
    setOriginalReview({
      rating: review.rating,
      title: review.title || "",
      text: review.text,
    });
    setEditReviewDialog(true);
    setActiveMenu(null);
  };

  // Edit an existing review
  const handleEditReview = async () => {
    if (editRating === 0 || !editReviewText) {
      alert("Please provide both a rating and review text");
      return;
    }

    if (
      originalReview &&
      editRating === originalReview.rating &&
      editReviewTitle === originalReview.title &&
      editReviewText === originalReview.text
    ) {
      alert("You haven't made any changes to your review.");
      return;
    }

    try {
      setSubmittingReview(true);

      const reviewData = {
        rating: editRating,
        title: editReviewTitle,
        text: editReviewText,
      };

      const response = await axios.put(
        `http://127.0.0.1:8000/api/books/${id}/reviews/${editReviewId}/`,
        reviewData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );

      // Update the review in the reviews list
      const updatedReviews = reviews.map((review) =>
        review.id === editReviewId ? response.data : review
      );
      setReviews(updatedReviews);

      // Update the userReview if it's the one being edited
      if (userReview && userReview.id === editReviewId) {
        setUserReview(response.data);
      }

      // Close dialog and reset form
      setEditReviewDialog(false);
      setEditReviewId(null);
      setEditRating(0);
      setEditReviewTitle("");
      setEditReviewText("");
      setOriginalReview(null);

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
      console.error("Error updating review:", error);
      alert("Error updating review. Please try again.");
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      setDeletingReview(true);

      await axios.delete(
        `http://127.0.0.1:8000/api/books/${id}/reviews/${reviewId}/`,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );

      // Remove the review from the reviews list
      const updatedReviews = reviews.filter((review) => review.id !== reviewId);
      setReviews(updatedReviews);

      // If deleted review was the user's review, clear userReview state
      if (userReview && userReview.id === reviewId) {
        setUserReview(null);
      }

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

      setActiveMenu(null);
      setDeleteReviewDialog(false);
      setDeletingReview(false);
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Error deleting review. Please try again.");
      setDeletingReview(false);
    }
  };

  // Delete a review
  const handleDeleteComment = async (reviewId, commentId) => {
    try {
      setDeletingComment(true);

      await axios.delete(
        `http://127.0.0.1:8000/api/books/${id}/reviews/${reviewId}/comments/${commentId}/`,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );

      // Update the reviews list by removing the deleted comment
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

      // Close the dialog and reset state
      setDeleteCommentDialog(false);
      setCommentToDelete({ reviewId: null, commentId: null });
      setDeletingComment(false);
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Error deleting comment. Please try again.");
      setDeletingComment(false);
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

      // Make sure comments are visible after adding a new one
      setVisibleComments({
        ...visibleComments,
        [reviewId]: true,
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

  // Toggle comment visibility
  const toggleComments = (reviewId) => {
    setVisibleComments({
      ...visibleComments,
      [reviewId]: !visibleComments[reviewId],
    });
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
      setbookStateDialog(false);
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
      await axios.delete(
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

  // Check if user is the author of a review or comment
  const isUserAuthor = (item) => {
    return user && item.user && item.user.username === user.username;
  };

  if (loading) return <CircularProgress color="secondary" />;
  if (!book) return <p>Book not found</p>;

  return (
    <div className="book-details-page">
      <Dialog
        open={deleteCommentDialog}
        onClose={() => setDeleteCommentDialog(false)}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#fce5dd",
            borderRadius: "10px",
            width: "100%",
            maxWidth: "20rem",
            padding: "1.5rem",
          },
        }}
      >
        <div className="delete-comment-dialog">
          <h2>Delete Comment</h2>
          <p>
            Are you sure you want to delete your comment?{" "}
            <strong>This action cannot be undone.</strong>
          </p>

          <div className="delete-buttons-container">
            <OutlineButton
              label="Cancel"
              onClick={() => setDeleteCommentDialog(false)}
              disabled={deletingComment}
            />
            <ActionButton
              label={deletingComment ? "Deleting..." : "Delete"}
              onClick={() => {
                if (commentToDelete.reviewId && commentToDelete.commentId) {
                  handleDeleteComment(
                    commentToDelete.reviewId,
                    commentToDelete.commentId
                  );
                }
              }}
              disabled={deletingComment}
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        open={deleteReviewDialog}
        onClose={() => setDeleteReviewDialog(false)}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#fce5dd",
            borderRadius: "10px",
            width: "100%",
            maxWidth: "20rem",
            padding: "1.5rem",
          },
        }}
      >
        <div className="delete-review-dialog">
          <h2>Delete Review</h2>
          <p>
            Are you sure you want to delete your review?{" "}
            <strong>This action cannot be undone.</strong>
          </p>

          <div className="delete-buttons-container">
            <OutlineButton
              label="Discard"
              onClick={() => setDeleteReviewDialog(false)}
            />
            <ActionButton
              label={deletingReview ? "Deleting..." : "Delete"}
              onClick={() => handleDeleteReview(reviewToDelete)}
              disabled={deletingReview}
            />
          </div>
        </div>
      </Dialog>

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

      {/* Edit Review Dialog */}
      <Dialog
        open={editReviewDialog}
        onClose={() => setEditReviewDialog(false)}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#FBE5DC",
            borderRadius: "10px",
            width: "100%",
            maxWidth: "30rem",
            padding: "1.5rem",
            gap: "0.5rem",
          },
        }}
      >
        <div className="edit-dialog">
          <div className="edit-dialog-header">
            <h1>Edit Your Review</h1>
          </div>
          <div className="rating">
            <Rating
              name="edit-rating"
              value={editRating}
              onChange={(event, newValue) => {
                setEditRating(newValue);
              }}
              sx={{
                "& .MuiRating-icon": {
                  fontSize: {
                    xs: "2rem",
                    sm: "2rem",
                    md: "3rem",
                    lg: "3rem",
                  },
                },
              }}
            />
          </div>
          <div className="edit-content-wrapper">
            <LabelInput
              outlined={true}
              required={false}
              label="Title"
              placeholder="Enter review title (optional)"
              value={editReviewTitle}
              onChange={(e) => setEditReviewTitle(e.target.value)}
            />

            <LabelTextArea
              outlined={true}
              label="Review"
              placeholder="Enter your review"
              value={editReviewText}
              onChange={(e) => setEditReviewText(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <OutlineButton
              label="Cancel"
              onClick={() => setEditReviewDialog(false)}
            />
            <ActionButton
              label={submittingReview ? "Saving..." : "Save Changes"}
              onClick={handleEditReview}
              disabled={submittingReview || editRating === 0 || !editReviewText}
            />
          </div>
        </div>
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
                {userReview ? (
                  <>
                    <div className="my-review-header">
                      <h2>My Review</h2>
                      <MenuButton
                        onDeleteClick={() =>
                          openDeleteReviewDialog(userReview.id)
                        }
                      />
                    </div>
                    <div className="rating">
                      <Rating
                        value={userReview.rating}
                        readOnly
                        sx={{
                          "& .MuiRating-icon": {
                            fontSize: {
                              xs: "2rem",
                              sm: "2rem",
                              md: "3rem",
                              lg: "3rem",
                            },
                          },
                        }}
                      />
                    </div>
                    <div className="review-title">
                      {userReview.title && <p>{userReview.title}</p>}
                    </div>
                    <p className="review-text">{userReview.text}</p>
                    <div className="edit-button-container">
                      <ActionButton
                        filled-button
                        onClick={() => openEditReviewDialog(userReview)}
                        className="edit-button"
                        label="Edit"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h2>What do you think about this book?</h2>
                    <div className="rating">
                      <Rating
                        name="rating"
                        value={rating}
                        onChange={(event, newValue) => {
                          setRating(newValue);
                        }}
                        sx={{
                          "& .MuiRating-icon": {
                            fontSize: {
                              xs: "2rem",
                              sm: "2rem",
                              md: "3rem",
                              lg: "3rem",
                            },
                          },
                        }}
                      />
                    </div>

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
                        disabled={
                          submittingReview || rating === 0 || !reviewText
                        }
                      />
                    </div>
                  </>
                )}
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
                    <p className="review-username">{review.user.username}</p>
                    <div>
                      <p className="review-date">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="rating">
                    <Rating value={review.rating} readOnly size="large" />
                  </div>
                  <div className="review-title">
                    {review.title && <p>{review.title}</p>}
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

                  <button
                    className="comments-toggle-button"
                    onClick={() => toggleComments(review.id)}
                  >
                    <MessageCircleMore size={16} />
                    <span>
                      {review.comments && review.comments.length > 0
                        ? `${
                            visibleComments[review.id] ? "Hide" : "Show"
                          } Comments (${review.comments.length})`
                        : "Comment"}
                    </span>
                  </button>
                  <div className="comments">
                    {visibleComments[review.id] && (
                      <>
                        {review.comments && review.comments.length > 0 ? (
                          <>
                            {/* Custom HR - Only render once above the comments */}
                            <div className="custom-hr">
                              <p>Comments</p>
                            </div>

                            {/* Container div to wrap all comments */}
                            <div className="comments-container">
                              {review.comments.map((comment) => (
                                <div
                                  className="single-comment"
                                  key={comment.id}
                                >
                                  <div className="sub-comments">
                                    <div className="avatar"></div>

                                    <div className="review-content">
                                      <div className="comment-content">
                                        <div className="comment-header">
                                          <p>{comment.user.username}</p>
                                          <div className="comment-date-actions">
                                            <p>
                                              {new Date(
                                                comment.created_at
                                              ).toLocaleDateString()}
                                            </p>
                                            {user &&
                                              user.user_id ===
                                                comment.user.id && (
                                                <MenuButton
                                                  onDeleteClick={() => {
                                                    setCommentToDelete({
                                                      reviewId: review.id,
                                                      commentId: comment.id,
                                                    });
                                                    setDeleteCommentDialog(
                                                      true
                                                    );
                                                  }}
                                                />
                                              )}
                                          </div>
                                        </div>

                                        <p>{comment.text}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="none-comment">
                            <p>No comments yet</p>
                          </div>
                        )}

                        {authTokens ? (
                          <div className="add-comment-input">
                            <input
                              type="text"
                              placeholder="Add a comment"
                              value={newCommentTexts[review.id] || ""}
                              onChange={(e) =>
                                handleCommentInputChange(
                                  review.id,
                                  e.target.value
                                )
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
                              aria-label="Send comment"
                            >
                              <Send size={20} color="#D77676" />
                            </button>
                          </div>
                        ) : (
                          <div className="comment-note">
                            <p>
                              <em>Log in to comment on this review.</em>
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
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
