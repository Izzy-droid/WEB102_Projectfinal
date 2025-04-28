import './App.css';
import React from 'react';
import { Link } from 'react-router-dom';
import supabase from './client';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
const Gallery = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('Posts')
        .select('*', {head: false, count: 'exact'})
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching mobs:', error);
        setError(error);
      } else {
        console.log('Mobs fetched successfully:', data);
        setPosts(data);
      }
    };

    fetchPosts();
  }, []);
  
  
  console.log('Fetched posts:', posts); // Debugging the fetched data
  return (
    <>
      <div className='other-col'>
        <div className="gall-box">
          {error && <p>Error loading mobs: {error.message}</p>}
          
            {posts.map((post) => (
              <div key={post.id} className="gall-mini">
                <img className="create-img" src={post.image} alt={post.title} />
                <h3>{post.title}</h3>
                <p>{post.image}</p>
                <p>{post.desc}</p>
                <p>{post.created_at ? format(new Date(post.created_at), 'PPpp') : "none"}</p>
                
             </div>
            ))}
        
        </div>
      </div>
    </>
  );
}



export default Gallery;