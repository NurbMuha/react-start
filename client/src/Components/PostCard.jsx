import React, { useState } from 'react';
import profileImage from '../Images/profile.png'; // Import the avatar image

export default function PostCard({ post, author, date, onDelete, onLike, likes, user, editedContent, setEditedContent, handleEditPost }) {
  const [isEditing, setIsEditing] = useState(false);
  const isLiked = likes?.some(like => like.userId === user?.id && like.post_id === post.id); // Added optional chaining
  const canEdit = user && (user.id === post.userId || user.role === 'admin' || user.role === 'moderator') && user.role !== 'ban';
  const canDelete = user && (
  user.role === 'admin' ||
  user.role === 'moderator' ||
  user.id === post.userId
);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (typeof handleEditPost === 'function') {
      handleEditPost(post.id);
    } else {
      console.error('handleEditPost is not a function');
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    if (typeof setEditedContent === 'function') {
      setEditedContent(prev => ({ ...prev, [post.id]: '' }));
    }
    setIsEditing(false);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img
          src={profileImage}
          alt="avatar"
          className="avatar"
          onError={(e) => {
            e.target.style.display = 'none';
            console.error('Failed to load avatar image');
          }}
        />
        <div className="post-user-info">
          <span className="author">{author}</span>
          <span className="date">{date}</span>
        </div>
      </div>
      {post.title && <h3 className="post-title">{post.title}</h3>}
      <p>{post.content}</p>
      {post.image && (
        <img
          src={post.image}
          alt="Post media"
          className="post-image post-card-image"
          onError={(e) => {
            e.target.style.display = 'none';
            console.error('Failed to load image:', post.image);
          }}
        />
      )}
      <div className="post-actions">
        <div className="left-actions">
          <div className="like-container">
            <button
              type="button"
              onClick={onLike}
              className={`like-button ${isLiked ? 'liked' : ''}`}
            >
              {isLiked ? (
                <i className="fas fa-heart"></i>
              ) : (
                <i className="far fa-heart"></i>
              )}
            </button>
            <span>{likes?.filter(like => like.post_id === post.id).length} Likes</span> {/* Added optional chaining */}
          </div>
          {canEdit && (
            <button
              onClick={handleEditClick}
              className="edit-button"
            >
              <i className="fas fa-edit"></i>
            </button>
          )}
        </div>
        {canDelete && (
          <button
            onClick={onDelete}
            className="delete-button"
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        )}
      </div>
      {isEditing && (
        <div className="edit-post-controls">
          <input
            value={editedContent}
            onChange={(e) => {
              if (typeof setEditedContent === 'function') {
                setEditedContent(prev => ({ ...prev, [post.id]: e.target.value }));
              }
            }}
            placeholder="Edit content here"
            className="edit-content-input"
          />
          <button onClick={handleSaveEdit} className="save-button">
            <i className="fas fa-save"></i>
          </button>
          <button onClick={handleCancelEdit} className="cancel-button">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
    </div>
  );
}