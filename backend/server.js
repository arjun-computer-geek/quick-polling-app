const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const Poll = require('./models/poll');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});


// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New client connected');

    // Listen for new poll creation
    socket.on('createPoll', async (pollData) => {
        const newPoll = new Poll(pollData);
        await newPoll.save();
        io.emit('newPoll', newPoll);
    });

    // Listen for votes
    socket.on('vote', async ({ pollId, optionIndex }) => {
        const poll = await Poll.findById(pollId);
        poll.options[optionIndex].votes += 1;
        await poll.save();
        io.emit('pollUpdated', poll);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.post('/polls', async (req, res) => {
    const newPoll = new Poll(req.body);
    try {
        await newPoll.save();
        res.status(201).json(newPoll);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.get('/polls', async (req, res) => {
    try {
        const polls = await Poll.find().sort({ created_at: -1 });
        res.json(polls);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
