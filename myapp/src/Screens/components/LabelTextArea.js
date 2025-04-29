export default function LabelTextArea({label, placeholder, onChange, outlined}) {
    return (
      <div className={outlined ? "label-input-container outlined" : "label-input-container"}>
        <small>
          {label}<span style={{ color: "#D77676" }}>*</span>
        </small>
        <textarea placeholder={placeholder} onChange={onChange}></textarea>
      </div>
    );
  }