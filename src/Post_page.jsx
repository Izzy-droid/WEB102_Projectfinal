import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "./client";
import "./App.css";

function PostPage() {
  const { postId } = useParams(); // Get the postId from the URL
  const [post, setPost] = useState(null); // State to store the post data
  const [error, setError] = useState(null); // State to handle errors
  const [likes, setLikes] = useState(0); // State to handle likes locally

  useEffect(() => {
    console.log("postId from URL:", postId); // Debugging: Log postId
    if (!postId || isNaN(postId)) {
      setError("Invalid post ID");
      return;
    }

    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from("Posts") // Replace "Posts" with your table name
          .select("*")
          .eq("id", postId) // Ensure postId is passed correctly
          .single(); // Fetch a single post by ID

        if (error) {
          setError("Error fetching post");
          console.error(error);
        } else {
          setPost(data); // Set the fetched post data
          setLikes(data.likes || 0); // Initialize likes from the fetched post
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Unexpected error occurred");
      }
    };
    fetchPost();
  }, [postId]);

  const handleLikes = async () => {
    if (!postId) {
      console.error("Invalid post ID for likes update");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("Posts")
        .update({ likes: likes + 1 }) // Increment likes in the database
        .eq("id", postId);

      if (error) {
        console.error("Error updating likes:", error);
        return;
      }

      console.log("Likes updated successfully:", data);
      setLikes((prevLikes) => prevLikes + 1); // Update local likes state
    } catch (err) {
      console.error("Unexpected error updating likes:", err);
    }
  };

  if (error) {
    return <p>{error}</p>; // Display error message if there's an error
  }

  if (!post) {
    return <p>Loading...</p>; // Display a loading message while fetching data
  }

  return (
    <div className="ppage-container">
      <div className="ppage-arrange">
        <h1>{post.title}</h1>
        <img src={post.image || "./blank_img.png"} alt={post.title} />
        <h2>Content</h2>
        <p>{post.desc}</p>
        <p id="post-likes">Likes: {likes}</p>
        <img
          onClick={handleLikes}
          id="thumbs"
          src="./thumbs_up.jpg"
          alt="thumbs up"
        />
        <div id="comment-container">
          <form>
            <input
              id="comment"
              className="comment-box"
              type="text"
              name="comment"
              placeholder="Comment..."
              readOnly
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostPage;