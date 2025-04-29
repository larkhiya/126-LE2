import * as React from "react";

export default function LabelInput({label, placeholder, onChange}) {
  return (
    <div className="label-input-container">
      <small>
        {label}<span style={{ color: "#D77676" }}>*</span>
      </small>
      <input placeholder={placeholder} onChange={onChange}></input>
    </div>
  );
}
