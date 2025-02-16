'use client'
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import CreatePoll from './components/CreatePoll';
import PollList from './components/PllList';


const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
export default function Home() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    // Fetch initial polls
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/polls`)
      .then(res => res.json())
      .then(data => setPolls(data));

    // Socket listeners
    socket.on('newPoll', (poll) => {
      setPolls(prev => [...prev, poll]);
    });

    socket.on('pollUpdated', (updatedPoll) => {
      setPolls(prev => prev.map(poll =>
        poll._id === updatedPoll._id ? updatedPoll : poll
      ));
    });

    return () => {
      socket.off('newPoll');
      socket.off('pollUpdated');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">
          Real-time Polling App
        </h1>
        <CreatePoll socket={socket} />
        <PollList polls={polls} socket={socket} />
      </div>
    </div>
  );
}
