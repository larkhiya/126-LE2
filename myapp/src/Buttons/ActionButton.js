import * as React from "react";
import "./ButtonStyle.css";

export default function ActionButton({
  icon,
  onClick,
  label,
  disabled,
  stretched,
  className
}) {
  const baseClass = stretched ? "filled-button stretched" : "filled-button";
  const combinedClassName = className ? `${baseClass} ${className}` : baseClass;

  return (
    <button className={combinedClassName} onClick={onClick} disabled={disabled}>
      {icon}
      <p>{label}</p>
    </button>
  );
}
