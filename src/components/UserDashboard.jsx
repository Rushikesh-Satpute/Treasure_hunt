import React, { useState, useEffect } from 'react';
import { ref, onValue, update, set } from 'firebase/database';
import { database } from '../firebase';
import { getAuth, fetchSignInMethodsForEmail } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom'; 

export default function UserDashboard({ userId }) {
  const [answer, setAnswer] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState({});
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [progress, setProgress] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [setupCompleted, setSetupCompleted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [answerError, setAnswerError] = useState('');
  const navigate = useNavigate();

  const handleNavigateToResult = () => {
    navigate('/result');
  };

  const auth = getAuth();
  useEffect(() => {
    const showResultsRef = ref(database, 'showResults');
    // Listener for Firebase value changes
    onValue(showResultsRef, (snapshot) => {
      const data = snapshot.val();
      setShowResults(data || false); // Set the boolean value
    });
  }, []);

  useEffect(() => {
    // Fetch questions from Firebase
    const questionsRef = ref(database, 'questions/');
    onValue(questionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setQuestions(data);
        setTotalQuestions(Object.keys(data).length);
        // Set the first question ID
        setCurrentQuestionId(Object.keys(data)[0]);
      }
    });
  
    // Fetch user data and progress
    const userRef = ref(database, `users/${userId}`);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUsername(data.username || '');
        setEmail(data.email || '');
        setStartTime(data.startTime || new Date().toISOString());
        setSetupCompleted(!!data.username && !!data.email);
        setQuizCompleted(!!data.progress);

      } else {
        setStartTime(new Date().toISOString());
        setSetupCompleted(false);
        setQuizCompleted(false);
      }
    });
  }, [userId]);
  

  const handleSetupSubmit = async () => {
    if (username && email) {
      try {
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        
        if (signInMethods.length > 0) {
          const userData = {
            username,
            email,
            startTime,
            progress: {}
          };
          await set(ref(database, `users/${userId}`), userData);
          setSetupCompleted(true);
        } else {
          setEmailError('This email is not registered.');
        }
      } catch (error) {
        console.error('Error checking email:', error);
        setEmailError('Error checking email.');
      }
    } else {
      alert('Please enter both username and email.');
    }
  };

  const handleNext = () => {
    if (validateAnswer(answer)) {
      const questionIds = Object.keys(questions);
      const currentIndex = questionIds.indexOf(currentQuestionId);

      if (currentIndex < questionIds.length - 1) {
        const nextQuestionId = questionIds[currentIndex + 1];
        updateUserProgress(currentQuestionId, answer, new Date().toISOString());
        setCurrentQuestionId(nextQuestionId);
        setProgress(progress + 1);
        setAnswer('');
        setAnswerError('');
      } else {
        updateUserProgress(currentQuestionId, answer, new Date().toISOString());
        setIsCompleted(true);
      }
    } else {
      setAnswerError('Your answer is incorrect. Please try again.');
    }
  };

  const validateAnswer = (userAnswer) => {
    const correctAnswers = questions[currentQuestionId]?.answers || [];
    return correctAnswers.some(answer => 
      answer.trim().toLowerCase() === userAnswer.trim().toLowerCase()
    );
  };

  const updateUserProgress = (questionId, answer, endTime) => {
    // Use the actual questionId (e.g., 1726557104792) from the questions list
    const progressRef = ref(database, `users/${userId}/progress/${questionId}`);
    update(progressRef, {
      answer: answer,
      timeTaken: calculateTimeTaken(startTime, endTime)
    });
  };
  

  const calculateTimeTaken = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const timeDiff = end - start; // Time difference in milliseconds
    const seconds = Math.floor(timeDiff / 1000);
    const milliseconds = timeDiff % 1000;
    return { seconds, milliseconds };
  };

  if (!setupCompleted) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-blue-900 to-purple-900">
        <h1 className="text-white text-center text-4xl font-extrabold tracking-wider mt-8">Setup Your Profile</h1>
        <motion.div
          className="w-3/4 md:w-2/5 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 flex flex-col p-6 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full p-4 mb-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full p-4 mb-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          {emailError && (
            <p className="text-red-500 text-center mb-4">{emailError}</p>
          )}
          <button
            onClick={handleSetupSubmit}
            className="text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center transition-all duration-300 ease-in-out transform hover:scale-105 w-full"
          >
            Start Quiz
          </button>
        </motion.div>
      </div>
    );
  }


  if (isCompleted || quizCompleted) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-blue-900 to-purple-900">
        <motion.h1
          className="text-white text-center text-4xl font-extrabold tracking-wider mt-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
        🎉 Congratulations! 🎉
        </motion.h1>
        <motion.p
          className="text-white text-2xl mt-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          You have completed the treasure hunt!
        </motion.p>
         {/* Conditionally render the Result button based on Firebase boolean */}
      {showResults && (
          <button onClick={handleNavigateToResult} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
            View Results
          </button>
      )}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-blue-900 to-purple-900">
      <h1 className="pt-8 text-white text-center text-4xl font-extrabold tracking-wider">Treasure Hunt</h1>
      <motion.div
        className="w-3/4 md:w-2/5 h-max-2/3 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 flex flex-col p-6 mt-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Welcome, {username}
        </h2>
        <div className="relative w-full bg-gray-300 h-4 rounded-full overflow-hidden mb-6">
          <motion.div
            className="absolute top-0 left-0 h-4 bg-blue-600 rounded-full"
            style={{ width: `${(progress / totalQuestions) * 100}%` }}
            animate={{ width: `${(progress / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        {currentQuestionId && (
          <>
            <p className="text-2xl text-white font-medium mb-4">
              {questions[currentQuestionId]?.question || 'Loading...'}
            </p>
            <textarea
              placeholder="Enter your answer here"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-4 mb-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            {answerError && (
              <p className="text-red-500 mb-4">{answerError}</p>
            )}
            <button
              onClick={handleNext}
              className="text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-2.5 text-center transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Next Question
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
