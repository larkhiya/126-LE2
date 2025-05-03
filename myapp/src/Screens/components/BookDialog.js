import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import LabelTextArea from "./LabelTextArea";
import ActionButton from "../../Buttons/ActionButton";
import LabelInput from "./Labelnput";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function BookDialog({
  open,
  onClose,
  onSubmit,
  bookData = null,
  genres = [],
  dialogTitle = "Contribute a book",
  submitButtonLabel = "Contribute",
}) {
  // Initialize state based on props - empty for creation, filled for editing
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);

  // For validation
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Fill form data if editing an existing book
  useEffect(() => {
    if (bookData) {
      setTitle(bookData.title || "");
      setAuthor(bookData.author || "");
      setSynopsis(bookData.synopsis || "");
      setCoverUrl(bookData.coverUrl || "");
      setSelectedGenres(bookData.genres || []);
    } else {
      // Reset form when creating a new book
      setTitle("");
      setAuthor("");
      setSynopsis("");
      setCoverUrl("");
      setSelectedGenres([]);
    }
  }, [bookData, open]);

  // Validate form data
  useEffect(() => {
    // Simple validation - check if required fields are filled
    const isValid =
      title.trim() !== "" && author.trim() !== "" && selectedGenres.length > 0;
    setIsButtonDisabled(!isValid);
  }, [title, author, selectedGenres]);

  // Reset form state
  const disposeState = () => {
    setTitle("");
    setAuthor("");
    setSynopsis("");
    setCoverUrl("");
    setSelectedGenres([]);
  };
  
  return (
    <Dialog
      open={open}
      onClose={() => {
         {
          onClose();
          disposeState();
        }
      }}
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#FBE5DC",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "40rem",
        },
      }}
    >
      <div className="contribute-container">
        <small>{title}</small>
        <small>{author}</small>
        <small>{synopsis}</small>
        <small>{coverUrl}</small>
        <small>Selected Genres: {selectedGenres.length > 0 
    ? selectedGenres.map(g => g.name).join(", ") 
    : "none"}</small><br />
  <small>Form Valid: {!isButtonDisabled ? "Yes" : "No"}</small>
        <h1>{dialogTitle}</h1>
        <form
          style={{
            gap: "1.25rem",
            maxHeight: "50vh",
            overflowY: "auto",
          }}
        >
          <LabelInput
            label="Title"
            placeholder="Enter book's title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <LabelInput
            label="Author"
            placeholder="Enter book's author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <LabelTextArea
            outlined={false}
            label="Synopsis"
            placeholder="Enter book's synopsis"
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
          />
          <LabelInput
            label="Cover"
            placeholder="Enter image URL"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
          />

          <Autocomplete
            multiple
            value={selectedGenres}
            onChange={(event, newValue) => setSelectedGenres(newValue)}
            id="book-genres-autocomplete"
            options={genres}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option, { selected }) => {
              const { key, ...optionProps } = props;
              return (
                <li
                  key={key}
                  {...optionProps}
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 500,
                    letterSpacing: "-0.03375rem",
                    fontSize: "1.25rem",
                    color: "#683737",
                  }}
                >
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    checked={selected}
                    sx={{
                      marginRight: 1,
                      color: "#683737",
                      "&.Mui-checked": {
                        color: "#d96b63",
                      },
                    }}
                  />
                  {option.name}
                </li>
              );
            }}
            style={{ width: "100%" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select genre"
                placeholder=""
                sx={{
                  width: "100%",
                  fontFamily: "Inter",
                  fontWeight: 500,
                  "& .MuiInputBase-root": {
                    borderColor: "transparent",
                    backgroundColor: "#fff",
                    fontFamily: "Inter",
                    fontWeight: 500,
                    color: "#8e6969",
                    letterSpacing: "-0.03375rem",
                    fontSize: {
                      xs: "0.85rem",
                      sm: "1rem",
                      md: "1.125rem",
                    },
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      borderColor: "transparent",
                    },
                    "&.Mui-focused fieldset": {
                      borderWidth: "1px",
                      borderColor: "#d96b63",
                      color: "#9F9F9F",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Inter",
                    fontWeight: 500,
                    letterSpacing: "-0.03375rem",
                    fontSize: {
                      xs: "0.85rem",
                      sm: "1rem",
                      md: "1.125rem",
                    },
                    color: "#9F9F9F",
                  },
                  "& .MuiAutocomplete-tag": {
                    fontFamily: "Inter",
                    fontWeight: 500,
                    color: "white",
                    letterSpacing: "-0.03375rem",
                    fontSize: {
                      xs: "0.85rem",
                      sm: "1rem",
                      md: "1.125rem",
                    },
                    backgroundColor: "#D77676",
                  },
                }}
              />
            )}
          />
        </form>

        <ActionButton
          stretched="true"
          onClick={onSubmit}
          label={submitButtonLabel}
          disabled={isButtonDisabled}
        />
      </div>
    </Dialog>
  );
}
