import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '../firebase'; // Make sure this is your Firebase auth file
import { useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database'; // Import Firebase Realtime Database functions

export default function Login({ setUserRole, setUserId }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        setUserId(user.uid); // Set the userId

        try {
          // Fetch user data from Firebase

          
            const adminsRef = ref(database, 'admins');
            const adminsSnapshot = await get(adminsRef);
            const adminsData = adminsSnapshot.val();

            // Check if the user's email is in the admins list
            const isAdmin = adminsData.some(admin => admin?.email.toLowerCase() === email.toLowerCase());
            const role = isAdmin ? 'admin' : 'user'; // Assign role based on email
            setUserRole(role); // Set the user role

            // Navigate based on the role
            if (role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/main'); // or wherever you want to direct regular users
            }
        } catch (error) {
          setError('Error fetching user role.');
          console.error('Role fetch error: ', error.message);
          navigate('/login'); // Optional: redirect to login or error page
        }
      })
      .catch((error) => {
        setError('Failed to login. Please check your credentials and try again.');
        console.error('Login error: ', error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white">Login to Treasure Hunt</h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-4 text-xl font-semibold text-white ${loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'} rounded-md focus:outline-none focus:ring-4 focus:ring-blue-300`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        {/* Redirect to Sign-up */}
        <p className="text-center text-gray-400">
          Don't have an account?{' '}
          <a href="/contact" className="text-blue-500 hover:underline">Contact</a>
        </p>
      </div>
    </div>
  );
}
