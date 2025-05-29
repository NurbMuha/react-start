import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TabBar from '../Components/TabBar';
import '../Styles/AddPost.css';
import { FaPaperclip, FaUserCircle } from 'react-icons/fa';
import profileImage from '../Images/profile.png';

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
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setMedia(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPost = async () => {
    if (!content || !title) {
      toast.warn('Please fill in title and content');
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
      image: base64Image,
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
        <div className="top-bar">
          <div className="user-info">
            {user?.profileImage ? (
              <img src={profileImage} className="avatar" alt="User Avatar" />
            ) : (
              <FaUserCircle className="avatar-icon" />
            )}
            <span className="username">{user?.username || 'Anonymous'}</span>
          </div>
          <div className="add-post-button">
            <button onClick={handleAddPost}>Post</button>
          </div>
        </div>
        <div className="add-post-textarea">
          {base64Image && (
            <div className="image-preview">
              <img src={base64Image} alt="Preview" />
            </div>
          )}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="add-post-file">
          <input
            type="file"
            accept="image/*"
            id="media-upload"
            onChange={handleFileChange}
          />
          <label htmlFor="media-upload" className="upload-button">
            <FaPaperclip />
          </label>
        </div>
      </div>
    </div>
  );
}

export default AddPost;