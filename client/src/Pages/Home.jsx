import React, { useState, useEffect } from 'react';
import PostCard from '../Components/PostCard';
import TabBar from '../Components/TabBar';
import "../Styles/Home.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [likes, setLikes] = useState([]);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsResponse = await fetch("http://localhost:3001/posts");
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
  }, []);

  const handleLikePost = async (postId) => {
    console.log("Клик по лайку для поста:", postId);
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
        if (!response.ok) {
          throw new Error(`Failed to delete like for post with id ${postId}`);
        }
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

        if (response.ok) {
          const savedLike = await response.json();
          setLikes([...likes, savedLike]);
          toast.success("Post liked successfully!");
        } else {
          console.error("Failed to add like");
          toast.error("Failed to like post");
        }
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
      });

      if (!response.ok) {
        throw new Error(`Failed to delete post with id ${postId}`);
      }

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

  return (
    <div className="background-container">
      <TabBar />

      <div className="posts-container">
        {posts.map(post => {
          const matchedUser = users.find(user => user.id === post.userId);
          const likeCount = getLikeCount(post.id);

          return (
            <div key={post.id}>
              <PostCard
                post={post}
                author={matchedUser ? matchedUser.username : "Unknown"}
                date={post.created_at}
                onDelete={() => handleDeletePost(post.id)}
                onEdit={() => console.log("Edit post", post.id)}
                onLike={() => handleLikePost(post.id)}
              />
              <div className="like-container">
                <button
                  type="button"
                  onClick={() => handleLikePost(post.id)}
                >
                  {likes.some(like => like.userId === user?.id && like.post_id === post.id) ? (
                    <i className="fa-solid fa-heart"></i>
                  ) : (
                    <i className="fa-regular fa-heart"></i>
                  )}
                </button>
                <span>{likeCount} Likes</span>
              </div>
              {user && user.role === "moderator" && (
                <button
                  onClick={() => handleDeletePost(post.id)}
                >
                  Delete
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}