"use client";

import React from "react";
import { useApp } from "../app";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const DashboardPage: React.FC = () => {
  const { goToLogin } = useApp();

  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged out");
    goToLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-6">

      {/* 🔝 Navbar */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-yellow-400">ZShop Dashboard</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-400"
        >
          Logout
        </button>
      </div>

      {/* 📊 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-gray-900 p-6 rounded-xl shadow">
          <h3 className="text-gray-400">Total Orders</h3>
          <p className="text-2xl font-bold text-yellow-400 mt-2">1,245</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow">
          <h3 className="text-gray-400">Revenue</h3>
          <p className="text-2xl font-bold text-green-400 mt-2">₹2,45,000</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow">
          <h3 className="text-gray-400">Users</h3>
          <p className="text-2xl font-bold text-blue-400 mt-2">890</p>
        </div>

      </div>

      {/* 🛒 Products Section */}
      <div className="bg-gray-900 p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">
          Recent Products
        </h2>

        <div className="space-y-4">

          <div className="flex justify-between items-center border-b border-gray-700 pb-3">
            <div>
              <p className="font-semibold">Wireless Headphones</p>
              <p className="text-gray-400 text-sm">₹2,999</p>
            </div>
            <button className="text-yellow-400 hover:underline">
              View
            </button>
          </div>

          <div className="flex justify-between items-center border-b border-gray-700 pb-3">
            <div>
              <p className="font-semibold">Smart Watch</p>
              <p className="text-gray-400 text-sm">₹4,499</p>
            </div>
            <button className="text-yellow-400 hover:underline">
              View
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Gaming Mouse</p>
              <p className="text-gray-400 text-sm">₹1,299</p>
            </div>
            <button className="text-yellow-400 hover:underline">
              View
            </button>
          </div>

        </div>
      </div>

      {/* ⚡ Quick Actions */}
      <div className="bg-gray-900 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300">
            Add Product
          </button>

          <button className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-400">
            View Orders
          </button>

          <button className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-400">
            Manage Users
          </button>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
