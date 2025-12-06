import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Logo from "../assets/LOGO.png";

function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  // Load recipe by ID
  useEffect(() => {
    let mounted = true;
    fetch(`http://localhost:3000/Recipes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((recipe) => {
        if (!mounted) return;
        setData(recipe);
        setPreview(recipe.image || "");
      })
      .catch((err) => {
        console.error("Failed to load recipe:", err);
        // optionally navigate back or show error UI
      });
    return () => { mounted = false; };
  }, [id]);

  // Sidebar toggle
  const toggleSidebar = () => {
    document.getElementById("sidebar")?.classList.toggle("active");
    document.getElementById("overlay")?.classList.toggle("active");
  };

  // Handle inputs (works for strings)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload → Base64
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setData((prev) => ({ ...prev, image: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Utility to normalize ingredients/steps to arrays
  const toArray = (value, splitOn = /[\r\n,]+/) => {
    if (Array.isArray(value)) return value.map((s) => String(s).trim()).filter(Boolean);
    if (!value && value !== 0) return [];
    return String(value)
      .split(splitOn)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  // Save updated recipe
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);

    try {
      // Ensure we transform ingredients/steps to arrays regardless of current shape
      const updated = {
        ...data,
        ingredients: toArray(data.ingredients, /[\r\n,]+/),
        steps: toArray(data.steps, /[\r\n.]+/), // allow sentences separated by newlines or periods
      };

      // Ensure id is numeric if server expects numbers (json-server auto uses numeric ids)
      if (updated.id && typeof updated.id === "string" && /^\d+$/.test(updated.id)) {
        updated.id = Number(updated.id);
      }

      const res = await fetch(`http://localhost:3000/Recipes/${id}`, {
        method: "PUT", // full replace; use PATCH if you want partial updates
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Save failed: ${res.status} ${text}`);
      }

      const saved = await res.json();

      // Update localStorage copy so SearchBar and other pages see the change immediately
      try {
        const all = JSON.parse(localStorage.getItem("allRecipes") || "[]");
        const idx = all.findIndex((r) => String(r.id) === String(saved.id));
        if (idx >= 0) {
          all[idx] = saved;
        } else {
          all.unshift(saved); // if not present, add to front
        }
        localStorage.setItem("allRecipes", JSON.stringify(all));
      } catch (err) {
        console.warn("Could not sync localStorage:", err);
      }

      // Navigate back to recipe list and force refresh via query param
      navigate(`/recipes?refresh=${Date.now()}`);
    } catch (err) {
      console.error("Error updating recipe:", err);
      alert("Failed to update recipe. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  if (!data) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      {/* HEADER */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger fixed-top shadow-sm">
        <div className="container-fluid">
          <button className="btn text-white fs-3 me-2" onClick={toggleSidebar}>
            <i className="bi bi-list"></i>
          </button>

          <img src={Logo} alt="Logo" style={{ height: "55px" }} />
          <span className="text-white fw-bold fs-4 mx-auto">Edit Recipe</span>
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
            <li><Link className="nav-link" to="/recipes">Recipes</Link></li>
            <li><Link className="nav-link" to="/south">South Indian</Link></li>
            <li><Link className="nav-link" to="/north">North Indian</Link></li>
            <li><Link className="nav-link" to="/chinese">Chinese</Link></li>
            <li><Link className="nav-link" to="/western">Western</Link></li>
            <li><Link className="nav-link" to="/desserts">Desserts & Snacks</Link></li>
          </ul>
        </div>
      </div>

      <div id="overlay" onClick={toggleSidebar}></div>

      {/* FORM */}
      <div className="container" style={{ marginTop: "130px", maxWidth: "700px" }}>
        <div className="shadow p-4 rounded bg-white">
          <h3 className="fw-bold mb-4 text-center">Update Recipe</h3>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <input
              className="form-control mb-3 rounded-pill"
              name="name"
              value={data.name || ""}
              onChange={handleChange}
              required
            />

            {/* Category */}
            <select
              className="form-select mb-3 rounded-pill"
              name="category"
              value={data.category || ""}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="South Indian">South Indian</option>
              <option value="North Indian">North Indian</option>
              <option value="Chinese">Chinese</option>
              <option value="Western">Western</option>
              <option value="Desserts">Desserts & Snacks</option>
            </select>

            {/* URL Input */}
            <input
              className="form-control mb-3 rounded-pill"
              name="image"
              value={data.image || ""}
              placeholder="Image URL"
              onChange={handleChange}
            />

            {/* File Upload */}
            <label className="fw-bold">Upload New Image:</label>
            <input
              type="file"
              accept="image/*"
              className="form-control mb-3"
              ref={fileRef}
              onChange={handleImageUpload}
            />

            {/* Preview */}
            {preview && (
              <div className="text-center mb-3">
                <img
                  src={preview}
                  alt="preview"
                  style={{
                    width: "180px",
                    height: "180px",
                    borderRadius: "10px",
                    objectFit: "cover",
                    border: "2px solid #ccc",
                  }}
                />
              </div>
            )}

            {/* Ingredients */}
            <textarea
              className="form-control mb-3"
              name="ingredients"
              rows="3"
              value={Array.isArray(data.ingredients) ? data.ingredients.join(", ") : data.ingredients || ""}
              onChange={handleChange}
              required
            ></textarea>

            {/* Steps */}
            <textarea
              className="form-control mb-4"
              name="steps"
              rows="4"
              value={Array.isArray(data.steps) ? data.steps.join(". ") : data.steps || ""}
              onChange={handleChange}
              required
            ></textarea>

            <button className="btn btn-warning w-100 rounded-pill fs-5" disabled={saving}>
              {saving ? "Saving..." : "Update Recipe"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditRecipe;
