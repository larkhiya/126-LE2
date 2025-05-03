import * as React from "react";
import "./ButtonStyle.css";

export default function OutlineButton({ icon, onClick, label, onIconTap }) {
  // Handle the icon click without triggering the parent button's onClick
  const handleIconClick = (e) => {
    // Stop event from propagating up to the parent button
    e.stopPropagation();

    // Call the onIconTap function if provided
    if (onIconTap) {
      onIconTap(e);
    }
  };

  return (
    <button className="outline-button" onClick={onClick}>
      {icon &&(
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="icon-wrapper"
        onClick={handleIconClick}
      >
        {icon}
      </div>
      )}
      
      <p>{label}</p>
    </button>
  );
}
