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
      const defaultPassword = '12345678';
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

  const changeRole = async (userId, newRole) => {
    if (userId === user.id) {
      toast.warn('You cannot change your own role');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error('Failed to change role');
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      toast.success(`Role changed to ${newRole} successfully`);
    } catch (error) {
      console.error('Error changing role:', error);
      toast.error('Failed to change role');
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
                {user.role === 'admin' && u.role !== 'admin' && (
                  <select
                    value={u.role || 'user'}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    className="role-select"
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                )}
                {user.role === 'moderator' && u.role !== 'ban' && u.id !== user.id && (
                  <button
                    onClick={() => banUser(u.id)}
                    className="ban-button"
                  >
                    Ban
                  </button>
                )}
                {user.role === 'moderator' && u.role === 'ban' && (
                  <button
                    onClick={() => unbanUser(u.id)}
                    className="unban-button"
                  >
                    Unban
                  </button>
                )}
                {user.role === 'admin' && (
                  <button
                    onClick={() => resetPassword(u.id)}
                    className="reset-password-button"
                  >
                    Reset Password
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ManageUsers;