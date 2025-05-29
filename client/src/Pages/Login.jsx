import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  const notifications = useSelector(state => state.notifications.notifications); 

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
          if (u.password === password) {
            matchedUser = u;
            break;
          }
          try {
            if (await bcrypt.compare(password, u.password)) {
              matchedUser = u;
              break;
            }
          } catch (bcryptError) {
            console.warn(`Invalid hash for user ${u.email}:`, bcryptError);
          }
        }
      }

      if (matchedUser) {
        const { password, ...userData } = matchedUser;
        dispatch(login(userData));
        showNotification('Logged in successfully!', 'success');
        setTimeout(() => navigate('/home'), 2500);
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    }
  }

  
  const hasNotification = notifications.length > 0;

  return (
    <div className="login-page">
      {hasNotification && <div className="overlay"></div>} 
      <Notification />
      <div className="login-form">
        <form onSubmit={handleLogin}>
          <h2 className="login-header">Sign in</h2>
          <input
            type="email"
            name="email"
            className="login-input"
            placeholder="Email or username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="forgot-password-container">
            <a href="#" className="forgot-password">Forgot your password?</a>
          </div>
          <button type="submit" className="login-button">
            Sign in
          </button>
        </form>
        <button
          type="button"
          className="signup-button"
          onClick={() => navigate('/signup')}
        >
          Create new account
        </button>
      </div>
    </div>
  );
}

export default Login;