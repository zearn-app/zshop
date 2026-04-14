import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // ✅ ADD THIS
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBOU5TRy80JkKhWEwbNIe9Ei5-e_QztN3k",
  authDomain: "zearn-app.firebaseapp.com",
  projectId: "zearn-app",
  storageBucket: "zearn-app.firebasestorage.app",
  messagingSenderId: "212045636123",
  appId: "1:212045636123:web:5e33abc702b87096050ebe",
  measurementId: "G-EHVDRFXH5G"
};

const app = initializeApp(firebaseConfig);

// ⚠️ Optional (can remove if errorb  later)
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export const db = getFirestore(app); // ✅ Now works

export const auth = getAuth(app);

