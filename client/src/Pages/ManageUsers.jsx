import React, { useEffect, useState } from 'react';
import TabBar from '../Components/TabBar';

function ManageUsers() {
    const [users, setUsers] = useState([]);

    // Загружаем список пользователей при загрузке страницы
    const fetchUsers = () => {
        fetch("http://localhost:3001/users")
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    };

    useEffect(() => {
        fetchUsers(); // Загружаем пользователей при монтировании компонента
    }, []);

    // Функция для блокировки пользователя
    const banUser = (userId) => {
        fetch(`http://localhost:3001/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role: "ban" }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update user role');
            }
            return response.json();
        })
        .then(() => {
            fetchUsers(); // Повторно загружаем пользователей после обновления
        })
        .catch(error => console.error('Error banning user:', error));
    };

    return (
        <div className="background-container">
            <TabBar />
            <div className="content">
                <h1>Manage Users</h1>
                <ul>
                    {users.map(user => (
                        <li key={user.id}>
                            {user.username} - status: {user.role || 'Banned'}
                            <button onClick={() => banUser(user.id)}>Ban</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ManageUsers;