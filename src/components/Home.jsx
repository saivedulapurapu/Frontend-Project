import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgHome from "../assets/background_home.jpg";
import Logo from "../assets/LOGO.png";
import SearchBar from "./SearchBar";

function Home() {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const navigate = useNavigate();

  const featuredIds = [559, 3339, 5796, 4, 5, 2396, 2457, 76];

  useEffect(() => {
    fetch("http://localhost:3000/Recipes")
      .then((res) => res.json())
      .then((data) => {
        // ✅ Save all recipes for global SearchBar suggestions
        localStorage.setItem("allRecipes", JSON.stringify(data));

        // ✅ Pick featured recipes by id
        const filtered = featuredIds
          .map((id) => data.find((r) => Number(r.id) === Number(id)))
          .filter(Boolean);

        setFeaturedRecipes(filtered);
      })
      .catch(() => {
        setFeaturedRecipes([]);
      });
  }, []);

  return (
    <>
      {/* HEADER NAVBAR */}
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-danger fixed-top shadow-sm"
        style={{ zIndex: 3000 }}
      >
        <div className="container-fluid">
          <button
            className="btn text-white fs-3 me-2"
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebar"
          >
            <i className="bi bi-list"></i>
          </button>

          <img src={Logo} alt="Logo" style={{ height: "55px" }} className="me-2" />

          {/* Center Menu */}
          <div className="collapse navbar-collapse justify-content-center d-none d-lg-flex">
            <ul className="navbar-nav gap-4">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/recipes">Recipes</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/about">About Us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/login">Login</Link>
              </li>
            </ul>
          </div>

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
            <li><Link className="nav-link" to="/">Home</Link></li>
            <li><Link className="nav-link" to="/south">South Indian</Link></li>
            <li><Link className="nav-link" to="/north">North Indian</Link></li>
            <li><Link className="nav-link" to="/chinese">Chinese</Link></li>
            <li><Link className="nav-link" to="/western">Western</Link></li>
            <li><Link className="nav-link" to="/desserts">Desserts & Snacks</Link></li>
          </ul>
        </div>
      </div>

      {/* HERO SECTION */}
      <section
        className="vh-100 d-flex justify-content-center align-items-center text-center text-white position-relative"
        style={{
          background: `url(${bgHome}) center/cover no-repeat`,
        }}
      >
        <div
          className="position-absolute w-100 h-100"
          style={{ background: "rgba(0,0,0,0.50)" }}
        ></div>

        <h1 className="fw-bold display-3 position-relative hero-text-animated">
          Discover Authentic <br /> Indian Flavors
        </h1>
      </section>

      {/* FEATURED RECIPES */}
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-5">Featured Recipes</h2>

        <div className="row g-5 justify-content-center">
          {featuredRecipes.length ? (
            featuredRecipes.map((recipe) => (
              <div className="col-sm-8 col-lg-3" key={recipe.id}>
                <div className="card shadow recipe-card h-100 text-center border-0">
                  <img
                    src={recipe.image}
                    className="card-img-top"
                    alt={recipe.name}
                  />

                  <div className="card-body">
                    <h5 className="card-title">{recipe.name}</h5>

                    <button
                      className="btn btn-dark rounded-pill mt-2"
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
          ) : (
            <p className="text-center">Loading featured recipes...</p>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-black text-white py-4 text-center">
        <p className="mb-1">© 2025 Your Website. All Rights Reserved.</p>
        <p className="text-warning fst-italic">“A recipe for every mood.”</p>
      </footer>
    </>
  );
}

export default Home;
