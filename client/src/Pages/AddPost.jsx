import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import TabBar from '../Components/TabBar';
import '../Styles/AddPost.css'; 

function AddPost () {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');

const handleAddPost = async () => {
    if (!content) {
        alert('Please fill in all fields');
        return;
    }

    const newPost = {
        userId: user.id,
        content,
        created_at: new Date().toISOString(),
    };

    try {
        const response = await fetch('http://localhost:3001/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPost),
        });

        if (response.ok) {
            const savedPost = await response.json();
            setPosts((prevPosts) => [...prevPosts, savedPost]);
            alert('Post added successfully!');
            navigate('/home'); 
        } else {
            alert('Failed to add post');
        }
    } catch (error) {
        console.error('Error adding post:', error);
        alert('An error occurred while adding the post');
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
            <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
        </div>
        <div className="add-post-button">
            <button onClick={handleAddPost}>Add Post</button>
        </div>
    </div>
</div>
);
}
export default AddPost;