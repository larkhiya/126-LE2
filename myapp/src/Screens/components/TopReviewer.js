import React from "react"; 

function TopReviewer({ user }) {

  return (
    <div className="reviewer-container">
      <div className="reviewer"></div>

      <div className="reviewer-container label">
        <p>{user.username}</p>
        <p>{user.review_count} reviewed</p>
      </div>
    </div>
  );
}

export default TopReviewer;