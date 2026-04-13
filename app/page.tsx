
"use client";

import React from "react";
import { useRouter } from "next/navigation";


const router = useRouter();


const LandingPage: React.FC = () => {
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

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center mt-20 px-6">
        <h2 className="text-4xl md:text-6xl font-bold leading-tight">
          Compare. Save. Shop Smarter.
        </h2>

        <p className="mt-6 text-gray-300 max-w-xl">
          Instantly compare prices from multiple eCommerce platforms in one place.
          Never overpay again.
        </p>

        {/* Search Box */}
        <div className="mt-8 flex w-full max-w-xl bg-white rounded-2xl overflow-hidden shadow-lg">
          <input
            type="text"
            placeholder="Search for anything..."
            className="flex-1 px-4 py-3 text-black outline-none"
          />
          <button className="bg-yellow-400 px-6 text-black font-semibold hover:bg-yellow-300">
            Compare
          </button>
        </div>

        {/* CTA */}
        <button className="mt-6 border border-yellow-400 px-6 py-3 rounded-xl hover:bg-yellow-400 hover:text-black transition">
          Explore Deals
        </button>
      </section>

      {/* Features Section */}
      <section className="mt-28 px-8 grid md:grid-cols-3 gap-8 text-center">
        <div className="p-6 bg-gray-900 rounded-2xl shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-semibold text-yellow-400">
            Real-Time Price Comparison
          </h3>
          <p className="mt-3 text-gray-400">
            Get live prices from top shopping platforms instantly.
          </p>
        </div>

        <div className="p-6 bg-gray-900 rounded-2xl shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-semibold text-yellow-400">
            Best Deals Finder
          </h3>
          <p className="mt-3 text-gray-400">
            Automatically find the cheapest option for any product.
          </p>
        </div>

        <div className="p-6 bg-gray-900 rounded-2xl shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-semibold text-yellow-400">
            Multi-Site Tracking
          </h3>
          <p className="mt-3 text-gray-400">
            Compare across Amazon, Flipkart, and more in seconds.
          </p>
        </div>
      </section>

      {/* Trust Section */}
      <section className="mt-24 text-center px-6">
        <h3 className="text-2xl font-semibold">
          Trusted by Smart Shoppers
        </h3>
        <p className="mt-4 text-gray-400">
          Thousands of users save money daily using ZShop.
        </p>
      </section>

      {/* Footer */}
      <footer className="mt-24 py-6 text-center text-gray-500 border-t border-gray-700">
        © 2026 ZShop. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;