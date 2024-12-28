import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function FormCreatePost() {
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState({
    title: "",
    authorName: "",
    content: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    authorName: "",
    title: "",
    content: "",
    password: "",
  });

  const handleSubmit = () => {
    const errors = {};
    if (!newPost.authorName.trim()) {
      errors.authorName = "Author name cannot be empty!";
    }
    if (!newPost.title.trim()) {
      errors.title = "Title cannot be empty!";
    }
    if (!newPost.content.trim()) {
      errors.content = "Content cannot be empty!";
    }
    setErrorMessages(errors);

    if (Object.keys(errors).length === 0) {
      setIsModalOpen(true);
    }
  };

  const handlePasswordSubmit = () => {
    if (!password.trim()) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        password: "Password cannot be empty!",
      }));
      return;
    }

    const postData = {
      ...newPost,
      password,
    };

    fetch("http://localhost:8100/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message || "Failed to create post");
          });
        }
        return response.json();
      })
      .then((data) => {
        navigate("/");
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });

    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
      <div className="max-w-4xl w-full px-6 py-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Create a New Post
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Author Name <span className="text-red-500">*</span>
            </label>
            {errorMessages.authorName && (
              <p className="text-red-500 text-sm mb-4">
                {errorMessages.authorName}
              </p>
            )}
            <input
              type="text"
              value={newPost.authorName}
              onChange={(e) => {
                const value = e.target.value;
                const isKorean = /[\u3131-\uD79D]/.test(value);
                const maxLength = isKorean ? 50 : 100;
                if (value.length <= maxLength) {
                  setNewPost({ ...newPost, authorName: value });
                }
              }}
              className="w-full p-4 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter author's name"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            {errorMessages.title && (
              <p className="text-red-500 text-sm mb-4">{errorMessages.title}</p>
            )}
            <input
              type="text"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              className="w-full p-4 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">
              Content <span className="text-red-500">*</span>
            </label>
            {errorMessages.content && (
              <p className="text-red-500 text-sm mb-4">
                {errorMessages.content}
              </p>
            )}
            <textarea
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              className="w-full p-4 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your content here..."
              rows="6"
            />
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => navigate("/")}
              className="bg-gray-500 text-white px-6 py-2 rounded-full text-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-6 py-2 rounded-full text-lg"
            >
              Create Post
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Enter Password to Create Post
            </h2>
            {errorMessages.password && (
              <p className="text-red-500 text-sm mb-4">
                {errorMessages.password}
              </p>
            )}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-full text-lg"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="bg-blue-500 text-white px-6 py-2 rounded-full text-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormCreatePost;
