import * as React from "react";
import "./ButtonStyle.css";

export default function ActionButton({
  icon,
  onClick,
  label,
  disabled,
  stretched,
  iconOnly = false,
}) {
  return (
    <button
      className={stretched ? "filled-button stretched" : "filled-button"}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {!iconOnly && (
        <p>{label}</p>
      )}
      
    </button>
  );
}
