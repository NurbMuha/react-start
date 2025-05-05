import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../authReducer";

function Login() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        const response = await fetch(`http://localhost:3001/users?email=${email}&password=${password}`);
        const data = await response.json();
        if (data.length > 0) {
          dispatch(login(data[0]));
          navigate("/home");
        } else {
          alert("Invalid credentials");
        }
      }

    return (
        <div className="login-page">
            <h1>Login</h1>
        <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
        </form>
            <button onClick={() => navigate("/signup")}>Sign Up</button>
        </div>
    );
}

export default Login;
