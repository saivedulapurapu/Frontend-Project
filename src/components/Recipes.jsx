import React, { useEffect, useState } from "react";
import Logo from "../assets/LOGO.png";
import BgImage from "../assets/recipe_bg.jpg";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

function RecipeDetails() {
  const [recipe, setRecipe] = useState(null);

  const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    sidebar?.classList.toggle("active");
    overlay?.classList.toggle("active");
  };

  const esc = (s) => String(s || "");

  useEffect(() => {
    fetch("http://localhost:3000/Recipes")
      .then((res) => res.json())
      .then((data) => {
        const id = localStorage.getItem("recipeId");
        const found = data.find((r) => String(r.id) === id);
        setRecipe(found || null);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!recipe) {
    return (
      <main className="container text-center mt-5">
        <p>Recipe not found.</p>
      </main>
    );
  }

  const ingredientsText = (recipe.ingredients || [])
    .map((i) => esc(i).trim())
    .join(", ");

  const stepsArr = (recipe.steps || []).map((step) => {
    return esc(step).trim().replace(/[.?!;:]+$/g, "") + ".";
  });

  return (
    <>
      {/* BACKGROUND WITH BLUR */}
      <style>
        {`
          body {
            background-image: url(${BgImage});
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            background-repeat: no-repeat;
          }

          .bg-blur-layer::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            backdrop-filter: blur(6px) brightness(0.5);
            z-index: -1;
          }
        `}
      </style>

      <div className="bg-blur-layer">
        {/* NAVBAR */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-danger fixed-top shadow-sm">
          <div className="container-fluid">
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

            <span className="position-absolute top-50 start-50 translate-middle text-white fw-bold fs-5">
              Recipe Details
            </span>

            {/* 🔍 Global SearchBar with suggestions */}
            <SearchBar />
          </div>
        </nav>

        {/* SIDEBAR */}
        <div className="offcanvas offcanvas-start" id="sidebar">
          <div className="offcanvas-header bg-danger text-white">
            <h5>Menu</h5>
            <button className="btn-close" data-bs-dismiss="offcanvas"></button>
          </div>

          <div className="offcanvas-body">
            <ul className="navbar-nav">
              <li>
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/south" className="nav-link">
                  South Indian
                </Link>
              </li>
              <li>
                <Link to="/north" className="nav-link">
                  North Indian
                </Link>
              </li>
              <li>
                <Link to="/chinese" className="nav-link">
                  Chinese
                </Link>
              </li>
              <li>
                <Link to="/western" className="nav-link">
                  Western
                </Link>
              </li>
              <li>
                <Link to="/desserts" className="nav-link">
                  Desserts & Snacks
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div id="overlay" onClick={toggleSidebar}></div>

        {/* MAIN CONTENT */}
        <main
          className="container d-flex justify-content-center"
          style={{ marginTop: "130px" }}
        >
          <div
            className="card shadow-lg p-4 border-0"
            style={{
              borderRadius: "25px",
              maxWidth: "900px",
              width: "100%",
              background: "white",
            }}
          >
            <div className="text-center mb-4">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="img-fluid rounded shadow w-100"
                style={{
                  height: "350px",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "15px",
                }}
              />
              <h1 className="mt-3 fw-bold text-danger text-center">
                {recipe.name}
              </h1>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-danger">Ingredients</h3>
              <p className="fs-5 text-secondary">{ingredientsText}</p>
            </div>

            <div>
              <h3 className="fw-bold text-danger">Steps</h3>
              <ol className="fs-5 text-secondary">
                {stepsArr.map((step, index) => (
                  <li key={index} className="mb-2">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </main>

        {/* FOOTER */}
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
            <a href="mailto:spicestories@gmail.com">
              <i className="fas fa-envelope"></i>
            </a>
          </div>

          <p className="text-warning fst-italic mb-0">
            “A recipe for every mood.”
          </p>
        </footer>
      </div>
    </>
  );
}

export default RecipeDetails;
