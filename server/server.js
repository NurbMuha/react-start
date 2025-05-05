const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

let users = [
  {
    id: "1",
    username: "alice",
    email: "alice@mail.com",
    password: "12345678",
    role: "admin"
  },
  {
    id: "2",
    username: "bob",
    email: "bob@mail.com",
    password: "12345678",
    role: "moderator"
  },
  {
    id: "3",
    username: "charlie",
    email: "charlie@mail.com",
    password: "12345678",
    role: "user"
  },
  {
    id: "b66c",
    email: "nurb_muha@icloud.com",
    username: "nurbol",
    password: "12345678",
    role: null
  }
];

let posts = [
  {
    title: "Updated Title",
    content: "cock",
    id: "1"
  },
  {
    id: "2",
    userId: "2",
    content: "no its not you suck",
    created_at: "2025-04-11"
  },
  {
    id: "3",
    userId: "3",
    content: "I'm joining the chat now.",
    created_at: "2025-04-12"
  },
  {
    id: "867d",
    userId: "b66c",
    content: "new post",
    created_at: "2025-04-17T09:19:03.806Z"
  }
];

let likes = [
  {
    id: "9e86",
    userId: "3",
    post_id: "2"
  },
  {
    id: "cb9e",
    userId: "1",
    post_id: "2"
  },
  {
    id: "e33d",
    userId: "1",
    post_id: "1"
  },
  {
    id: "4941",
    userId: "2",
    post_id: "1"
  }
];

// Users
app.get('/users', (req, res) => res.json(users));

// Posts
app.get('/posts', (req, res) => {
    console.log("📥 Отправка постов:", posts); // добавь эту строку
    res.json(posts);
  });
app.post('/posts', (req, res) => {
  const post = { id: uuid(), ...req.body, created_at: new Date().toISOString() };
  posts.push(post);
  res.status(201).json(post);
});

// Likes
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

// Запуск сервера
app.listen(3001, () => console.log('✅ Express API запущен на http://localhost:5001'));