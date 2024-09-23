import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAs3WPPGaOEPebm7UtpEhnu3uERoTnUo4g",
    authDomain: "chating-app-3558.firebaseapp.com",
    databaseURL: "https://chating-app-3558.firebaseio.com",
    projectId: "chating-app-3558",
    storageBucket: "chating-app-3558.appspot.com",
    messagingSenderId: "1028808315676",
    appId: "1:1028808315676:web:0441b888f265bdcb07a0d9",
    measurementId: "G-84KBTH4YD9"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth };
