import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../authReducer';
import { toast } from 'react-toastify';
import Notification from '../Modal/Notification';
import bcrypt from 'bcryptjs';
import '../Styles/Login.css';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const showNotification = (message, type = 'success') => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now(),
        message,
        type,
        read: false,
      },
    });
  };

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const users = await response.json();

      let matchedUser = null;
      for (const u of users) {
        if (u.email === email) {
          // Try plain text password (e.g., '12345678' from ManageUsers reset)
          if (u.password === password) {
            matchedUser = u;
            break;
          }
          // Try hashed password (e.g., from JSON)
          try {
            if (await bcrypt.compare(password, u.password)) {
              matchedUser = u;
              break;
            }
          } catch (bcryptError) {
            console.warn(`Invalid hash for user ${u.email}:`, bcryptError);
            // Continue checking other users
          }
        }
      }

      if (matchedUser) {
        const { password, ...userData } = matchedUser;
        toast.success('Logged in successfully!');
        dispatch(login(userData));
        showNotification('Login successful!', 'success');
        setTimeout(() => navigate('/home'), 500);
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    }
  }

  return (
    <div className="login-page">
      <Notification />
      <h1 className="login-header">Login</h1>
      <form className="login-form" onSubmit={(e) => handleLogin(e)}>
        <input
          type="email"
          className="login-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">Login</button>
      </form>
      <button
        type="button"
        className="signup-button"
        onClick={() => navigate('/signup')}
      >
        Sign Up
      </button>
    </div>
  );
}

export default Login;