import React, { useState } from 'react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Your message has been sent!');
  };

  return (
    <section className="py-10 bg-gray-900">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <h2 className="text-3xl font-bold text-center text-white">Contact Us</h2>
        <p className="mt-4 text-center text-gray-300">
          We’d love to hear from you! Send us a message and we’ll respond as soon as possible.
        </p>

        <div className="mt-8 max-w-lg mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 mt-1 bg-gray-800 border border-gray-700 rounded-md text-gray-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 mt-1 bg-gray-800 border border-gray-700 rounded-md text-gray-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300" htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 mt-1 bg-gray-800 border border-gray-700 rounded-md h-32 text-gray-300"
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-500"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
