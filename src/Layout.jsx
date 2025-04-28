import './App.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Layout({ children, posts = [], setFilteredPosts }) {
  const [searchTerm, setSearchTerm] = useState('');

  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      
      setFilteredPosts(posts);
    } else {
      // Filter posts based on the search term
      const filtered = posts.filter((post) =>
        post.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchTerm, posts, setFilteredPosts]); 
  return (
    <>
      <div className="cols-arrange">
        <div className="left-col">
          <div className="inner-arrange">
            <p className="text">
              <Link to="/">Home</Link>
            </p>
            <p className="text">
              <Link to="/create">Create a Post</Link>
            </p>
          </div>
          
        </div>

        <div className="other-col">
          <div className="title-container">
            <div className="title-textArrange">
              <p id="text-title">MangaHut</p>
            </div>

            
            
              <div id="search">
                <form onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="text"
                    placeholder="Search for a title..."
                    name="search"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    className="s-box"
                  />
                  <button className="s-button"type="submit">Search</button>
                </form>
              </div>
            
          </div>

          {children}
        </div>
      </div>
    </>
  );
}

export default Layout;