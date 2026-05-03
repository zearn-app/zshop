"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useApp } from "../app";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

/**
 * 🔹 Inner component
 */
const HomeContent = () => {
  const searchParams = useSearchParams();
  const { goToLogin, user } = useApp();

  const [message, setMessage] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  // 🎉 Welcome message
  useEffect(() => {
    const type = searchParams.get("type");

    if (type === "register") {
      setMessage("🎉 Welcome! Please complete your profile.");
    } else if (type === "login") {
      setMessage("👋 Welcome back!");
    }
  }, [searchParams]);

  // 🔥 Fetch products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(data);
      setFiltered(data);
    };

    fetchProducts();
  }, []);

  // 🔍 Search filter
  useEffect(() => {
    const result = products.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, products]);

  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged out");
    goToLogin();
  };

  return (
    <>
      {/* 🔝 Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-800">

        {/* 👤 Profile */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm">{user?.email}</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-yellow-400">ZShop</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-400"
        >
          Logout
        </button>
      </nav>

      {/* 🎉 Message */}
      {message && (
        <div className="text-center mt-6">
          <p className="text-yellow-400 text-lg font-semibold">{message}</p>
        </div>
      )}

      {/* 🔍 Search */}
      <div className="px-8 mt-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 outline-none"
        />
      </div>

      {/* 🛍 Products */}
      <div className="px-8 py-10">
        <h3 className="text-2xl font-semibold text-yellow-400 mb-6">
          Products
        </h3>

        {filtered.length === 0 ? (
          <p className="text-gray-400">No products found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-gray-900 p-4 rounded-xl shadow hover:scale-105 transition"
              >
                <div className="h-40 bg-gray-800 rounded mb-4 flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} className="h-full object-cover rounded" />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>

                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-gray-400 text-sm">{item.description}</p>
                <p className="text-yellow-400 font-bold mt-2">₹{item.price}</p>

                <button className="mt-3 w-full bg-yellow-400 text-black py-2 rounded-lg hover:bg-yellow-300">
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

/**
 * 🔹 Main Page
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