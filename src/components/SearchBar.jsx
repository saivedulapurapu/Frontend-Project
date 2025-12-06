// SearchBar.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedQuery = localStorage.getItem("searchQuery") || "";
    setQuery(savedQuery);
  }, []);

  const handleChange = (e) => {
    const newQuery = e.target.value.toLowerCase().trim();
    setQuery(newQuery);

    const allRecipes = JSON.parse(localStorage.getItem("allRecipes")) || [];

    if (!newQuery) {
      setMatches([]);
      return;
    }

    const results = allRecipes.filter((r) =>
      r.name.toLowerCase().includes(newQuery)
    );

    setMatches(results.slice(0, 10));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const allRecipes = JSON.parse(localStorage.getItem("allRecipes")) || [];
    const results = allRecipes.filter((r) =>
      r.name.toLowerCase().includes(query.toLowerCase())
    );

    localStorage.setItem("searchQuery", query);
    localStorage.setItem("searchResults", JSON.stringify(results));

    // 👇 key change: include the query in the URL
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const openRecipe = (id) => {
    localStorage.setItem("recipeId", id);
    navigate("/details");
  };

  useEffect(() => {
    const hide = (e) => {
      if (!suggestionsRef.current?.contains(e.target)) {
        setMatches([]);
      }
    };
    document.addEventListener("click", hide);
    return () => document.removeEventListener("click", hide);
  }, []);

  return (
    <form
      className="d-flex ms-auto position-relative"
      ref={suggestionsRef}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="form-control rounded-start-pill"
        placeholder="Search..."
        value={query}
        onChange={handleChange}
        style={{ width: "200px" }}
      />

      <button type="submit" className="btn btn-light rounded-end-pill">
        <i className="bi bi-search text-dark"></i>
      </button>

      {matches.length > 0 && (
        <ul
          className="list-group position-absolute w-100 shadow-sm"
          style={{ zIndex: 2000, top: "100%", left: 0 }}
        >
          {matches.map((recipe) => (
            <li
              key={recipe.id}
              className="list-group-item list-group-item-action"
              onMouseDown={() => openRecipe(recipe.id)}
              style={{ cursor: "pointer" }}
            >
              {recipe.name}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

export default SearchBar;
