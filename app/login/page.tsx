"use client";

import React, { useState } from "react";
import { useApp } from "./app"; // adjust path if needed

const LoginPage: React.FC = () => {
  const { goToDashboard, goBack } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // 👉 Replace this with real auth logic
    if (email && password) {
      console.log("Logged in:", email);

      // redirect after login
      goToDashboard();
    } else {
      alert("Please enter email and password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">

      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md">

        {/* Title */}
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          Login to ZShop
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-yellow-400 text-black py-3 rounded-xl font-semibold hover:bg-yellow-300"
        >
          Login
        </button>

        {/* Back */}
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
