"use client";

import React, { useState } from "react";
import { useApp } from "../app";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

const RegisterPage: React.FC = () => {
  const { goToHome, goBack, goToLogin } = useApp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      // 🔐 Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 👤 Set display name
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      console.log("Registered:", userCredential.user.email);

      alert("Account created successfully 🎉");

      // 👉 Redirect to home with register message
      goToHome("?type=register");

    } catch (error: any) {
      console.error("REGISTER ERROR:", error);

      switch (error.code) {
        case "auth/email-already-in-use":
          alert("Email already in use");
          break;
        case "auth/invalid-email":
          alert("Invalid email format");
          break;
        case "auth/weak-password":
          alert("Weak password (min 6 characters)");
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
          Create Account
        </h2>

        {/* 👤 Name */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* 📧 Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* 🔒 Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* 🚀 Register Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-yellow-400 text-black py-3 rounded-xl font-semibold hover:bg-yellow-300 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        {/* 🔁 Navigation */}
        <button
          onClick={goToLogin}
          className="w-full mt-4 text-gray-400 hover:text-yellow-400"
        >
          Already have an account? Login
        </button>

        <button
          onClick={goBack}
          className="w-full mt-2 text-gray-500 hover:text-yellow-400"
        >
          ← Back
        </button>

      </div>
    </div>
  );
};

export default RegisterPage;