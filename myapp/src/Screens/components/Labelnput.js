import * as React from "react";

export default function LabelInput({
  label,
  placeholder,
  onChange,
  outlined,
  required = true,
}) {
  return (
    <div
      className={
        outlined ? "label-input-container outlined" : "label-input-container"
      }
    >
      <small>
        {label}
        <span
          style={{
            color: "#D77676",
            display: required ? "inline" : "none",
          }}
        >
          *
        </span>
      </small>
      <input placeholder={placeholder} onChange={onChange}></input>
    </div>
  );
}
