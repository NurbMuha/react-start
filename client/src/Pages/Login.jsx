import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../authReducer";  // Импортируем экшен login
import { toast } from "react-toastify";
import Notification from "../Modal/Notification";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const showNotification = (message, type = 'success') => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now(),
        message,
        type,
        read: false
      }
    });
  };

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        // Dispatch для сохранения данных пользователя в Redux
        dispatch(login(data)); // Отправляем экшен login с данными пользователя
        showNotification("Login successful!", 'success');
        setTimeout(() => navigate('/home'), 500);
      } else {
        toast.error(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    }
  }

  return (
    <div className="login-page">
      <Notification />
      <h1>Login</h1>
      <form
        onSubmit={(e) => {
          handleLogin(e).then(() => {
            toast.success("Login successful!");
          });
        }}
      >
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => navigate("/signup")}>Sign Up</button>
    </div>
  );
}

export default Login;