// Search.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/LOGO.png";
import SearchBar from "./SearchBar";

export default function SearchResults() {
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Read search query
  const params = new URLSearchParams(location.search);
  const q = (params.get("q") || params.get("query") || "").trim().toLowerCase();

  useEffect(() => {
    let cancelled = false;

    const doSearch = async () => {
      if (!q) {
        setFiltered([]);
        return;
      }

      setLoading(true);

      try {
        const res = await fetch("http://localhost:3000/Recipes");
        const all = await res.json();
        if (cancelled) return;

        const words = q.split(" ").filter(Boolean);

        const result = all.filter((r) => {
          const name = r.name.toLowerCase();
          return words.every((w) => name.includes(w));
        });

        setFiltered(result);

        localStorage.setItem("allRecipes", JSON.stringify(all));
      } catch (err) {
        console.error("Search error:", err);
        if (!cancelled) setFiltered([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    doSearch();
    return () => (cancelled = true);
  }, [q, location.search]);

  const openRecipe = (id) => {
    localStorage.setItem("recipeId", id);
    navigate("/details");
  };

  // Custom Sidebar Toggle (works on all pages)
  const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    sidebar?.classList.toggle("active");
    overlay?.classList.toggle("active");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger fixed-top shadow-sm">
        <div className="container-fluid">
          <button className="btn text-white fs-3 me-2" onClick={toggleSidebar}>
            <i className="bi bi-list"></i>
          </button>

          <img src={Logo} alt="Logo" style={{ height: 55 }} className="me-2" />

          <span className="position-absolute top-50 start-50 translate-middle text-white fw-bold fs-5">
            Search Results
          </span>

          <div className="ms-auto">
            <SearchBar initialQuery={q} />
          </div>
        </div>
      </nav>

      {/* SIDEBAR (Custom, Not Bootstrap Offcanvas) */}
      <div className="offcanvas offcanvas-start" id="sidebar">
              <div className="offcanvas-header bg-danger text-white">
                <h5>Menu</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                ></button>
              </div>
              <div className="offcanvas-body">
                <ul className="navbar-nav">
                  <li>
                    <Link
                      to="/"
                      className={`nav-link ${
                        location.pathname === "/" ? "active" : ""
                      }`}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/south"
                      className={`nav-link ${
                        location.pathname === "/south" ? "active" : ""
                      }`}
                    >
                      South Indian
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/north"
                      className={`nav-link ${
                        location.pathname === "/north" ? "active" : ""
                      }`}
                    >
                      North Indian
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/chinese"
                      className={`nav-link ${
                        location.pathname === "/chinese" ? "active" : ""
                      }`}
                    >
                      Chinese
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/western"
                      className={`nav-link ${
                        location.pathname === "/western" ? "active" : ""
                      }`}
                    >
                      Western
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/desserts"
                      className={`nav-link ${
                        location.pathname === "/desserts" ? "active" : ""
                      }`}
                    >
                      Desserts &amp; Snacks
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
        <div id="overlay" onClick={toggleSidebar}></div>

      {/* MAIN CONTENT */}
      <main className="container" style={{ marginTop: "120px" }}>
        <h2 className="fw-bold text-center mb-4">
          Search Results {q && <>for “{q}”</>}
        </h2>

        {loading && (
          <div className="text-center">
            <div className="spinner-border text-light" />
            <p className="text-muted mt-2">Searching…</p>
          </div>
        )}

        <div className="row g-4 justify-content-center">
          {!loading && filtered.length === 0 && q && (
            <p className="text-center text-secondary fs-5">No results found.</p>
          )}

          {filtered.map((recipe) => (
            <div className="col-sm-8 col-md-6 col-lg-3" key={recipe.id}>
              <div className="card shadow-sm h-100 border-0 text-center">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="card-img-top"
                  style={{ height: 200, objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{recipe.name}</h5>
                  <p className="small text-muted">{recipe.category}</p>
                  <button
                    className="btn btn-dark rounded-pill mt-auto"
                    onClick={() => openRecipe(recipe.id)}
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
