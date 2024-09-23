import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ userRole, handleLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutClick = () => {
    handleLogout(); // Call the logout handler passed as props
    navigate('/');  // Redirect to the login page after logout
  };

  return (
    <nav className="sticky top-0 duration-500 backdrop-blur flex-none bg-slate-800 supports-backdrop-blur:bg-white/60 border-b border-slate-50/10">
      <div className="container px-6 py-4 mx-auto">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              {/* <h1 className="text-white text-xl font-medium">Treasure Hunt</h1> */}
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
                {userRole ? (userRole === 'admin' ? 'Admin Dashboard' : 'User Dashboard') : 'Treasure Hunt'}
              </span>
            </Link>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                type="button"
                className="text-gray-200 hover:text-gray-400 focus:outline-none"
                aria-label="toggle menu"
                onClick={handleToggle}>
                {isOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`${isOpen ? 'block' : 'hidden'
              } lg:flex lg:items-center lg:space-x-6 absolute lg:relative inset-x-0 lg:inset-auto z-20 w-full lg:w-auto px-6 py-4 lg:p-0 bg-slate-900 lg:bg-transparent transition-all duration-300 ease-in-out`}>
            
            {/* Conditional Links */}
            {userRole === 'admin' && (
              <>
                <Link
                  to="/admin"
                  className="px-3 py-2 mx-3 mt-2 transition-colors duration-300 transform rounded-md lg:mt-0 text-gray-200 hover:bg-gray-700">
                  Admin Dashboard
                </Link>
                <Link
                  to="/leaderboard"
                  className="px-3 py-2 mx-3 mt-2 transition-colors duration-300 transform rounded-md lg:mt-0 text-gray-200 hover:bg-gray-700">
                  Leaderboard
                </Link>
              </>
            )}
            {userRole === 'user' && (
              <Link
                  to="/user"
                  className="px-3 py-2 mx-3 mt-2 transition-colors duration-300 transform rounded-md lg:mt-0 text-gray-200 hover:bg-gray-700">
                  Home
                </Link>
            )}

            {/* Login / Logout Button */}
            {userRole ? (
              <button
                onClick={handleLogoutClick}
                className="px-3 py-2 mx-3 mt-2 transition-colors duration-300 transform rounded-md lg:mt-0 text-gray-200 bg-red-500 hover:bg-red-600">
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 mx-3 mt-2 transition-colors duration-300 transform rounded-md lg:mt-0 text-gray-200 hover:bg-gray-700">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
