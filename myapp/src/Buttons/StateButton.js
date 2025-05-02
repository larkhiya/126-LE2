import * as React from "react";
import "./ButtonStyle.css";

export default function StatusButton({ icon, onClick, label, buttonStatus, bookStatus }) {
  const matched = buttonStatus === bookStatus;

  const buttonStyle = {
    backgroundColor: matched ? '#d77676' : '#fbf1f1',
    justifyContent: 'center',
    alignItems: 'center', 
  };

  const textStyle = {
    color: matched ? 'white' : '#d77676',
    textAlign: 'center',
  };

  return (
    <button className="outline-button" style={buttonStyle} onClick={onClick}>
      {icon}
      <p style={textStyle}>{label}</p>
    </button>
  );
}