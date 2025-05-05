import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Search from "./Pages/Search";
import AddPost from "./Pages/AddPost";
import Chats from "./Pages/Chats";
import Profile from "./Pages/Profile";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";

export const AuthContext = React.createContext();

function App() {
  const [user, setUser] = React.useState(null); 

  function login(userData) {
    setUser(userData);
  }
  function logout() {
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/home" 
            element={user && user.role === null ? <Navigate to="/profile" /> : <Home />}
          />
          <Route
            path="/search"
            element={user && (user.role === null || user.role !== "moderator") ? <Navigate to="/profile" /> : <Search />}
          />
          <Route
            path="/add-post"
            element={user && user.role === null ? <Navigate to="/profile" /> : user ? <AddPost /> : <Navigate to="/profile" />}
          />
          <Route
            path="/chats"
            element={user && (user.role === null || user.role !== "admin") ? <Navigate to="/profile" /> : <Chats />}
          />
          <Route
            path="/profile"
            element={<Profile />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/signup"
            element={<SignUp />}
          />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;