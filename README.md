
# Real-Time Polling Application

A real-time polling application with Socket.IO for real-time updates and REST endpoints.

## API Endpoints

### REST Endpoints
- `POST /polls` - Create a new poll
- `GET /polls` - Get all polls

### Socket.IO Events

#### Client -> Server
- `createPoll` - Creates a new poll
- `vote` - Submit a vote for a poll option
- `disconnect` - Client disconnection handling

#### Server -> Client
- `newPoll` - Broadcasts when a new poll is created
- `pollUpdated` - Broadcasts when a poll receives a vote

## Technical Implementation

- Express.js server with Socket.IO integration
- MongoDB database connection
- CORS enabled for cross-origin requests
- Real-time updates using WebSocket protocol

## Environment Variables
- `PORT` - Server port (defaults to 8080)
- `MONGO_URI` - MongoDB connection string

## Database Schema
```javascript
{
  id: String,
  question: String,
  options: [{
    text: String,
    votes: Number
  }]
}
