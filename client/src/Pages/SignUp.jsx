import React from 'react';
import TabBar from '../Components/TabBar';
import { useNavigate } from 'react-router-dom';
import '../Styles/Global.css'; 
import { useState } from 'react';
import '../Styles/SignUp.css'; 

export default function SignUp() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '', 
        role: 'user',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);

        try {
            const response = await fetch('http://localhost:3001/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('User added to database:', data);
                
                setFormData({ email: '', username: '', password: '', role: 'user' });
                
                navigate("/login");
            } else {
                console.error('Failed to add user to database');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="signup-container">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div>
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
                <div>
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
                <div>
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
                <div>
                    <label htmlFor="role">Role:</label>
                    <input
                        type="text"
                        id="role"
                        name="role"
                        value={formData.role}
                        readOnly
                    />
                </div>
                <button type="submit">Sign Up</button>
                <button onClick={() => navigate("/login")}>Back</button>
            </form>

        </div>
    );
}