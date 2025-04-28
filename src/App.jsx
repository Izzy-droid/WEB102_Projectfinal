import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Layout from './Layout';
import Createpage from './Createpage';
import Postpage from './Post_page';
import supabase from './client';
import { useEffect, useState } from 'react';
import {formatDistanceToNow} from 'date-fns';

function App() {
  const [postys, setPostys] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [Likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const filterPosts = postys.filter((posts) =>
    posts.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLikes = async (postId) => {
    try {
      // Find the specific post
      const currentPost = postys.find((post) => post.id === postId);
      if (!currentPost) {
        console.error("Post not found");
        return;
      }
  
      const currentLikes = currentPost.likes || 0;
  
      // Update the likes in the database
      const { data, error } = await supabase
        .from("Posts")
        .update({ likes: currentLikes + 1 })
        .eq("id", postId);
  
      if (error) {
        console.error("Error updating likes:", error);
        return;
      }
  
      console.log("Likes updated successfully in Supabase:", data);
  
      // Update the local state for the specific post
      setPostys((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: currentLikes + 1 } : post
        )
      );
  
      // Update the filteredPosts state as well
      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId ? { ...post, likes: currentLikes + 1 } : post
        )
      );
    } catch (err) {
      console.error("Unexpected error updating likes:", err);
    }
  };
  const handleComment = async (postId, comment) => {
    try {
      // Find the specific post
      const currentPost = postys.find((post) => post.id === postId);
      if (!currentPost) {
        console.error("Post not found");
        return;
      }
  
      const currentComments = currentPost.comments || [];
  
      // Update the comments in the database
      const { data, error } = await supabase
        .from("Posts")
        .update({ comments: [...currentComments, comment] })
        .eq("id", postId);
  
      if (error) {
        console.error("Error updating comments:", error);
        return;
      }
  
      console.log("Comments updated successfully in Supabase:", data);
  
      // Update the local state for the specific post
      setPostys((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...currentComments, comment] }
            : post
        )
      );
  
      // Update the filteredPosts state as well
      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...currentComments, comment] }
            : post
        )
      );
    } catch (err) {
      console.error("Unexpected error updating comments:", err);
    }
  };
  const sortByNewest = () => {
    const sortedPosts = [...postys].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setFilteredPosts(sortedPosts); // Update the filteredPosts state with the sorted posts
  };

  const sortByMostLikes = () => {
    const sortedPosts = [...postys].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    setFilteredPosts(sortedPosts); // Update the filteredPosts state with the sorted posts
  };

  


  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('Posts')
        .select('*');
  
      if (error) {
        console.error('Error fetching posts:', error);
        setError(error);
      } else {
        console.log('Posts fetched successfully:', data);
  
        // Ensure comments are arrays
        const postsWithComments = data.map((post) => ({
          ...post,
          comments: typeof post.comments === 'string' ? JSON.parse(post.comments) : post.comments || [],
        }));
  
        setPostys(postsWithComments);
        setFilteredPosts(postsWithComments);
      }
    };
  
    fetchPosts();
  }, []);
  return (
    <>
      <Routes>
        {/* Home Route */}
        <Route
          path="/"
          element={
            <Layout
  posts={postys}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  setFilteredPosts={setFilteredPosts}
>
  <>
    <div id="home-other">
      <div className="inner-box">
        <div className="posts-container">
          <div className="filter_postsButtons">
            <button onClick={sortByNewest} className="filt-buttons">By Newest</button>
            <button onClick={sortByMostLikes} className="filt-buttons">By Most likes</button>
          </div>
          <div className="gall-arrange">
            {filteredPosts.map((post) => (
              <div className="gall-mini" key={post.id}>
                <div className="post-date">
                  {post.created_at
                    ? formatDistanceToNow(new Date(post.created_at)) + " ago"
                    : "none"}
                </div>
                <div className="post-img">
                  <Link to={`/postpage`}>
                    <img
                      className="create-img"
                      src={post.image || "/blank_img.png"}
                      alt={post.title}
                    />
                  </Link>
                </div>
                <h3>{post.title}</h3>
                <p>{post.desc}</p>
                <div className="bottom-post">
                  <p id="post-likes">{post.likes || 0}</p>
                  <img
                    onClick={() => handleLikes(post.id)}
                    id="thumbs"
                    src="./thumbs_up.jpg"
                    alt="thumbs up"
                  />
                  <div id="comment-container">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleComment(post.id, newComment);
                        setNewComment(""); // Clear the input field after submission
                      }}
                    >
                      <input
                        className="comment-box"
                        type="text"
                        name="comment"
                        placeholder="Comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <button id="comment-btn"type="submit">Submit</button>
                    </form>
                  </div>
                  </div>
                  <div className="comments-section">
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map((comment, index) => (
                        <div key={index} className="comment">
                          <p>{comment}</p>
                        </div>
                      ))
                    ) : (
                      <p>No comments yet.</p>
                    )}
                  </div>
                </div>
              
            ))}
          </div>
        </div>
      </div>
    </div>
  </>
</Layout>
          }
        />

       
        <Route
          path="/create"
          element={
            <Layout posts={postys}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setFilteredPosts={setFilteredPosts}>
              <Createpage />
            </Layout>
          }
        />
        <Route
        path="/postpage"
        element={
          <Layout>
            <Postpage />
          </Layout>
        }
        
        />
      </Routes>
    </>
  );
}

export default App;