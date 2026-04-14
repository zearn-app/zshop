"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useApp } from "../app";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useSearchParams } from "next/navigation";

/**
 * 🔹 Inner component (uses search params)
 */
const HomeContent = () => {
  const searchParams = useSearchParams();
  const { goToLogin } = useApp();

  const [message, setMessage] = useState("");

  useEffect(() => {
    const type = searchParams.get("type");

    if (type === "register") {
      setMessage("🎉 Welcome! Please complete your profile.");
    } else if (type === "login") {
      setMessage("👋 Welcome back!");
    }
  }, [searchParams]);

  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged out");
    goToLogin();
  };

  return (
    <>
      {/* 🔝 Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-yellow-400">ZShop</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-400"
        >
          Logout
        </button>
      </nav>

      {/* 🎉 Welcome Message */}
      {message && (
        <div className="text-center mt-6">
          <p className="text-yellow-400 text-lg font-semibold">{message}</p>
        </div>
      )}

      {/* 🛍 Hero Section */}
      <div className="text-center py-16 px-6">
        <h2 className="text-4xl font-bold mb-4">
          Welcome to <span className="text-yellow-400">ZShop</span>
        </h2>
        <p className="text-gray-400 mb-6">
          Discover amazing products at the best prices
        </p>

        <button className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300">
          Shop Now
        </button>
      </div>

      {/* 🛒 Product Grid */}
      <div className="px-8 pb-12">
        <h3 className="text-2xl font-semibold text-yellow-400 mb-6">
          Featured Products
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          <div className="bg-gray-900 p-4 rounded-xl shadow hover:scale-105 transition">
            <div className="h-40 bg-gray-800 rounded mb-4"></div>
            <h4 className="font-semibold">Wireless Headphones</h4>
            <p className="text-gray-400 text-sm">High quality sound</p>
            <p className="text-yellow-400 font-bold mt-2">₹2,999</p>
            <button className="mt-3 w-full bg-yellow-400 text-black py-2 rounded-lg hover:bg-yellow-300">
              Buy Now
            </button>
          </div>

          <div className="bg-gray-900 p-4 rounded-xl shadow hover:scale-105 transition">
            <div className="h-40 bg-gray-800 rounded mb-4"></div>
            <h4 className="font-semibold">Smart Watch</h4>
            <p className="text-gray-400 text-sm">Track your fitness</p>
            <p className="text-yellow-400 font-bold mt-2">₹4,499</p>
            <button className="mt-3 w-full bg-yellow-400 text-black py-2 rounded-lg hover:bg-yellow-300">
              Buy Now
            </button>
          </div>

          <div className="bg-gray-900 p-4 rounded-xl shadow hover:scale-105 transition">
            <div className="h-40 bg-gray-800 rounded mb-4"></div>
            <h4 className="font-semibold">Gaming Mouse</h4>
            <p className="text-gray-400 text-sm">Ultra fast response</p>
            <p className="text-yellow-400 font-bold mt-2">₹1,299</p>
            <button className="mt-3 w-full bg-yellow-400 text-black py-2 rounded-lg hover:bg-yellow-300">
              Buy Now
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

/**
 * 🔹 Main Page with Suspense
 */
const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
        <HomeContent />
      </Suspense>
    </div>
  );
};

export default HomePage;