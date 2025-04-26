import './App.css';
import React from 'react';
import { Link } from 'react-router-dom';
import supabase from './client';
import { useState, useEffect } from 'react';

const Gallery = () => {
  const [mobs, setMobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMobs = async () => {
      const { data, error } = await supabase
        .from('Posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching mobs:', error);
        setError(error);
      } else {
        console.log('Mobs fetched successfully:', data);
        setMobs(data);
      }
    };

    fetchMobs();
  }, []);

  return (
    <>
      <div className='other-col'>
        <div className="gall-box">
          {error && <p>Error loading mobs: {error.message}</p>}
          
            {mobs.map((post) => (
              <div key={post.id} className="gall-mini">
                <img className="create-img" src={post.image} alt={post.title} />
                <h3>{post.title}</h3>
                <p>{post.image}</p>
                <p>{post.desc}</p>
                
             </div>
            ))}
        
        </div>
      </div>
    </>
  );
}



export default Gallery;