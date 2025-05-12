import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TabBar from '../Components/TabBar';
import '../Styles/Chats.css';

function Chats() {
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login'); // Redirect to login if user is not logged in
            return;
        }

        const fetchConversations = async () => {
            try {
                const response = await fetch(`http://localhost:3001/conversations/${user.id}`);
                const data = await response.json();
                setConversations(data);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

        fetchConversations();

        return () => {
            // Cleanup logic (if needed)
            setConversations([]);
            setMessages([]);
        };
    }, [user, navigate]);

    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
        fetchMessages(conversation.id);
    };

    const fetchMessages = async (conversationId) => {
        try {
            const response = await fetch(`http://localhost:3001/messages/${conversationId}`);
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const message = {
            conversation_id: selectedConversation.id,
            sender_id: user.id,
            content: newMessage,
        };

        try {
            const response = await fetch('http://localhost:3001/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });

            if (response.ok) {
                const savedMessage = await response.json();
                setMessages((prevMessages) => [...prevMessages, savedMessage]);
                setNewMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (!user) {
        return null; // Prevent rendering if user is not available
    }

    return (
        <div className="background-container">
            <TabBar />
            <div className="chats-container">
                <div className="conversations-list">
                    <h2>Chats</h2>
                    {conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            className={`conversation-item ${
                                selectedConversation?.id === conversation.id ? 'active' : ''
                            }`}
                            onClick={() => handleSelectConversation(conversation)}
                        >
                            {conversation.participantNames
                                .filter((name) => name !== user.username)
                                .map((name) => (
                                    <span key={name}>{name}</span>
                                ))}
                        </div>
                    ))}
                </div>
                <div className="chat-window">
                    {selectedConversation ? (
                        <>
                            <div className="messages-list">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`message-item ${
                                            message.sender_id === user.id ? 'sent' : 'received'
                                        }`}
                                    >
                                        {message.content}
                                    </div>
                                ))}
                            </div>
                            <div className="message-input">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button onClick={handleSendMessage}>Send</button>
                            </div>
                        </>
                    ) : (
                        <div className="no-conversation-selected">
                            <p>Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Chats;