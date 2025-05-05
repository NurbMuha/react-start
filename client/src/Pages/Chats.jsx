import React from 'react';
import TabBar from '../Components/TabBar';
import '../Styles/Global.css'; 

function Chats () {
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        fetch("http://localhost:3001/users")
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const banUser = (userId) => {
        fetch(`http://localhost:3001/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role: null }),
        })
    };

    return (
        <div className="background-container">
            <TabBar />
            <div className="content">
                <h1>Chats in progress</h1>
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
};

export default Chats;