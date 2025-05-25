import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TabBar from '../Components/TabBar';
import '../Styles/AddPost.css';

function AddPost() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [media, setMedia] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setMedia(file);
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result);
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPost = async () => {
    if (!content || !title) {
      toast.warn('Please fill in title and content');
      return;
    }

    if (!user || !user.id) {
      toast.warn('You must be logged in to create a post');
      navigate('/login');
      return;
    }

    if (user.role === 'ban') {
      toast.error('You are banned and cannot create posts');
      return;
    }

    const postData = {
      title,
      content,
      userId: user.id,
      created_at: new Date().toISOString(),
      image: base64Image, // Store base64 string or null if no image
    };

    try {
      const response = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error('Failed to add post');
      toast.success('Post added successfully!');
      navigate('/home');
    } catch (error) {
      console.error('Error adding post:', error);
      toast.error('An error occurred while adding the post');
    }
  };

  return (
    <div className="add-post-container">
      <TabBar />
      <div className="add-post-content">
        <div className="add-post-header">
          <h1>Add Post</h1>
        </div>
        <div className="add-post-textarea">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="add-post-file">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {base64Image && (
            <div className="image-preview">
              <img
                src={base64Image}
                alt="Preview"
                style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px' }}
              />
            </div>
          )}
        </div>
        <div className="add-post-button">
          <button onClick={handleAddPost}>Add Post</button>
        </div>
      </div>
    </div>
  );
}

export default AddPost;