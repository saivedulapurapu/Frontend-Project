import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/LOGO.png";
import SearchBar from "./SearchBar";

function Western() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    sidebar?.classList.toggle("active");
    overlay?.classList.toggle("active");
  };

  useEffect(() => {
    fetch("http://localhost:3000/Recipes")
      .then((res) => res.json())
      .then((data) => {
        const result = data.filter(
          (r) => r.category?.trim().toLowerCase() === "western"
        );
        setRecipes(result);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      {/* Bootstrap Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger fixed-top shadow-sm">
        <div className="container-fluid">
          {/* Sidebar button */}
          <button
            className="btn text-white fs-3 me-2"
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebar"
          >
            <i className="bi bi-list"></i>
          </button>

          <img
            src={Logo}
            alt="Logo"
            style={{ height: "55px" }}
            className="me-2"
          />

          {/* Center heading */}
          <span className="position-absolute top-50 start-50 translate-middle text-white fw-bold fs-5">
            Western Recipes
          </span>

          {/* 🔍 Global Search Bar with suggestions */}
          <SearchBar />
        </div>
      </nav>

      {/* Sidebar Offcanvas */}
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

      {/* Main Content */}
      <main className="container py-5" style={{ marginTop: "100px" }}>
        <h2 className="text-center fw-bold mb-4">Western Recipes</h2>

        <div className="row g-5 justify-content-center">
          {recipes.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>
              No Western recipes found.
            </p>
          ) : (
            recipes.map((recipe) => (
              <div className="col-sm-8 col-lg-3" key={recipe.id}>
                <div className="card shadow recipe-card h-100 text-center border-0">
                  <img
                    src={recipe.image}
                    className="card-img-top"
                    alt={recipe.name}
                  />

                  <div className="card-body">
                    <h3 className="card-title">{recipe.name}</h3>

                    <button
                      className="btn btn-dark rounded-pill mt-3"
                      onClick={() => {
                        localStorage.setItem("recipeId", recipe.id);
                        navigate("/details");
                      }}
                    >
                      View Recipe
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-4 text-center mt-5">
        <p className="mb-1">© 2025 Spice Stories. All Rights Reserved.</p>

        <div className="footer-social">
          <a href="#">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="mailto:yourmail@example.com">
            <i className="fas fa-envelope"></i>
          </a>
        </div>

        <p className="text-warning fst-italic">“A recipe for every mood.”</p>
      </footer>

      {/* FontAwesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
    </>
  );
}

export default Western;
