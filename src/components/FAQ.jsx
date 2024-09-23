import React from 'react';

export default function FAQ() {
  const faqItems = [
    {
      question: 'What is the Online Treasure Hunt?',
      answer: 'The Online Treasure Hunt is an exciting game where participants solve puzzles and challenges to progress to the next level and win rewards.',
    },
    {
      question: 'How do I register for the event?',
      answer: 'You can register for the event by visiting the registration page and filling in the necessary details. Once registered, you will receive a confirmation email.',
    },
    {
      question: 'Who can participate?',
      answer: 'Anyone who is interested can participate in the treasure hunt, regardless of age or experience level.',
    },
    {
      question: 'What is the time limit for each level?',
      answer: 'Each level has a specific time limit, which will be mentioned on the page before you start the level.',
    },
    {
      question: 'How do I contact support if I have an issue?',
      answer: 'You can contact us through the Contact Us page, and we’ll be happy to assist you with any issues or questions you have.',
    },
  ];

  return (
    <section className="py-10 bg-gray-900">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <h2 className="text-3xl font-bold text-center text-white">Frequently Asked Questions</h2>
        <p className="mt-4 text-center text-gray-300">Find answers to common questions about the Treasure Hunt event.</p>

        <div className="mt-8 space-y-6 max-w-4xl mx-auto">
          {faqItems.map((item, index) => (
            <div key={index} className="p-4 bg-gray-800 rounded-md shadow-md">
              <h3 className="text-xl font-semibold text-gray-100">{item.question}</h3>
              <p className="mt-2 text-gray-300">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
    