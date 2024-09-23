import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ResultsPage() {
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    const usersRef = ref(database, 'users/');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Sort users by total time and take the top 3
        const sortedWinners = Object.keys(data)
          .sort((a, b) => {
            const timeA = calculateTotalTime(a, data);
            const timeB = calculateTotalTime(b, data);
            return timeA.totalMilliseconds - timeB.totalMilliseconds;
          })
          .slice(0, 3) // Top 3 winners
          .map(userId => ({
            userId,
            username: data[userId]?.username || 'Unknown',
            time: calculateTotalTime(userId, data)
          }));
        setWinners(sortedWinners);
      }
    });
  }, []);

  const calculateTotalTime = (userId, data) => {
    const userProgress = data[userId]?.progress || {};
    const totalMilliseconds = Object.values(userProgress).reduce(
      (acc, q) => acc + (q.timeTaken?.seconds || 0) * 1000 + (q.timeTaken?.milliseconds || 0),
      0
    );
    return {
      totalMilliseconds,
      seconds: Math.floor(totalMilliseconds / 1000),
      milliseconds: totalMilliseconds % 1000
    };
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-10">
      <h1 className="text-5xl font-bold mb-10 bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text">
        🏆 Top 3 Winners 🏆
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {winners.map((winner, index) => (
          <motion.div
            key={winner.userId}
            className={`p-8 bg-gray-800 rounded-xl shadow-lg transform transition hover:scale-105 ${
              index === 0 ? 'border-4 border-yellow-500' : index === 1 ? 'border-4 border-gray-400' : 'border-4 border-brown-500'
            }`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * index, duration: 0.5 }}
          >
            <div className="text-6xl mb-4">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
            <h2 className="text-3xl font-bold">{winner.username}</h2>
            <p className="text-lg text-gray-500 mt-2">
              Time: {winner.time.seconds}.{winner.time.milliseconds.toString().padStart(3, '0')}s
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-12">
        <Link
          to="/leaderboard"
          className="text-lg bg-blue-500 px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          whileHover={{ scale: 1.1 }}
        >
          View Full Leaderboard
        </Link>
      </div>
    </div>
  );
}
