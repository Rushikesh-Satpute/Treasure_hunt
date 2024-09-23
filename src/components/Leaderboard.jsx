import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { debounce } from 'lodash';

export default function Leaderboard() {
  const [usersData, setUsersData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedBy, setSortedBy] = useState('rank');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    const usersRef = ref(database, 'users/');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      setUsersData(data || {});
    });
  }, []);

  const calculateTotalTime = (userId) => {
    const userProgress = usersData[userId]?.progress || {};
    const totalTime = Object.values(userProgress).reduce(
      (acc, q) => acc + (q.timeTaken?.seconds || 0) * 1000 + (q.timeTaken?.milliseconds || 0),
      0
    );
    return {
      seconds: Math.floor(totalTime / 1000),
      milliseconds: totalTime % 1000
    };
  };

  const calculateTotalScore = (userId) => {
    const userProgress = usersData[userId]?.progress || {};
    return Object.values(userProgress).reduce(
      (acc, q) => acc + (q.score || 0),
      0
    );
  };

  const sortedUsers = Object.keys(usersData)
    .filter(userId => usersData[userId]?.username?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const totalTimeA = Object.values(usersData[a]?.progress || {}).reduce(
        (acc, q) => acc + (q.timeTaken?.seconds || 0) * 1000 + (q.timeTaken?.milliseconds || 0),
        0
      );
      const totalTimeB = Object.values(usersData[b]?.progress || {}).reduce(
        (acc, q) => acc + (q.timeTaken?.seconds || 0) * 1000 + (q.timeTaken?.milliseconds || 0),
        0
      );

      switch (sortedBy) {
        case 'rank':
          return calculateTotalScore(b) - calculateTotalScore(a); // Highest score first
        case 'username':
          return (usersData[a]?.username || '').localeCompare(usersData[b]?.username || '');
        case 'time':
          return totalTimeA - totalTimeB;
        default:
          return 0;
      }
    });

  const paginatedUsers = sortedUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleSearch = debounce((event) => {
    setSearchTerm(event.target.value);
  }, 300);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-center text-4xl font-bold mb-6">Leaderboard</h1>

        <div className="mb-6 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by username..."
            onChange={handleSearch}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
          />

          <div className="flex space-x-2">
            <button
              onClick={() => setSortedBy('rank')}
              className={`px-4 py-2 rounded-lg ${sortedBy === 'rank' ? 'bg-blue-600' : 'bg-gray-800'} text-white`}
            >
              Sort by Rank
            </button>
            <button
              onClick={() => setSortedBy('username')}
              className={`px-4 py-2 rounded-lg ${sortedBy === 'username' ? 'bg-blue-600' : 'bg-gray-800'} text-white`}
            >
              Sort by Username
            </button>
            <button
              onClick={() => setSortedBy('time')}
              className={`px-4 py-2 rounded-lg ${sortedBy === 'time' ? 'bg-blue-600' : 'bg-gray-800'} text-white`}
            >
              Sort by Time
            </button>
          </div>
        </div>

        <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
          <table className="w-full text-base text-left text-center text-gray-300 bg-gray-800 rounded-lg">
            <thead className="text-sm text-gray-400 uppercase bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">Rank</th>
                <th scope="col" className="px-6 py-3">Username</th>
                <th scope="col" className="px-6 py-3">Total Time Taken</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((userId, index) => {
                  const { seconds, milliseconds } = calculateTotalTime(userId);
                  const formattedTime = `${seconds}.${milliseconds.toString().padStart(3, '0')} s`;
                  const rowClass = index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700';

                  return (
                    <tr key={userId} className={`${rowClass} border-b hover:bg-gray-600 transition duration-300`}>
                      <td className="px-6 py-4 font-medium text-gray-100">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-100">{usersData[userId]?.username || 'Unknown'}</td>
                      <td className="px-6 py-4 text-gray-300">{formattedTime}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-gray-400 text-center">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-600"
          >
            Previous
          </button>
          <span className="text-white">{`Page ${currentPage}`}</span>
          <button
            onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(sortedUsers.length / rowsPerPage)))}
            disabled={currentPage === Math.ceil(sortedUsers.length / rowsPerPage)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
