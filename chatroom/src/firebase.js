// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNR6nX-XE52taLbhUFGfNdkOG8r20rmTI",
  authDomain: "chatroomapp17026184.firebaseapp.com",
  projectId: "chatroomapp17026184",
  storageBucket: "chatroomapp17026184.firebasestorage.app",
  messagingSenderId: "444447734987",
  appId: "1:444447734987:web:0aac1a99f0ed7281482f4e",
  measurementId: "G-4S5GYHYTKB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
