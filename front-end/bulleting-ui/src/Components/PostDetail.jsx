import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8100/post/${id}?isUpdated=false`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch post data");
        }
        return response.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );

  return (
    <div className="w-full h-full min-h-screen bg-gray-100">
      <div className="absolute inset-0 bg-white shadow-xl overflow-hidden">
        <div className="bg-blue-500 text-white p-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-base font-medium hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Posts
          </button>
        </div>
        <div className="p-10 h-[calc(100%-12rem)] overflow-y-auto">
          <h1 className="text-5xl font-bold mb-6 text-gray-800">
            {post.title}
          </h1>
          <p className="text-base text-gray-500 mb-8">
            by{" "}
            <span className="font-medium text-gray-600">{post.authorName}</span>{" "}
            |Updated: <span>{new Date(post.updatedDate).toLocaleString()}</span>
          </p>
          <div className="text-gray-700 text-xl leading-relaxed mb-8">
            {post.content}
          </div>
        </div>
        <div className="bg-gray-50 p-6 flex justify-between text-base text-gray-500 absolute bottom-0 w-full">
          <p>
            Viewers: <span className="font-medium">{post.viewers}</span>
          </p>
          <p>
            Created:{" "}
            <span className="font-medium">
              {new Date(post.createdDate).toLocaleDateString()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
