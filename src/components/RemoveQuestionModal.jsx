import React from 'react';

export default function RemoveQuestionModal({ onRemoveQuestion, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-white text-2xl mb-4">Confirm Removal</h2>
        <p className="text-gray-300 mb-4">Are you sure you want to remove this question?</p>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg mr-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onRemoveQuestion}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Remove Question
          </button>
        </div>
      </div>
    </div>
  );
}
