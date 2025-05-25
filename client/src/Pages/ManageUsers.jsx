import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TabBar from '../Components/TabBar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/ManageUsers.css';

function ManageUsers() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user) {
      toast.warn('You must be logged in to manage users');
      navigate('/login');
      return;
    }

    if (user.role !== 'admin') {
      toast.error('Only admins can manage users');
      navigate('/home');
      return;
    }

    if (user.role === 'ban') {
      toast.error('You are banned and cannot manage users');
      navigate('/home');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
      }
    };

    fetchUsers();
  }, [user, navigate]);

  const banUser = async (userId) => {
    if (userId === user.id) {
      toast.warn('You cannot ban yourself');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'ban' }),
      });

      if (!response.ok) throw new Error('Failed to ban user');
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, role: 'ban' } : u))
      );
      toast.success('User banned successfully');
    } catch (error) {
      console.error('Error banning user:', error);
      toast.error('Failed to ban user');
    }
  };

  const unbanUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'user' }),
      });

      if (!response.ok) throw new Error('Failed to unban user');
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, role: 'user' } : u))
      );
      toast.success('User unbanned successfully');
    } catch (error) {
      console.error('Error unbanning user:', error);
      toast.error('Failed to unban user');
    }
  };

  const resetPassword = async (userId) => {
    try {
      const defaultPassword = '12345678'; // Plain text password
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: defaultPassword }),
      });

      if (!response.ok) throw new Error('Failed to reset password');
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, password: defaultPassword } : u))
      );
      toast.success('Password reset successfully');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password');
    }
  };

  return (
    <div className="background-container">
      <TabBar />
      <div className="content manage-users-content">
        <h1>Manage Users</h1>
        <ul className="user-list">
          {users.map((u) => (
            <li key={u.id} className="user-item">
              <span>
                {u.username} - Role: {u.role || 'user'}
              </span>
              <div className="user-actions">
                {u.role !== 'ban' ? (
                  <button
                    onClick={() => banUser(u.id)}
                    className="ban-button"
                    disabled={u.id === user.id}
                  >
                    Ban
                  </button>
                ) : (
                  <button
                    onClick={() => unbanUser(u.id)}
                    className="unban-button"
                  >
                    Unban
                  </button>
                )}
                <button
                  onClick={() => resetPassword(u.id)}
                  className="reset-password-button"
                >
                  Reset Password
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ManageUsers;