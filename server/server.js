const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, uuid() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage });
app.use('/uploads', express.static('uploads'));


let users = [
  {
    id: "1",
    username: "alice",
    email: "alice@mail.com",
    password: "ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f", 
    role: "admin"
  },
  {
    id: "2",
    username: "bob",
    email: "bob@mail.com",
    password: "ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f", 
    role: "moderator"
  },
  {
    id: "3",
    username: "charlie",
    email: "charlie@mail.com",
    password: "ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f", 
  },
  {
    id: "b66c",
    email: "nurb_muha@icloud.com",
    username: "nurbol",
    password: "fb19905a7e637dffcf69e425c8e860e06b33f0e660d4a84b399f8a1a3f2b6703", 
    role: "ban"
  }
];


let posts = [
  { id: "1", title: "Updated Title", content: "gg", userId: "1", created_at: "2025-04-10" },
  { id: "2", userId: "2", content: "fsfwfe", created_at: "2025-04-11" },
  { id: "3", userId: "3", content: "I'm joining the chat now.", created_at: "2025-04-12" },
  { id: "867d", userId: "b66c", content: "new post", created_at: "2025-04-17T09:19:03.806Z" }
];


let likes = [
  { id: "9e86", userId: "3", post_id: "2" },
  { id: "cb9e", userId: "1", post_id: "2" },
  { id: "e33d", userId: "1", post_id: "1" },
  { id: "4941", userId: "2", post_id: "1" }
];

let conversations = [];
let messages = [];


const generateConversations = () => {
  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      const user1 = users[i];
      const user2 = users[j];

      const newConversation = {
        id: uuid(),
        participants: [user1.id, user2.id],
        participantNames: [user1.username, user2.username], 
        created_at: new Date().toISOString()
      };

      conversations.push(newConversation);
    }
  }
};


generateConversations();

app.get('/users', (req, res) => res.json(users));


app.get('/posts', (req, res) => res.json(posts));
app.post('/posts', upload.single('media'), (req, res) => {
  const { content, userId } = req.body;
  const mediaPath = req.file ? `/uploads/${req.file.filename}` : null;

  const post = {
    id: uuid(),
    content,
    userId,
    mediaPath,
    created_at: new Date().toISOString()
  };

  posts.push(post);
  res.status(201).json(post);
});
app.patch('/posts/:id', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const post = posts.find(p => p.id === id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  post.content = content ?? post.content;
  res.json(post);
});
app.delete('/posts/:id', (req, res) => {
  const { id } = req.params;
  const postIndex = posts.findIndex(post => post.id === id);
  if (postIndex === -1) return res.status(404).json({ error: 'Post not found' });
  posts.splice(postIndex, 1);
  res.status(204).end();
});


app.get('/likes', (req, res) => res.json(likes));
app.post('/likes', (req, res) => {
  const like = { id: uuid(), ...req.body };
  likes.push(like);
  res.status(201).json(like);
});
app.delete('/likes/:id', (req, res) => {
  const id = req.params.id;
  likes = likes.filter(like => like.id !== id);
  res.status(204).end();
});


app.get('/conversations/:userId', (req, res) => {
  const { userId } = req.params;
  const userConversations = conversations.filter(convo => convo.participants.includes(userId));
  res.json(userConversations);
});
app.post('/conversations', (req, res) => {
  const { participants } = req.body;
  if (!participants || participants.length < 2) {
    return res.status(400).json({ error: 'A conversation must have at least two participants' });
  }
  const newConversation = { id: uuid(), participants, created_at: new Date().toISOString() };
  conversations.push(newConversation);
  res.status(201).json(newConversation);
});


app.get('/messages/:conversationId', (req, res) => {
  const { conversationId } = req.params;
  const conversationMessages = messages.filter(msg => msg.conversation_id === conversationId);
  res.json(conversationMessages);
});
app.post('/messages', (req, res) => {
  const { conversation_id, sender_id, content } = req.body;
  if (!conversation_id || !sender_id || !content) {
    return res.status(400).json({ error: 'conversation_id, sender_id, and content are required' });
  }
  const newMessage = { id: uuid(), conversation_id, sender_id, content, created_at: new Date().toISOString() };
  messages.push(newMessage);
  res.status(201).json(newMessage);
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });
  res.json({ id: user.id, username: user.username, email: user.email, role: user.role });
});

app.patch('/users/:id', (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = users.find(user => user.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.role = role; 
  res.json(user); 
});


app.listen(3001, () => console.log('✅ Express API запущен на http://localhost:3001'));