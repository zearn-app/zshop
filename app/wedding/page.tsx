"use client";

import React from "react";

const WeddingInvitation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-200 to-pink-300 flex items-center justify-center p-6">
      
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 text-center">

        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold text-rose-600 mb-4">
          Wedding Invitation
        </h1>

        <p className="text-gray-600 mb-6">
          Together with their families
        </p>

        {/* Couple Names */}
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
          Dhilip 💖 Partner Name
        </h2>

        <p className="text-gray-500 mb-6">
          Request the pleasure of your presence at their wedding ceremony
        </p>

        {/* Date & Time */}
        <div className="bg-rose-100 rounded-xl p-4 mb-6">
          <p className="text-lg font-semibold text-gray-700">
            📅 Date: 20th May 2026
          </p>
          <p className="text-lg font-semibold text-gray-700">
            ⏰ Time: 10:00 AM
          </p>
        </div>

        {/* Venue */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            📍 Venue
          </h3>
          <p className="text-gray-600">
            Sri Mahal Wedding Hall,<br />
            Kattur, Tamil Nadu
          </p>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-300"></div>

        {/* Message */}
        <p className="text-gray-700 italic mb-6">
          "Your presence will make our celebration more joyful and memorable."
        </p>

        {/* Footer */}
        <p className="text-gray-500 text-sm">
          With love ❤️ <br />
          Dhilip & Family
        </p>

      </div>
    </div>
  );
};

export default WeddingInvitation;