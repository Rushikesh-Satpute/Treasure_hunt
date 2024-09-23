import React, { useState } from 'react';

export default function Footer() {

  return (
    <section className="py-10 bg-slate-900 border-t border-slate-50/10 sm:pt-16 lg:pt-24">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-12 md:gap-x-12">
          <div>
            <p className="text-base text-gray-500">Links</p>
            <ul className="mt-8 space-y-4">
              <li>
                <a
                  href="/dashboard"
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-base text-white transition-all duration-200 hover:text-opacity-80"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            {/* Empty div for spacing */}
          </div>

          <div className="flex flex-col items-center md:items-end">
            <p className="text-base text-gray-500">Connect with Us</p>
            <ul className="flex items-center mt-8 space-x-3">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center text-white transition-all duration-200 bg-transparent border border-gray-700 rounded-full w-8 h-8 hover:bg-blue-600 hover:border-blue-600"
                >
                  {/* Facebook Icon */}
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M13.5 2h-3C6.486 2 4 4.486 4 7.5V10H1v4h3v8h4v-8h3l1-4h-4V7.5C8 6.673 8.673 6 9.5 6H13V2z" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center text-white transition-all duration-200 bg-transparent border border-gray-700 rounded-full w-8 h-8 hover:bg-blue-400 hover:border-blue-400"
                >
                  {/* Twitter Icon */}
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 4.557a9.9 9.9 0 01-2.828.775A4.932 4.932 0 0023.337 3a9.864 9.864 0 01-3.127 1.195A4.92 4.92 0 0016.616 2c-2.724 0-4.927 2.202-4.927 4.924 0 .386.045.762.127 1.124C7.691 7.822 4.066 5.847 1.64 2.92a4.822 4.822 0 00-.666 2.475c0 1.708.87 3.213 2.188 4.096a4.904 4.904 0 01-2.23-.616v.062c0 2.385 1.697 4.374 3.946 4.828a4.897 4.897 0 01-2.224.084c.628 1.956 2.444 3.38 4.6 3.42A9.867 9.867 0 010 19.54a13.94 13.94 0 007.548 2.212c9.056 0 14.01-7.5 14.01-14.01 0-.213 0-.425-.015-.637A10.005 10.005 0 0024 4.557z" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center text-white transition-all duration-200 bg-transparent border border-gray-700 rounded-full w-8 h-8 hover:bg-pink-500 hover:border-pink-500"
                >
                  {/* Instagram Icon */}
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.338 3.608 1.313.975.975 1.25 2.242 1.313 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.338 2.633-1.313 3.608-.975.975-2.242 1.25-3.608 1.313-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.338-3.608-1.313-.975-.975-1.25-2.242-1.313-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.338-2.633 1.313-3.608.975-.975 2.242-1.25 3.608-1.313C8.416 2.175 8.796 2.163 12 2.163zM12 0C8.741 0 8.332.013 7.052.072 5.771.13 4.62.358 3.633 1.344 2.647 2.331 2.419 3.482 2.361 4.763.013 8.333 0 8.741 0 12s.013 3.667.072 4.948c.058 1.281.286 2.432 1.272 3.419.987.987 2.138 1.215 3.419 1.272C8.333 23.987 8.741 24 12 24s3.667-.013 4.948-.072c1.281-.058 2.432-.286 3.419-1.272.987-.987 1.215-2.138 1.272-3.419.059-1.281.072-1.69.072-4.948s-.013-3.667-.072-4.948c-.058-1.281-.286-2.432-1.272-3.419C19.38.358 18.229.13 16.948.072 15.667.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 100-2.881 1.44 1.44 0 000 2.881z" />
                  </svg>
                </a>
              </li>
            </ul>
            <img
              src="./cesa.png"
              className="h-32 mt-4"
              alt="CESA Logo"
            />
          </div>
        </div>

        <hr className="mt-16 mb-10 border-gray-800" />

        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-2xl font-semibold ml-2 text-white">
              Online Treasure Hunt
            </span>
          </div>

          <p className="text-sm text-gray-100 text-center md:text-left">
            © 2024, All Rights Reserved by{' '}
            <strong>CESA - Computer Engineering Student Association</strong>.
          </p>
        </div>

        <p className="mt-4 text-sm text-gray-100 text-center">
          Treasure Hunt organized by{' '}
          <strong>
            Computer Department of JSPM'S Jayawantrao Sawant College of Engineering, Pune
          </strong>
          .
        </p>

        
      </div>
    </section>
  );
}
