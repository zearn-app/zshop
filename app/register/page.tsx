"use client";

import React, { useState } from "react";
import { useApp } from "../app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/lib/firebase"; // adjust if path differs

const RegisterPage: React.FC = () => {
  const { goToLogin } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("Registered:", userCredential.user.email);
      alert("Account created!");

      goToLogin(); // redirect after success
    } catch (error: any) {
      console.error(error);

      // Friendly error messages
      if (error.code === "auth/email-already-in-use") {
        alert("Email already in use");
      } else if (error.code === "auth/weak-password") {
        alert("Password should be at least 6 characters");
      } else {
        alert("Registration failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md">
        
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          Create Account
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-yellow-400 text-black py-3 rounded-xl font-semibold hover:bg-yellow-300"
        >
          Register
        </button>

        <button
          onClick={goToLogin}
          className="w-full mt-4 text-gray-400 hover:text-yellow-400"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;