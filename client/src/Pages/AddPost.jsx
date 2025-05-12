import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Импортируем useSelector
import { toast } from 'react-toastify'; // Импортируем toast
import 'react-toastify/dist/ReactToastify.css'; // Импортируем стили для toast
import TabBar from '../Components/TabBar';
import '../Styles/AddPost.css'; 

function AddPost() {
    const user = useSelector((state) => state.auth.user); // Получаем пользователя из Redux
    const navigate = useNavigate();
    const [content, setContent] = useState('');

    const handleAddPost = async () => {
        if (!content) {
            toast.warn('Please fill in all fields'); // Используем toast для предупреждения
            return;
        }

        const newPost = {
            userId: user.id,
            content,
            created_at: new Date().toISOString(),
        };

        try {
            const response = await fetch('http://localhost:3001/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPost),
            });

            if (response.ok) {
                toast.success('Post added successfully!'); // Успешное уведомление
                navigate('/home'); 
            } else {
                toast.error('Failed to add post'); // Ошибка
            }
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error('An error occurred while adding the post'); // Ошибка
        }
    };

    return (
        <div className="add-post-container">
            <TabBar />
            <div className="add-post-content">
                <div className="add-post-header">
                    <h1>Add Post</h1>
                </div>
                <div className="add-post-textarea">
                    <textarea
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div className="add-post-button">
                    <button onClick={handleAddPost}>Add Post</button>
                </div>
            </div>
        </div>
    );
}

export default AddPost;