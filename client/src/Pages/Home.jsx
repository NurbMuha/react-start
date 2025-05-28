import React, { useState, useEffect } from 'react';
import PostCard from '../Components/PostCard';
import TabBar from '../Components/TabBar';
import "../Styles/Home.css";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [likes, setLikes] = useState([]);
  const [editedContent, setEditedContent] = useState({});
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.warn('You must be logged in to view posts');
      navigate('/login');
      return;
    }

    const fetchPosts = async () => {
      try {
        const postsResponse = await fetch("http://localhost:3001/posts");
        if (!postsResponse.ok) throw new Error("Failed to fetch posts");
        const postsData = await postsResponse.json();
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to fetch posts");
      }
    };

    const fetchUsers = async () => {
      try {
        const usersResponse = await fetch("http://localhost:3001/users");
        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const usersData = await usersResponse.json();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
      }
    };

    const fetchLikes = async () => {
      try {
        const likesResponse = await fetch("http://localhost:3001/likes");
        if (!likesResponse.ok) throw new Error("Failed to fetch likes");
        const likesData = await likesResponse.json();
        setLikes(likesData);
      } catch (error) {
        console.error("Error fetching likes:", error);
        toast.error("Failed to fetch likes");
      }
    };

    fetchPosts();
    fetchUsers();
    fetchLikes();
  }, [user, navigate]);

  const handleLikePost = async (postId) => {
    if (!user || !user.id) {
      toast.warn("You must be logged in to like a post");
      return;
    }

    const existingLike = likes.find(like => like.userId === user.id && like.post_id === postId);

    if (existingLike) {
      try {
        const response = await fetch(`http://localhost:3001/likes/${existingLike.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error(`Failed to delete like for post ${postId}`);
        setLikes(likes.filter(like => like.id !== existingLike.id));
        toast.success("Like removed successfully!");
      } catch (error) {
        console.error("Error deleting like:", error);
        toast.error("Failed to remove like");
      }
    } else {
      const newLike = {
        userId: user.id,
        post_id: postId,
      };

      try {
        const response = await fetch('http://localhost:3001/likes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newLike),
        });

        if (!response.ok) throw new Error("Failed to add like");
        const savedLike = await response.json();
        setLikes([...likes, savedLike]);
        toast.success("Post liked successfully!");
      } catch (error) {
        console.error("Error adding like:", error);
        toast.error("Failed to like post");
      }
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`Failed to delete post ${postId}`);
      setPosts(posts.filter(post => post.id !== postId));
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  const getLikeCount = (postId) => {
    return likes.filter(like => like.post_id === postId).length;
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).replace(/,/, '');
  };

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

    if (user.id !== post.userId && user.role !== 'admin' && user.role !== 'moderator') {
      toast.error('You can only edit your own posts or as an admin/moderator');
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
        {posts.map(post => {
          const matchedUser = users.find(user => user.id === post.userId);
          const likeCount = getLikeCount(post.id);
          const formattedDate = formatDate(post.created_at);
          const currentContent = editedContent[post.id] || '';

          return (
            <div key={post.id}>
              <PostCard
                post={post}
                author={matchedUser ? matchedUser.username : "Unknown"}
                date={formattedDate}
                onDelete={() => handleDeletePost(post.id)}
                onEdit={() => {}} // Placeholder, will be handled in PostCard
                onLike={() => handleLikePost(post.id)}
                likes={likes}
                user={user}
                editedContent={currentContent}
                setEditedContent={setEditedContent}
                handleEditPost={() => handleEditPost(post.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}