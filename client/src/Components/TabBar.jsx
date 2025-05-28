import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../authReducer";
import "../Styles/TabBar.css";

function TabBar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    console.log("Logout initiated");
  };

  return (
    <div className="tab-bar">
      {/* Home - Available to all users */}
      <div className="tab-item">
        <Link to="/home">
          <i className="fas fa-home"></i>
          <span>Home</span>
        </Link>
      </div>

      {user && user.role !== 'ban' && (
        <>
          {/* Edit Posts - Available to admins and moderators */}
          {user.role === 'noone' && (
            <div className="tab-item">
              <Link to="/edit-post">
                <i className="fas fa-edit"></i>
                <span>Edit Posts</span>
              </Link>
            </div>
          )}
          
            <div className="tab-item">
              <Link to="/add-post">
                <i className="fas fa-square-plus"></i>
                <span>Add Post</span>
              </Link>
            </div>
          

          {/* Chats - Available to all non-banned users */}
          <div className="tab-item">
            <Link to="/chats">
              <i className="fas fa-comments"></i>
              <span>Chats</span>
            </Link>
          </div>

          {/* Manage Users - Available to admins and moderators */}
          {(user.role === 'admin' || user.role === 'moderator') && (
            <div className="tab-item">
              <Link to="/manage-users">
                <i className="fas fa-ban"></i>
                <span>Manage Users</span>
              </Link>
            </div>
          )}
        </>
      )}

      {/* Profile (Logout) - Available to all users */}
      <div className="tab-item" onClick={handleLogout}>
        <Link to="/login">
          <i className="fas fa-user"></i>
          <span>Profile</span>
        </Link>
      </div>
    </div>
  );
}

export default TabBar;