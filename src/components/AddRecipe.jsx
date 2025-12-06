// AddRecipe.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Add.css"; // your theme overrides

export default function AddRecipe() {
  const [form, setForm] = useState({
    name: "",
    image: "",
    category: "",
    ingredients: "",
    steps: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const categories = [
    "South Indian",
    "North Indian",
    "Chinese",
    "Western",
    "Desserts",
  ];

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Please enter a recipe name");

    const payload = {
      name: form.name.trim(),
      image: form.image.trim() || "https://via.placeholder.com/600x400",
      category: form.category.trim() || "Uncategorized",
      ingredients: form.ingredients
        .split(/\r?\n|,/)
        .map((s) => s.trim())
        .filter(Boolean),
      steps: form.steps
        .split(/\r?\n|,/)
        .map((s) => s.trim())
        .filter(Boolean),
    };

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/Recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Network error");

      const created = await res.json();

      // sync search storage
      try {
        const all = JSON.parse(localStorage.getItem("allRecipes") || "[]");
        all.unshift(created);
        localStorage.setItem("allRecipes", JSON.stringify(all));
      } catch {}

      navigate(`/recipes?refresh=${Date.now()}`);
    } catch (err) {
      setError("Could not add recipe. Check your server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-recipe-wrapper">
      <div className="card shadow-lg border-0">
        <div className="card-body p-4 p-md-5">

          <h2 className="add-recipe-title mb-4 text-center">
            <i className="bi bi-plus-circle me-2"></i>Add New Recipe
          </h2>

          {error && <div className="error-box mb-3">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-danger">Recipe Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. Masala Dosa"
                required
              />
            </div>

            {/* Image + Category */}
            <div className="row g-3">
              <div className="col-md-7">
                <label className="form-label fw-semibold text-danger">Image URL</label>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="https://example.com/img.jpg"
                />
              </div>

              <div className="col-md-5">
                <label className="form-label fw-semibold text-danger">Category</label>
                <select
                  name="category"
                  className="form-select rounded-pill"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mt-3">
              <label className="form-label fw-semibold text-danger">Ingredients</label>
              <textarea
                name="ingredients"
                rows="4"
                value={form.ingredients}
                onChange={handleChange}
                className="form-control"
                placeholder="One item per line"
              ></textarea>
            </div>

            {/* Steps */}
            <div className="mt-3">
              <label className="form-label fw-semibold text-danger">Steps</label>
              <textarea
                name="steps"
                rows="5"
                value={form.steps}
                onChange={handleChange}
                className="form-control"
                placeholder="Step-by-step instructions"
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button className="btn btn-add shadow-sm" type="submit" disabled={loading}>
                {loading ? "Adding…" : "Add Recipe"}
              </button>

              <button
                className="btn btn-outline-secondary btn-cancel"
                type="button"
                onClick={() => navigate("/recipes")}
              >
                Cancel
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
