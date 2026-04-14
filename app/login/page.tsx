"use client";

import React, { useState } from "react";
import { useApp } from "../app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const LoginPage: React.FC = () => {
  const { goToHome, goBack } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("Logged in:", userCredential.user.email);

      alert("Login successful!");
      goToHome(); // redirect after login
    } catch (error: any) {
      console.error("LOGIN ERROR:", error);

      // Friendly error handling
      switch (error.code) {
        case "auth/user-not-found":
          alert("No account found with this email");
          break;
        case "auth/wrong-password":
          alert("Incorrect password");
          break;
        case "auth/invalid-email":
          alert("Invalid email format");
          break;
        case "auth/too-many-requests":
          alert("Too many attempts. Try again later");
          break;
        default:
          alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">

      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          Login to ZShop
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-yellow-400 text-black py-3 rounded-xl font-semibold hover:bg-yellow-300 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          onClick={goBack}
          className="w-full mt-4 text-gray-400 hover:text-yellow-400"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default LoginPage;