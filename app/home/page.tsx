"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useApp } from "../app";
import { useSearchParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

/**
 * 🔹 Product Type
 */
type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
};

/**
 * 🔹 Inner component
 */
const HomeContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { goToLogin } = useApp();

  const [message, setMessage] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("default");

  const user = null; // kept UI unchanged (no logout/email display)

  /* ================= WELCOME MESSAGE ================= */

  useEffect(() => {
    const type = searchParams.get("type");

    if (type === "register") setMessage("🎉 Welcome! Please complete your profile.");
    else if (type === "login") setMessage("👋 Welcome back!");
  }, [searchParams]);

  /* ================= FETCH PRODUCTS ================= */

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));

      const data: Product[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, "id">),
      }));

      setProducts(data);
      setFiltered(data);
    };

    fetchProducts();
  }, []);

  /* ================= SEARCH + FILTER ================= */

  useEffect(() => {
    let result = products.filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase())
    );

    // 🔽 FILTER OPTIONS
    if (filter === "low-high") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (filter === "high-low") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (filter === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    setFiltered(result);
  }, [search, products, filter]);

  /* ================= UI ================= */

  return (
    <>
      {/* 🔝 NAVBAR (NO EMAIL, NO LOGOUT) */}
      <nav className="flex justify-center items-center px-8 py-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-yellow-400">ZShop</h1>
      </nav>

      {/* 👤 PROFILE CLICK AREA */}
      <div
        onClick={() => router.push("/profile")}
        className="absolute top-4 left-4 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold cursor-pointer"
        title="Profile"
      >
        U
      </div>

      {/* 🎉 MESSAGE */}
      {message && (
        <div className="text-center mt-6">
          <p className="text-yellow-400 text-lg font-semibold">{message}</p>
        </div>
      )}

      {/* 🔍 SEARCH + FILTER */}
      <div className="px-8 mt-6 flex gap-3">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 outline-none"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-3 bg-gray-900 border border-gray-700 rounded-lg"
        >
          <option value="default">Default</option>
          <option value="name">Name A-Z</option>
          <option value="low-high">Price Low → High</option>
          <option value="high-low">Price High → Low</option>
        </select>
      </div>

      {/* 🛍 PRODUCTS */}
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
                onClick={() => router.push(`/product/${item.id}`)}
                className="bg-gray-900 p-4 rounded-xl shadow hover:scale-105 transition cursor-pointer"
              >
                <div className="h-40 bg-gray-800 rounded mb-4 flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      className="h-full object-cover rounded"
                      alt={item.name}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>

                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-gray-400 text-sm">
                  {item.description || "No description"}
                </p>
                <p className="text-yellow-400 font-bold mt-2">
                  ₹{item.price}
                </p>

                <button className="mt-3 w-full bg-yellow-400 text-black py-2 rounded-lg hover:bg-yellow-300">
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🛒 CART BUTTON (BOTTOM LEFT FIXED) */}
      <button
        onClick={() => router.push("/cart")}
        className="fixed bottom-5 left-5 bg-yellow-400 text-black px-5 py-3 rounded-full shadow-lg hover:bg-yellow-300"
      >
        🛒 Cart
      </button>
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