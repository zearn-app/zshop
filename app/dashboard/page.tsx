"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "../app";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

/* ========= TYPES ========= */

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
};

type CartItem = Product & {
  qty: number;
};

/* ========= CART ========= */

const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("cart");
  return data ? JSON.parse(data) : [];
};

const saveCart = (cart: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

/* ========= COMPONENT ========= */

const DashboardPage: React.FC = () => {
  const { goToLogin } = useApp();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("default");
  const [cartCount, setCartCount] = useState(0);

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged out");
    goToLogin();
  };

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

  /* ================= CART COUNT ================= */

  useEffect(() => {
    const cart = getCart();
    setCartCount(cart.reduce((sum, item) => sum + item.qty, 0));
  }, []);

  /* ================= SEARCH + FILTER ================= */

  useEffect(() => {
    let result = products.filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (filter === "low-high") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (filter === "high-low") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (filter === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    setFiltered(result);
  }, [search, filter, products]);

  /* ================= ADD TO CART ================= */

  const addToCart = (product: Product) => {
    const cart = getCart();

    const index = cart.findIndex((item) => item.id === product.id);

    if (index > -1) cart[index].qty += 1;
    else cart.push({ ...product, qty: 1 });

    saveCart(cart);
    setCartCount(cart.reduce((sum, item) => sum + item.qty, 0));
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-6">

      {/* 🔝 Navbar */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-yellow-400">Z-Shop</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-400"
        >
          Logout
        </button>
      </div>

      {/* 🔍 SEARCH + FILTER */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {filtered.length === 0 ? (
          <p className="text-gray-400">No products found</p>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900 p-4 rounded-xl shadow hover:scale-105 transition"
            >
              <div
                onClick={() => router.push(`/product/${item.id}`)}
                className="h-40 bg-gray-800 rounded mb-4 flex items-center justify-center cursor-pointer"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    className="h-full object-cover rounded"
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

              <button
                onClick={() => addToCart(item)}
                className="mt-3 w-full bg-yellow-400 text-black py-2 rounded-lg hover:bg-yellow-300"
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>

      {/* 🛒 FLOATING CART */}
      <button
        onClick={() => router.push("/cart")}
        className="fixed bottom-5 left-5 z-[9999] bg-yellow-400 text-black px-5 py-3 rounded-full shadow-lg"
      >
        🛒 Cart

        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default DashboardPage;