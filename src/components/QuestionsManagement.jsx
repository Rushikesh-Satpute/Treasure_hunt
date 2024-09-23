import React, { useEffect, useState } from 'react';
import { ref, onValue, set, remove } from 'firebase/database';
import { database } from '../firebase';
import AddQuestionForm from './AddQuestionForm';
import EditQuestionForm from './EditQuestionForm';
import RemoveQuestionModal from './RemoveQuestionModal';

export default function QuestionsManagement() {
  const [questions, setQuestions] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [editQuestionKey, setEditQuestionKey] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [removeQuestionKey, setRemoveQuestionKey] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  useEffect(() => {
    const questionsRef = ref(database, 'questions/');
    const handleData = (snapshot) => {
      const data = snapshot.val();
      setQuestions(data || {});
    };

    onValue(questionsRef, handleData);

    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleAddQuestion = (newQuestion) => {
    const newQuestions = { ...questions, [newQuestion.key]: newQuestion };
    setQuestions(newQuestions);
    setShowAddModal(false);
    set(ref(database, `questions/${newQuestion.key}`), newQuestion);
  };

  const handleEditQuestion = (updatedQuestion) => {
    const updatedQuestions = { ...questions, [updatedQuestion.key]: updatedQuestion };
    setQuestions(updatedQuestions);
    setShowEditModal(false);
    set(ref(database, `questions/${updatedQuestion.key}`), updatedQuestion);
  };

  const handleRemoveQuestion = () => {
    if (removeQuestionKey) {
      const updatedQuestions = { ...questions };
      delete updatedQuestions[removeQuestionKey];
      setQuestions(updatedQuestions);
      remove(ref(database, `questions/${removeQuestionKey}`));
      setShowRemoveModal(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 min-h-screen">
      <h1 className="text-white text-4xl mb-6">Manage Questions</h1>

      <div className="w-full max-w-6xl mb-8">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700"
        >
          Add New Question
        </button>
        <div className="mt-8">
          <h2 className="text-white text-2xl mb-4">Existing Questions</h2>
          <table className="w-full text-base text-left text-gray-300 bg-gray-800 rounded-lg">
            <thead className="text-sm text-gray-400 uppercase bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">Key</th>
                <th scope="col" className="px-6 py-3">Question</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(questions).map((key) => {
                const question = questions[key];
                return (
                  <tr key={key} className="bg-gray-800 border-b hover:bg-gray-700 transition duration-300">
                    <td className="px-6 py-4 font-medium text-gray-100">{key}</td>
                    <td className="px-6 py-4 font-medium text-gray-100">{question.question}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setEditQuestionKey(key);
                          setShowEditModal(true);
                        }}
                        className="px-2 py-1 bg-yellow-600 text-white rounded-lg shadow-lg hover:bg-yellow-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setRemoveQuestionKey(key);
                          setShowRemoveModal(true);
                        }}
                        className="px-2 py-1 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 ml-2"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AddQuestionForm onAddQuestion={handleAddQuestion} onClose={() => setShowAddModal(false)} />
      )}
      {showEditModal && (
        <EditQuestionForm 
          question={{ key: editQuestionKey, ...questions[editQuestionKey] }} 
          onEditQuestion={handleEditQuestion} 
          onClose={() => setShowEditModal(false)} 
        />
      )}
      {showRemoveModal && (
        <RemoveQuestionModal onRemoveQuestion={handleRemoveQuestion} onClose={() => setShowRemoveModal(false)} />
      )}
    </div>
  );
}
