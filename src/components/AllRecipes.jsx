import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/LOGO.png";
import SearchBar from "./SearchBar";

function AllRecipes() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // reusable fetch function
  const fetchRecipes = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3000/Recipes");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRecipes(data);
      // keep localStorage allRecipes in sync
      localStorage.setItem("allRecipes", JSON.stringify(data));
    } catch (err) {
      console.error("Failed to load recipes:", err);
    }
  }, []);

  // fetch on mount and whenever location changes (so navigating back to /recipes triggers a reload)
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes, location.key, location.search]);

  // listen for other tabs or AddRecipe setting a flag in localStorage
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "recipesUpdated") {
        // a timestamp is stored by AddRecipe (see instructions). Re-fetch.
        fetchRecipes();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [fetchRecipes]);

  // Delete recipe
  const deleteRecipe = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/Recipes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      // optimistic UI update
      setRecipes((prev) => {
        const updated = prev.filter((r) => r.id !== id);
        localStorage.setItem("allRecipes", JSON.stringify(updated));
        return updated;
      });
      // let other listeners know
      localStorage.setItem("recipesUpdated", Date.now());
    } catch (err) {
      console.error("Delete error:", err);
      alert("Could not delete recipe. Check server.");
    }
  };

  // Sidebar toggle
  const toggleSidebar = () => {
    document.getElementById("sidebar")?.classList.toggle("active");
    document.getElementById("overlay")?.classList.toggle("active");
  };

  return (
    <>
      {/* HEADER / NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger fixed-top shadow-sm">
        <div className="container-fluid">
          <button className="btn text-white fs-3 me-2" onClick={toggleSidebar}>
            <i className="bi bi-list"></i>
          </button>

          <img src={Logo} alt="Logo" style={{ height: "55px" }} className="me-2" />

          <div className="collapse navbar-collapse justify-content-center d-none d-lg-flex">
            <ul className="navbar-nav gap-4">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/recipes">Recipes</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About Us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            </ul>
          </div>

          {/* Global SearchBar */}
          <SearchBar />
        </div>
      </nav>

      {/* SIDEBAR */}
      <div className="offcanvas offcanvas-start" id="sidebar">
        <div className="offcanvas-header bg-danger text-white">
          <h5>Menu</h5>
          <button type="button" className="btn-close" onClick={toggleSidebar}></button>
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
      <div id="overlay" onClick={toggleSidebar}></div>

      {/* MAIN CONTENT */}
      <div className="container py-5" style={{ marginTop: "100px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">All Recipes</h2>

          <button
            className="btn btn-success rounded-pill px-4"
            onClick={() => navigate("/recipes/add")}
          >
            <i className="bi bi-plus-lg me-2"></i>Add Recipe
          </button>
        </div>

        <div className="row g-4 justify-content-center">
          {recipes.map((recipe) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={recipe.id}>
              <div className="recipe-card shadow-sm">
                <img src={recipe.image} className="recipe-card-img" alt={recipe.name} />
                <h5 className="recipe-title">{recipe.name}</h5>

                <div className="recipe-btn-group">
                  <button
                    className="action-btn btn-view"
                    onClick={() => {
                      localStorage.setItem("recipeId", recipe.id);
                      navigate("/details");
                    }}
                  >
                    <i className="bi bi-eye"></i> View
                  </button>

                  <button
                    className="action-btn btn-edit"
                    onClick={() => navigate(`/recipes/edit/${recipe.id}`)}
                  >
                    <i className="bi bi-pencil"></i> Edit
                  </button>

                  <button
                    className="action-btn btn-delete"
                    onClick={() => {
                      if (window.confirm("Delete this recipe?")) deleteRecipe(recipe.id);
                    }}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {recipes.length === 0 && (
            <p className="text-center text-secondary fs-5">No recipes found.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default AllRecipes;
