import * as React from "react";
import "./ButtonStyle.css";

export default function ActionButton({
  icon,
  onClick,
  label,
  disabled,
  stretched
}) {
  return (
    <button className={stretched ? 'filled-button stretched' : 'filled-button'} onClick={onClick} disabled={disabled}>
        {icon}
        <p>{label}</p>
    </button>
  );
}
