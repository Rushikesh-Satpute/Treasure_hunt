import React, { useState } from 'react';

export default function AddQuestionForm({ onAddQuestion, onClose }) {
  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState(['']);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Error handling for empty question or answers
    if (questionText.trim() === '' || answers.some(answer => answer.trim() === '')) {
      setError('Please fill in all fields.');
      return;
    }

    const newQuestion = {
      key: Date.now().toString(),
      question: questionText,
      answers: answers.filter(answer => answer.trim() !== ''), // Filter out empty answers
    };

    onAddQuestion(newQuestion);

    // Clear the form fields after submission
    setQuestionText('');
    setAnswers(['']);
    setError(null); // Clear any existing error
  };

  // Handle adding more answer fields
  const addAnswerField = () => {
    setAnswers([...answers, '']);
  };

  // Handle editing individual answer inputs
  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // Handle removing an answer field
  const removeAnswerField = (index) => {
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-white text-2xl mb-4">Add New Question</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="questionText">
              Question Text
            </label>
            <input
              type="text"
              id="questionText"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">Acceptable Answers</label>
            {answers.map((answer, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400"
                  placeholder={`Answer ${index + 1}`}
                />
                {answers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAnswerField(index)}
                    className="ml-2 px-3 py-2 bg-red-600 text-white rounded-lg"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addAnswerField}
              className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              + Add Another Answer
            </button>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-green-600 text-white rounded-lg ${
                questionText.trim() === '' || answers.some(answer => answer.trim() === '')
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              disabled={questionText.trim() === '' || answers.some(answer => answer.trim() === '')}
            >
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
