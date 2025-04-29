import * as React from "react";

export default function SearchBar({onChange}) {
  return (
    <input
      className="search-container"
      type="text"
      placeholder="Search a book's title or author"
      onChange={onChange}
    ></input>
  );
}
