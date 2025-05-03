import * as React from "react";
import "./ButtonStyle.css";

export default function ActionButton({
  icon,
  onClick,
  label,
  disabled,
  stretched,
  iconOnly = false,
  className
}) {
  const baseClass = stretched ? "filled-button stretched" : "filled-button";
  const combinedClassName = className ? `${baseClass} ${className}` : baseClass;

  return (
    <button className={combinedClassName} onClick={onClick} disabled={disabled}>
      {icon}
      {!iconOnly && (
        <p>{label}</p>
      )}
      
    </button>
  );
}
