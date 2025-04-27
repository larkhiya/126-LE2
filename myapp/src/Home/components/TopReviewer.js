import React from "react"; 

function TopReviewer({ user }) {

  return (
    <div className="reviewer-container">
      <div className="reviewer"></div>

      <div className="reviewer-container label">
        <p>{user.name}</p>
        <p>{user.reviewsWritten}</p>
      </div>
    </div>
  );
}

export default TopReviewer;