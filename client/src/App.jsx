import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./authReducer";
import Home from "./Pages/Home";
import EditPost from "./Pages/EditPost";
import AddPost from "./Pages/AddPost";
import Chats from './Pages/Chats';
import ManageUsers from "./Pages/ManageUsers";
import Profile from "./Pages/Profile";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import { ToastContainer } from 'react-toastify';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Получаем текущего пользователя из Redux

  React.useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      dispatch(login(storedUser)); 
    }
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route
            path="/home"
            element={user ? (user.role === "ban" ? <Navigate to="/profile" /> : <Home />) : <Navigate to="/" />}
          />
          <Route
            path="/edit-post"
            element={user ? (user.role === "moderator" ? <EditPost /> : <Navigate to="/profile" />) : <Navigate to="/" />}
          />
          <Route
            path="/add-post"
            element={user ? (user.role === "ban" ? <Navigate to="/profile" /> : <AddPost />) : <Navigate to="/" />}
          />
          <Route
            path="/chats"
            element={user ? (user.role === "ban" ? <Navigate to="/profile" /> : <Chats />) : <Navigate to="/" />}
          />
          <Route
            path="/manage-users"
            element={user ? (user.role === "admin" ? <ManageUsers /> : <Navigate to="/profile" />) : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={<Login />}
          />
          <Route
            path="/signup"
            element={<SignUp />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;