import * as React from "react";
import "./ButtonStyle.css";

export default function ActionButton({
  icon,
  onClick,
  label,
}) {
  return (
    <button className="filled-button" onClick={onClick}>
        {icon}
        <p>{label}</p>
    </button>
  );
}
