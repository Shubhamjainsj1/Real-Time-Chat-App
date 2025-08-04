require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const redis = require('redis');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat_app';

// Connect to MongoDB with better error handling
async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('💡 To fix this:');
    console.log('   1. Install MongoDB locally, or');
    console.log('   2. Use MongoDB Atlas (cloud) - free tier available');
    console.log('   3. Set MONGODB_URI environment variable');
    console.log('   Server will continue without database functionality');
  }
}

connectToMongoDB();

// Redis Client Setup
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err.message);
  console.log('💡 To fix this:');
  console.log('   1. Install Redis locally, or');
  console.log('   2. Use Redis cloud service');
  console.log('   3. Set REDIS_URL environment variable');
  console.log('   Server will continue without Redis pub/sub functionality');
});
redisClient.on('connect', () => console.log('✅ Connected to Redis'));

// Message Schema
const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  content: { type: String, required: true },
  room: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Socket.IO Connection Handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a chat room
  socket.on('join_room', async (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
    
    // Send room history
    try {
      const messages = await Message.find({ room }).sort({ timestamp: 1 }).limit(50);
      socket.emit('room_history', messages);
    } catch (error) {
      console.error('Error fetching room history:', error);
    }
  });

  // Handle new message
  socket.on('send_message', async (data) => {
    try {
      // Save message to MongoDB
      const newMessage = new Message({
        sender: data.sender,
        content: data.content,
        room: data.room
      });
      
      await newMessage.save();
      
      // Publish message to Redis for other server instances
      await redisClient.publish('chat_message', JSON.stringify({
        sender: data.sender,
        content: data.content,
        room: data.room,
        timestamp: newMessage.timestamp
      }));
      
      // Emit to all clients in the room
      io.to(data.room).emit('receive_message', {
        sender: data.sender,
        content: data.content,
        room: data.room,
        timestamp: newMessage.timestamp
      });
      
      console.log(`Message sent in room ${data.room}: ${data.content}`);
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('error', 'Failed to send message');
    }
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    socket.to(data.room).emit('user_typing', {
      user: data.sender,
      room: data.room
    });
  });

  // Handle stop typing
  socket.on('stop_typing', (data) => {
    socket.to(data.room).emit('user_stop_typing', {
      user: data.sender,
      room: data.room
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Redis subscription for cross-server communication
const subscriber = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

subscriber.subscribe('chat_message', (message) => {
  try {
    const messageData = JSON.parse(message);
    // Broadcast to all connected clients in the room
    io.to(messageData.room).emit('receive_message', messageData);
  } catch (error) {
    console.error('Error processing Redis message:', error);
  }
});

// API Routes
app.get('/api/messages/:room', async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Message.distinct('room');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    connections: io.engine.clientsCount
  });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close();
    redisClient.quit();
    subscriber.quit();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close();
    redisClient.quit();
    subscriber.quit();
    process.exit(0);
  });
});
