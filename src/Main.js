import React from 'react';
import { Link } from 'react-router-dom';

export default function Main() {
  return (
    <div className='flex flex-col justify-center items-center h-screen bg-gradient-to-r from-blue-900 to-purple-900'>
      <h1 className="pt-8 text-white text-center text-4xl font-extrabold tracking-wider">Treasure Hunt</h1>
      <div className="w-3/4 md:w-2/5 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 flex flex-col p-6 mt-6">
        <p className="my-8 text-2xl font-semibold text-gray-900 dark:text-white">
          Welcome to the Online Treasure Hunt! Get ready for the challenge.
        </p>
        <Link to="/user" className="text-white bg-blue-700 w-full hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xl px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Start the Hunt
        </Link>
      </div>
    </div>
  );
}
