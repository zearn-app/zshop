// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOU5TRy80JkKhWEwbNIe9Ei5-e_QztN3k",
  authDomain: "zearn-app.firebaseapp.com",
  projectId: "zearn-app",
  storageBucket: "zearn-app.firebasestorage.app",
  messagingSenderId: "212045636123",
  appId: "1:212045636123:web:5e33abc702b87096050ebe",
  measurementId: "G-EHVDRFXH5G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
