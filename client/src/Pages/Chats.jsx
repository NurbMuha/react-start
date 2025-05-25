import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TabBar from '../Components/TabBar';
import '../Styles/Chats.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Chats() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchConversations = async () => {
      try {
        // Fetch all conversations and filter by user ID
        const response = await fetch('http://localhost:3001/conversations');
        if (!response.ok) throw new Error('Failed to fetch conversations');
        const data = await response.json();
        // Filter conversations where the user is a participant
        const userConversations = data.filter((conv) =>
          conv.participants.includes(user.id)
        );
        setConversations(userConversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast.error('Failed to fetch conversations');
      }
    };

    fetchConversations();

    return () => {
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
      // Fetch messages filtered by conversation ID
      const response = await fetch(
        `http://localhost:3001/messages?conversation_id=${conversationId}`
      );
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast.warn('Message cannot be empty');
      return;
    }

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

      if (!response.ok) throw new Error('Failed to send message');
      const savedMessage = await response.json();
      setMessages((prevMessages) => [...prevMessages, savedMessage]);
      setNewMessage('');
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="background-container">
      <TabBar />
      <div className="chats-container">
        <div className="conversations-list">
          <h2>Chats</h2>
          {conversations.length > 0 ? (
            conversations.map((conversation) => (
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
            ))
          ) : (
            <p>No conversations available</p>
          )}
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