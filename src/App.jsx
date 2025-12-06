import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import North from "./components/North.jsx";
import South from "./components/South.jsx"
import Desserts from "./components/Desserts.jsx";
import Chinese from './components/Chinese.jsx';
import Western from "./components/Western.jsx";
import Search from "./components/Search.jsx"
import Recipe from "./components/Recipes.jsx"
import AllRecipes from "./components/AllRecipes.jsx";
import AddRecipe from "./components/AddRecipe.jsx";
import EditRecipe from "./components/EditRecipe.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import "./App.css";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/north" element={<North />} />
      <Route path="/south" element={<South />} />
      <Route path="/Desserts" element={<Desserts />} />
      <Route path="/chinese" element={<Chinese />} />
      <Route path="/western" element={<Western />} />
      <Route path="/search" element={<Search />}/>
      <Route path="/recipes/:id" element={<Recipe />} />
      <Route path="/details" element={<Recipe />} />
      <Route path="/recipes" element={<AllRecipes />} />
      <Route path="/recipes/add" element={<AddRecipe />} />
      <Route path="/recipes/edit/:id" element={<EditRecipe />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
