# Real-Time Chat Application

A real-time chat application built with Node.js, Express, Socket.IO, MongoDB, and Redis.

## Features

- **Real-time messaging** using Socket.IO
- **Room-based chat** - users can join different chat rooms
- **Message persistence** with MongoDB
- **Cross-server communication** using Redis pub/sub pattern
- **Typing indicators** - shows when someone is typing
- **Message history** - loads previous messages when joining a room
- **Connection status** - shows real-time connection status
- **Responsive design** - works on desktop and mobile

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (running locally or accessible via connection string)
- **Redis** (running locally or accessible via connection string)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd real_time_chat_app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
```bash
# Create a .env file with the following variables:
MONGODB_URI=mongodb://localhost:27017/chat_app
REDIS_URL=redis://localhost:6379
PORT=3000
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your environment variables).

## API Endpoints

- `GET /` - Serves the main chat interface
- `GET /health` - Health check endpoint
- `GET /api/messages/:room` - Get messages for a specific room
- `GET /api/rooms` - Get all available rooms

## Socket.IO Events

### Client to Server
- `join_room` - Join a chat room
- `send_message` - Send a message to a room
- `typing` - Indicate user is typing
- `stop_typing` - Indicate user stopped typing

### Server to Client
- `room_history` - Send message history when joining a room
- `receive_message` - Receive a new message
- `user_typing` - Another user is typing
- `user_stop_typing` - Another user stopped typing
- `error` - Error message

## Database Schema

### Message Collection
```javascript
{
  sender: String,      // Username of the sender
  content: String,     // Message content
  room: String,        // Room name
  timestamp: Date      // Message timestamp
}
```

## Architecture

### Components
1. **Express Server** - HTTP server and API endpoints
2. **Socket.IO** - Real-time bidirectional communication
3. **MongoDB** - Message persistence and storage
4. **Redis** - Pub/sub pattern for cross-server communication
5. **Frontend** - HTML/CSS/JavaScript chat interface

### Data Flow
1. User sends a message via Socket.IO
2. Server saves message to MongoDB
3. Server publishes message to Redis
4. Server broadcasts message to all clients in the room
5. Other server instances receive message via Redis and broadcast to their clients

## Configuration

### Environment Variables
- `MONGODB_URI` - MongoDB connection string (default: `mongodb://localhost:27017/chat_app`)
- `REDIS_URL` - Redis connection string (default: `redis://localhost:6379`)
- `PORT` - Server port (default: `3000`)

### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `chat_app` (or update the connection string)
3. The application will automatically create the necessary collections

### Redis Setup
1. Install Redis locally or use a Redis cloud service
2. Ensure Redis is running on the default port (6379) or update the connection string

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter your username and a room name
3. Click "Join Room" to start chatting
4. Type messages in the input field and press Enter or click Send
5. See real-time messages from other users in the same room

## Features in Detail

### Real-time Messaging
- Instant message delivery using Socket.IO
- No page refresh required
- Messages appear immediately for all users in the room

### Room-based Chat
- Users can join different chat rooms
- Messages are isolated to specific rooms
- Room history is loaded when joining

### Typing Indicators
- Shows when other users are typing
- Automatically disappears after 1 second of inactivity
- Real-time feedback for better user experience

### Message Persistence
- All messages are stored in MongoDB
- Message history is available when rejoining rooms
- Timestamps are preserved for all messages

### Cross-server Communication
- Redis pub/sub pattern enables multiple server instances
- Messages are synchronized across all server instances
- Scalable architecture for high-traffic applications

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in environment variables
   - Verify network connectivity

2. **Redis Connection Error**
   - Ensure Redis is running
   - Check the connection string in environment variables
   - Verify Redis server is accessible

3. **Socket.IO Connection Issues**
   - Check if the server is running on the correct port
   - Verify CORS settings if accessing from a different domain
   - Check browser console for connection errors

4. **Messages Not Appearing**
   - Ensure you're in the correct room
   - Check if other users are in the same room
   - Verify Socket.IO connection status

### Debug Mode
To enable debug logging, set the following environment variable:
```bash
DEBUG=socket.io:*
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. 