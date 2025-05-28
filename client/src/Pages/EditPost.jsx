import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TabBar from '../Components/TabBar';
import PostCard from '../Components/PostCard';
import '../Styles/Home.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditPost() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [editedContent, setEditedContent] = useState({});

  useEffect(() => {
    if (!user) {
      toast.warn('You must be logged in to edit posts');
      navigate('/login');
      return;
    }

    const fetchPosts = async () => {
      try {
        const postsResponse = await fetch('http://localhost:3001/posts');
        if (!postsResponse.ok) throw new Error('Failed to fetch posts');
        const postsData = await postsResponse.json();
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error('Failed to fetch posts');
      }
    };

    const fetchUsers = async () => {
      try {
        const usersResponse = await fetch('http://localhost:3001/users');
        if (!usersResponse.ok) throw new Error('Failed to fetch users');
        const usersData = await usersResponse.json();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
      }
    };

    fetchPosts();
    fetchUsers();
  }, [user, navigate]);

  const handleEditPost = async (postId) => {
    const content = editedContent[postId];
    if (!content) {
      toast.warn('Please enter content to update');
      return;
    }

    if (user.role === 'ban') {
      toast.error('You are banned and cannot edit posts');
      return;
    }

    const post = posts.find((p) => p.id === postId);
    if (!post) {
      toast.error('Post not found');
      return;
    }

    if (user.id !== post.userId && user.role !== 'admin') {
      toast.error('You can only edit your own posts or as an admin');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error('Failed to update post');
      const updatedPost = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
      );
      setEditedContent((prev) => ({ ...prev, [postId]: '' })); // Clear input
      toast.success('Post updated successfully!');
    } catch (error) {
      console.error(`Error updating post with ID: ${postId}`, error);
      toast.error('Failed to update post');
    }
  };

  return (
    <div className="background-container">
      <TabBar />
      <div className="posts-container">
        {posts.map((post) => {
          const matchedUser = users.find((user) => user.id === post.userId);
          const currentContent = editedContent[post.id] || '';

          // Only show edit controls for user's own posts or if user is moderator
          if (user.id !== post.userId && user.role !== 'moderator') {
            return (
              <div key={post.id}>
                <PostCard
                  post={post}
                  author={matchedUser ? matchedUser.username : 'Unknown'}
                  date={post.created_at}
                />
              </div>
            );
          }

          return (
            <div key={post.id} className="edit-post-container">
              <PostCard
                post={post}
                author={matchedUser ? matchedUser.username : 'Unknown'}
                date={post.created_at}
              />
              <div className="edit-post-controls">
                <label>
                  Edit Content:
                  <input
                    value={currentContent}
                    onChange={(e) =>
                      setEditedContent({ ...editedContent, [post.id]: e.target.value })
                    }
                    placeholder="Edit content here"
                    className="edit-content-input"
                  />
                </label>
                <button
                  onClick={() => handleEditPost(post.id)}
                  className="edit-post-button"
                >
                  <i className="fas fa-edit"></i> Save
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EditPost;