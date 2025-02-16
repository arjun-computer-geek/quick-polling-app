function PollList({ polls, socket }) {
    const handleVote = (pollId, optionIndex) => {
        socket.emit('vote', { pollId, optionIndex });
    };

    const calculatePercentage = (votes, totalVotes) => {
        if (totalVotes === 0) return 0;
        return (votes / totalVotes) * 100;
    };

    return (
        <div className="grid gap-6">
            {polls.map(poll => {
                const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

                return (
                    <div key={poll._id} className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4">{poll.question}</h3>
                        <div className="space-y-3">
                            {poll.options.map((option, index) => {
                                const percentage = calculatePercentage(option.votes, totalVotes);

                                return (
                                    <div key={index} className="relative w-full bg-gray-200 rounded-lg">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-indigo-200 rounded-lg transition-all duration-300 ease-in-out"
                                            style={{ width: `${percentage}%` }}
                                        />
                                        <button
                                            onClick={() => handleVote(poll._id, index)}
                                            className="relative z-10 w-full p-3 text-left hover:bg-indigo-100 transition-colors"
                                        >
                                            <span className="flex justify-between">
                                                <span>{option.text}</span>
                                                <span>{option.votes} votes ({percentage.toFixed(1)}%)</span>
                                            </span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default PollList;
