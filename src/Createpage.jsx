import './App.css';
import React from 'react';
import supabase from './client';

function Createpage() {
  const addPost = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.elements.title?.value || '';
    const desc = form.elements.desc?.value || '';
    const image = form.elements.image?.value || '';

    console.log({ title, desc, image });
    console.log('Data being sent:', { title, desc, image });

    const { error } = await supabase.from('Posts').insert([
      {
        title,
        desc,
        image,
      },
    ]);

    if (error) {
      console.log('Error adding post:', error);
    } else {
      console.log('Post added successfully');
    }
  };

  return (
    <>
      <div className="create-col">
        <div className="arrange-form">
          <div className="arrange-title">
            <p className="create-title">Create a New Post</p>
            <p className="create-subtitle">Share your thoughts with the community</p>
          </div>
          <div className="fix-inner">
            <form onSubmit={addPost}>
              <div className="form-group">
                <label htmlFor="title">Post Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter your post title"
                  required
                  
                />
                <br/>
              </div>

              <div className="form-group">
                <label htmlFor="desc">Description:</label>
                <textarea
                  id="desc"
                  name="desc"
                  placeholder="Write your post description here..."
                  rows="5"
                  required
                ></textarea>
                
              </div>

              <div className="form-group">
                <br/>
                <label htmlFor="image">Image URL (optional):</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  placeholder="Enter an image URL"
                />
              </div>

              <div className="button-align">
                <button type="submit">Submit Post</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Createpage;