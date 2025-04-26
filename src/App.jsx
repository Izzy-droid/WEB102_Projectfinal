import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Layout from './Layout';
import Createpage from './Createpage';
import Dashboard from './Dashboard';
import supabase from './client';
import { useEffect, useState } from 'react';

function App() {
  const posts = [
    
    {
      id: 2,
      image: './Goku.png',
      title: 'Who can beat Goku?',
      desc: 'Is he really the strongest?',
    },
    {
      id: 3,
      image: './post3.jpg',
      title: 'My review of A Terrified Teacher at Ghoul School',
      desc: "So it's been...",
    },
  ];
  const [postys, setPostys] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('Posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching mobs:', error);
        setError(error);
      } else {
        console.log('Mobs fetched successfully:', data);
        setPostys(data);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <div id="home-other">
                <div className="inner-box">
                  <div className="inner-box-title">
                    <h1>Welcome to the MangaHut</h1>
                    <p>Check out the latest posts below!</p>
                  </div>

                  <div className="posts-container">
                    {postys.map((post) => (
                      <div key={post.id} className="gall-mini">
                        <img className="create-img" src={post.image} alt={post.title} />
                        <h3>{post.title}</h3>
                        <p>{post.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Layout>
          }
        />
        <Route
          path="/create/"
          element={
            <Layout>
              <Createpage />
            </Layout>
          }
        />
        
      </Routes>
    </>
  );
}

export default App;