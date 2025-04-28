import * as React from "react";
import "./ButtonStyle.css";

export default function OutlineButton({ icon, onClick, label }) {
  return (
    <button className="outline-button" onClick={onClick}>
      {icon}
      <p>{label}</p>
    </button>
  );
}
