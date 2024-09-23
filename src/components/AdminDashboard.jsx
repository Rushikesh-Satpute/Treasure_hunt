import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

export default function AdminDashboard() {
  const [usersData, setUsersData] = useState({});
  const [questionsData, setQuestionsData] = useState({}); // State to store the questions
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // For dialog display

  useEffect(() => {
    const usersRef = ref(database, 'users/');
    const questionsRef = ref(database, 'questions/'); // Reference to the questions

    const handleData = (snapshot) => {
      const data = snapshot.val();
      setUsersData(data || {});
      setLoading(false);
    };

    const handleQuestionsData = (snapshot) => {
      const data = snapshot.val();
      setQuestionsData(data || {});
    };

    const handleError = (error) => {
      console.error(error);
      setError('Failed to load data');
      setLoading(false);
    };

    onValue(usersRef, handleData, handleError);
    onValue(questionsRef, handleQuestionsData, handleError); // Fetch the questions

    return () => {
      // Cleanup if needed
    };
  }, []);

  const calculateTotalTime = (userId) => {
    const totalTime = Object.values(usersData[userId]?.progress || {}).reduce(
      (acc, q) => acc + q.timeTaken.seconds * 1000 + q.timeTaken.milliseconds,
      0
    );
    return {
      seconds: Math.floor(totalTime / 1000),
      milliseconds: totalTime % 1000,
    };
  };

  const sortedUsers = Object.keys(usersData)
    .filter((userId) =>
      usersData[userId].username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const totalTimeA = Object.values(usersData[a]?.progress || {}).reduce(
        (acc, q) => acc + q.timeTaken.seconds * 1000 + q.timeTaken.milliseconds,
        0
      );
      const totalTimeB = Object.values(usersData[b]?.progress || {}).reduce(
        (acc, q) => acc + q.timeTaken.seconds * 1000 + q.timeTaken.milliseconds,
        0
      );
      return totalTimeA - totalTimeB;
    });

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const data = {
    labels: sortedUsers.map((userId) => usersData[userId]?.username || 'Unknown'),
    datasets: [
      {
        label: 'Total Time Taken (s)',
        data: sortedUsers.map((userId) => {
          const totalTime = Object.values(usersData[userId]?.progress || {}).reduce(
            (acc, q) => acc + q.timeTaken.seconds + q.timeTaken.milliseconds / 1000,
            0
          );
          return totalTime;
        }),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
      },
    ],
  };

  const doughnutData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [
          sortedUsers.filter((userId) =>
            Object.values(usersData[userId]?.progress || {}).every((q) => q.timeTaken)
          ).length,
          sortedUsers.length -
            sortedUsers.filter((userId) =>
              Object.values(usersData[userId]?.progress || {}).every((q) => q.timeTaken)
            ).length,
        ],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} s`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        ticks: {
          callback: function (value) {
            return value + ' s';
          },
        },
      },
    },
  };

  const handleSearch = debounce((event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page on new search
  }, 300);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 min-h-screen">
      <h1 className="text-white text-4xl mb-6">Admin Dashboard</h1>
      <div className="w-full max-w-6xl mb-8 flex flex-wrap justify-between gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex-1 min-w-[300px]">
          <h3 className="text-white text-xl font-semibold mb-4">Total Time Taken (Bar Chart)</h3>
          <Bar data={data} options={options} />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex-1 min-w-[300px]">
          <h3 className="text-white text-xl font-semibold mb-4">Completion Status (Doughnut Chart)</h3>
          <Doughnut data={doughnutData} />
        </div>
      </div>

      {loading ? (
        <div className="text-white text-xl">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-xl">{error}</div>
      ) : (
        <div className="w-full max-w-3xl">
          <div className="mb-6 flex justify-between items-center">
            <input
              type="text"
              placeholder="Search by username..."
              onChange={handleSearch}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
            />
            <div>
              <Link to="/manage-questions">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700">
                  Manage Questions
                </button>
              </Link>
            </div>
          </div>
          <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
            <table className="w-full text-base text-left text-gray-300 bg-gray-800 rounded-lg">
              <thead className="text-sm text-gray-400 uppercase bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3">Rank</th>
                  <th scope="col" className="px-6 py-3">Username</th>
                  <th scope="col" className="px-6 py-3">Total Time Taken</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((userId, index) => {
                  const { seconds, milliseconds } = calculateTotalTime(userId);
                  const formattedTime = `${seconds}.${milliseconds.toString().padStart(3, '0')} s`;
                  const rowClass = index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700';

                  return (
                    <tr
                      key={userId}
                      className={`${rowClass} border-b hover:bg-gray-600 transition duration-300`}
                      onClick={() => setSelectedUser(userId)}
                    >
                      <td className="px-6 py-3">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                      <td className="px-6 py-3">{usersData[userId]?.username || 'Unknown'}</td>
                      <td className="px-6 py-3">{formattedTime}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 mr-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-300"
            >
              Previous
            </button>
            <span className="text-white">
              Page {currentPage} of {Math.ceil(sortedUsers.length / rowsPerPage)}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(sortedUsers.length / rowsPerPage)))
              }
              className="px-4 py-2 ml-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-300"
            >
              Next
            </button>
          </div>

          {/* Dialog for showing user details */}
          {selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative w-full max-w-3xl">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h3 className="text-xl text-white font-semibold mb-4">
                  {usersData[selectedUser]?.username}'s Answers
                </h3>
                <table className="w-full text-left text-gray-300">
                  <thead className="text-gray-400 uppercase text-xs bg-gray-700">
                    <tr>
                      <th scope="col" className="px-4 py-2">Question</th>
                      <th scope="col" className="px-4 py-2">Answer</th>
                      <th scope="col" className="px-4 py-2">Time Taken</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(usersData[selectedUser]?.progress || {}).map((questionId) => {
                      const progress = usersData[selectedUser].progress[questionId];
                      
                      const questionText = questionsData[questionId]?.question || 'Unknown Question';
                      const { seconds, milliseconds } = progress.timeTaken;
                      const formattedTime = `${seconds}.${milliseconds.toString().padStart(3, '0')} s`;

                      return (
                        <tr key={questionId} className="border-b border-gray-700">
                          <td className="px-4 py-2">{questionText}</td>
                          <td className="px-4 py-2">{progress.answer || 'No Answer'}</td>
                          <td className="px-4 py-2">{formattedTime}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
