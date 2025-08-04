# Setup Guide for Real-Time Chat App

## Quick Start (Recommended)

### Option 1: Use Cloud Services (Easiest)

#### MongoDB Atlas (Free Tier)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier)
4. Get your connection string
5. Set environment variable:
   ```bash
   set MONGODB_URI=your_mongodb_atlas_connection_string
   ```

#### Redis Cloud (Free Tier)
1. Go to [Redis Cloud](https://redis.com/try-free/)
2. Sign up for a free account
3. Create a database
4. Get your connection string
5. Set environment variable:
   ```bash
   set REDIS_URL=your_redis_cloud_connection_string
   ```

### Option 2: Install Locally (Advanced)

#### MongoDB Installation
1. **Download MongoDB Community Server**:
   - Go to https://www.mongodb.com/try/download/community
   - Download the Windows installer
   - Run as Administrator

2. **Or use Docker** (if you have Docker installed):
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

#### Redis Installation
1. **Download Redis for Windows**:
   - Go to https://github.com/microsoftarchive/redis/releases
   - Download the latest release
   - Extract and run `redis-server.exe`

2. **Or use Docker** (if you have Docker installed):
   ```bash
   docker run -d -p 6379:6379 --name redis redis:latest
   ```

## Running the Application

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Server
```bash
npm start
```

### Step 3: Access the Application
Open your browser and go to: `http://localhost:3000`

## Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB (replace with your connection string)
MONGODB_URI=mongodb://localhost:27017/chat_app

# Redis (replace with your connection string)
REDIS_URL=redis://localhost:6379

# Server Port (optional)
PORT=3000
```

## Troubleshooting

### MongoDB Connection Issues
- **Error**: "MongoDB connection error"
- **Solution**: 
  1. Install MongoDB locally, or
  2. Use MongoDB Atlas (cloud service)
  3. Check your connection string

### Redis Connection Issues
- **Error**: "Redis Client Error"
- **Solution**:
  1. Install Redis locally, or
  2. Use Redis cloud service
  3. Check your connection string

### Server Won't Start
- **Error**: "Port already in use"
- **Solution**: Change the PORT environment variable or kill the process using the port

## Features Available Without Database

The application will still work for basic real-time messaging even without MongoDB and Redis, but you'll lose:
- Message persistence (history)
- Cross-server communication
- Room management

## Next Steps

1. **For Development**: Use cloud services (MongoDB Atlas + Redis Cloud)
2. **For Production**: Install MongoDB and Redis locally or use managed services
3. **For Learning**: Install both locally to understand the full stack

## Support

If you encounter issues:
1. Check the console output for error messages
2. Verify your connection strings
3. Ensure the required services are running
4. Check the README.md for detailed documentation 