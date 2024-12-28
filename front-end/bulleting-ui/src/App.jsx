import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import FormCreatePost from "./components/FormCreatePost";
import PostDetail from "./Components/PostDetail";
import FormUpdatePost from "./Components/FormUpdatedPost";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-post" element={<FormCreatePost />} />
        <Route path="/post-detail/:id" element={<PostDetail />} />
        <Route path="/post-update/:id" element={<FormUpdatePost />} />
      </Routes>
    </Router>
  );
}

export default App;
