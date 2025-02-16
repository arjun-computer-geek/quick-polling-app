'use client'
import { useState } from 'react';

function CreatePoll({ socket }) {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const pollData = {
            question,
            options: options.map(option => ({ text: option, votes: 0 }))
        };
        socket.emit('createPoll', pollData);
        setQuestion('');
        setOptions(['', '']);
        setSuccessMessage('Poll created successfully!');

        // Clear success message after 3 seconds
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Create New Poll</h2>
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {successMessage}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter your question"
                    className="w-full p-2 border rounded mb-4"
                    required
                />
                {options.map((option, index) => (
                    <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => {
                            const newOptions = [...options];
                            newOptions[index] = e.target.value;
                            setOptions(newOptions);
                        }}
                        placeholder={`Option ${index + 1}`}
                        className="w-full p-2 border rounded mb-2"
                        required
                    />
                ))}
                <button
                    type="button"
                    onClick={() => setOptions([...options, ''])}
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                    Add Option
                </button>
                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                >
                    Create Poll
                </button>
            </form>
        </div>
    );
}

export default CreatePoll;
