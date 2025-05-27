import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabBar from '../Components/TabBar';
import { toast } from 'react-toastify';
import bcrypt from 'bcryptjs';
import '../Styles/Global.css';
import '../Styles/SignUp.css';
import 'react-toastify/dist/ReactToastify.css';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    role: 'user',
    avatar: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.username || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      // Check for duplicate email or username
      const usersResponse = await fetch('http://localhost:3001/users');
      if (!usersResponse.ok) throw new Error('Failed to fetch users');
      const users = await usersResponse.json();

      if (users.some((u) => u.email === formData.email)) {
        toast.error('Email already exists');
        return;
      }

      if (users.some((u) => u.username === formData.username)) {
        toast.error('Username already exists');
        return;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(formData.password, 10);

      // Prepare user data for JSON structure
      const userData = {
        ...formData,
        password: hashedPassword,
        avatar: null, // Match JSON structure
      };

      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add user to database');
      }

      toast.success('Account created successfully! Please log in.');
      setFormData({ email: '', username: '', password: '', role: 'user', avatar: null });
      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'An error occurred during sign-up');
    }
  };

  return (
    <div className="signup-container">
      <TabBar />
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            readOnly
            className="readonly-input"
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="signup-button">Sign Up</button>
          <button
            type="button"
            className="back-button"
            onClick={() => navigate('/')}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}