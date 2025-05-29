import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

      const hashedPassword = await bcrypt.hash(formData.password, 10);
      const userData = {
        ...formData,
        password: hashedPassword,
        avatar: null,
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
      const allUsersResponse = await fetch('http://localhost:3001/users');
      const allUsers = await allUsersResponse.json();
      const newUser = allUsers.find(u => u.email === formData.email);
      for (const existingUser of allUsers) {
        if (existingUser.id !== newUser.id) {
          const conversation = {
            participants: [newUser.id, existingUser.id],
            participantNames: [newUser.username, existingUser.username],
          };

          await fetch('http://localhost:3001/conversations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(conversation),
          });
        }
      }

      toast.success('Account created successfully! Please log in.');
      setFormData({ email: '', username: '', password: '', role: 'user', avatar: null });
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'An error occurred during sign-up');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-form">
        <h2 className="signup-header">Sign up</h2>
        <input
          type="email"
          className="signup-input"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          className="signup-input"
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          className="signup-input"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          className="signup-input readonly-input"
          placeholder="Role"
          name="role"
          value={formData.role}
          readOnly
        />
        <button type="submit" className="signup-button" onClick={handleSubmit}>
          Sign up
        </button>
        <button
          type="button"
          className="back-button"
          onClick={() => navigate('/')}
        >
          Back to login
        </button>
      </div>
    </div>
  );
}