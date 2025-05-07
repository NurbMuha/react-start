import React, { useState, useEffect } from 'react';
import TabBar from '../Components/TabBar';
import '../Styles/Home.css'; 
import PostCard from '../Components/PostCard'; 


function Search () {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [editedContent, setEditedContent] = useState({});

    useEffect(() => {
        const fetchPosts = async () => {
          try {
            const postsResponse = await fetch("http://localhost:3001/posts");
            const postsData = await postsResponse.json();
            setPosts(postsData);
          } catch (error) {
            console.error("Error fetching posts:", error);
          }
        };
    
        const fetchUsers = async () => {
          try {
            const usersResponse = await fetch("http://localhost:3001/users");
            const usersData = await usersResponse.json();
            setUsers(usersData);
          } catch (error) {
            console.error("Error fetching users:", error);
          }
        };
    
        fetchPosts();
            fetchUsers();
        }, []);
        
    return (
        <div className="background-container">
      <TabBar />
      <div className="posts-container">
{posts.map(post => {
  const matchedUser = users.find(user => user.id === post.userId);
  const currentContent = editedContent[post.id] || '';

  return (
    <div key={post.id}>
      <PostCard
        post={post}
        author={matchedUser ? matchedUser.username : "Unknown"}
        date={post.created_at}
      />
      <button
        onClick={async () => {
          try {
            const response = await fetch(`http://localhost:3001/posts/${post.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ content: currentContent }), 
            });
            if (response.ok) {
              const updatedPost = await response.json();
              setPosts(prevPosts =>
                prevPosts.map(p => (p.id === updatedPost.id ? updatedPost : p))
              );
            }
          } catch (error) {
            console.error(`Error updating post with ID: ${post.id}`, error);
          }
        }}
      >
        <h1>Edit</h1>
      </button>
      <label>
        Content:
        <input
          value={currentContent}
          onChange={(e) => setEditedContent({ ...editedContent, [post.id]: e.target.value })}
          placeholder="Edit content here"
        />
      </label>
    </div>
  );
})}
      </div>
    </div>
  );
}

export default Search;