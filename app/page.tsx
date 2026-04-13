"use client";

import React from "react";
import { useRouter } from "next/navigation";

const LandingPage: React.FC = () => {
  const router = useRouter(); // ✅ move here

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-bold text-yellow-400">ZShop</h1>
        <div className="space-x-6 hidden md:block">
          <button className="hover:text-yellow-400">Features</button>
          <button className="hover:text-yellow-400">How it works</button>
          <button className="hover:text-yellow-400">Contact</button>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-semibold hover:bg-yellow-300"
        >
          Login
        </button>
      </nav>

      {/* Rest of your UI unchanged */}
    </div>
  );
};

export default LandingPage;