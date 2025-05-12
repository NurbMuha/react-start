import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../authReducer"; // Импортируем экшен
import "../Styles/TabBar.css"; 

function TabBar() {
    const user = useSelector((state) => state.auth.user); // Получаем данные пользователя из Redux
    const dispatch = useDispatch();

    const handleLogout = () => {
    dispatch(logout()); // Вызов экшена для логаута
    localStorage.removeItem("user"); // Убедитесь, что localStorage очищается
    console.log("Logout initiated");
};

    return (
      <div className="tab-bar">
        <div className="tab-item">
          <Link to="/home">
            <i className="fas fa-home"></i>
            <span>Home</span>
          </Link>
        </div>
        {user && (
          <>
            <div className="tab-item">
              <Link to="/search">
                <i className="fas fa-edit"></i>
                <span>Edit Posts</span>
              </Link>
            </div>
            <div className="tab-item">
              <Link to="/add-post">
                <i className="fas fa-square-plus"></i>
                <span>Add Post</span>
              </Link>
            </div>
            <div className="tab-item">
              <Link to="/chats">
                <i className="fas fa-ban"></i>
                <span>Manage Users</span>
              </Link>
            </div>
          </>
        )}
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