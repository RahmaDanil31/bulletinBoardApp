import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [errorMessages, setErrorMessages] = useState({
    password: "",
  });

  useEffect(() => {
    fetch("http://localhost:8100/post")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        setFilteredPosts(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearch = (event) => {
    const keyword = event.target.value.toLowerCase();
    setSearchTerm(keyword);

    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(keyword)
    );
    setFilteredPosts(filtered);
  };

  const handleDelete = (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (isConfirmed) {
      setSelectedPostId(id);
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

    fetch(`http://localhost:8100/post/${selectedPostId}/validate-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message || "Password invalid");
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.valid) {
          deletePost(selectedPostId);
        } else {
          setErrorMessages((prevErrors) => ({
            ...prevErrors,
            password: "Invalid password!",
          }));
        }
      })
      .catch((error) => {
        alert(`${error.message}`);
      });
  };

  const deletePost = (id) => {
    fetch(
      `http://localhost:8100/post/${id}?password=${encodeURIComponent(
        password
      )}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message || "Failed to delete post");
          });
        }

        if (response.status === 204) {
          return null;
        }

        return response.json();
      })
      .then(() => {
        setPosts(posts.filter((post) => post.id !== id));
        setFilteredPosts(filteredPosts.filter((post) => post.id !== id));
        setIsModalOpen(false);
        alert("Post deleted successfully!");
      })
      .catch((error) => {
        alert(`Error deleting post: ${error.message}`);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">
          Bulletin Board
        </h1>
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-4 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by title..."
          />
        </div>

        <div className="text-right mb-6">
          <Link to="/create-post">
            <button className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg">
              Create Post
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <div
              key={post.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 hover:translate-y-2"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="bg-blue-500 text-white rounded-full px-4 py-2">
                  {index + 1}
                </span>
                <span className="text-gray-600 text-sm">
                  {new Date(post.createdDate).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 truncate">
                {post.title}
              </h3>
              <div className="mt-4">
                <span className="text-sm text-gray-500">
                  By {post.authorName}
                </span>
              </div>
              <div className="flex justify-between items-center mt-6">
                <Link to={`/post-detail/${post.id}`}>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm">
                    Read More
                  </button>
                </Link>
                <Link to={`/post-update/${post.id}`}>
                  <button className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-full text-sm"
                >
                  Delete
                </button>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">
                    👁 {post.viewers}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Enter Password to Delete Post
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

export default Home;
