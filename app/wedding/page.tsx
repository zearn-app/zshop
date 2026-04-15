"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const petals = Array.from({ length: 20 });

const WeddingInvitation = () => {
  const [opened, setOpened] = useState(false);

  const openMap = () => {
    window.open(
      "https://www.google.com/maps/search/?api=1&query=Sri+Mahal+Wedding+Hall+Kattur+Tamil+Nadu",
      "_blank"
    );
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-yellow-900 via-orange-800 to-yellow-700 flex items-center justify-center">

      {/* 🌼 Falling Flowers */}
      {opened &&
        petals.map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-200 text-xl"
            initial={{ y: -100, x: Math.random() * window.innerWidth }}
            animate={{ y: "110vh", rotate: 360 }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            🌼
          </motion.div>
        ))}

      {/* 🔔 Temple Bells */}
      {opened && (
        <>
          <motion.div
            className="absolute top-0 left-10 text-4xl"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔔
          </motion.div>

          <motion.div
            className="absolute top-0 right-10 text-4xl"
            animate={{ rotate: [0, -15, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔔
          </motion.div>
        </>
      )}

      {/* ✨ Golden Glow */}
      <motion.div
        className="absolute w-[500px] h-[500px] bg-yellow-400 opacity-20 rounded-full blur-3xl"
        animate={{ x: [0, 100, -100, 0], y: [0, -100, 100, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* 💜 Intro Heart */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            className="absolute flex items-center justify-center w-full h-full cursor-pointer"
            onClick={() => setOpened(true)}
            exit={{ scale: 3, opacity: 0 }}
          >
            <motion.div
              className="text-8xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              💜
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 💥 Heart Burst */}
      {opened &&
        Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-300"
            initial={{ x: 0, y: 0 }}
            animate={{
              x: Math.random() * 600 - 300,
              y: Math.random() * 600 - 300,
              opacity: 0,
            }}
            transition={{ duration: 1 }}
          >
            ✨
          </motion.div>
        ))}

      {/* 🎉 Main Card */}
      <AnimatePresence>
        {opened && (
          <motion.div
            className="max-w-2xl w-full bg-gradient-to-br from-yellow-100 to-orange-100 border-[3px] border-yellow-500 rounded-3xl shadow-2xl p-8 text-center relative"
            initial={{ opacity: 0, y: 150, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ scale: 1.03 }}
          >
            {/* ✨ Gold Shine */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/40 to-transparent rounded-3xl"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* 🪷 Title */}
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-yellow-800 mb-4"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              💍 திருமண அழைப்பிதழ் 💍
            </motion.h1>

            <p className="text-gray-700 mb-4">
              Together with their families
            </p>

            {/* Names */}
            <motion.h2
              className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              Dhilip 💖 Partner Name
            </motion.h2>

            {/* Date */}
            <motion.div className="bg-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-lg font-semibold">
                📅 20 May 2026
              </p>
              <p className="text-lg font-semibold">
                ⏰ 10:00 AM
              </p>
            </motion.div>

            {/* Venue */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">📍 Venue</h3>
              <p>
                Sri Mahal Wedding Hall,<br />
                Kattur, Tamil Nadu
              </p>
            </div>

            {/* 📍 Google Maps Button */}
            <motion.button
              onClick={openMap}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className="bg-yellow-600 text-white px-6 py-3 rounded-full shadow-lg mb-6"
            >
              📍 Open in Google Maps
            </motion.button>

            <div className="border-t my-4"></div>

            {/* Message */}
            <p className="italic mb-4">
              உங்கள் வருகை எங்கள் விழாவை மேலும் மகிழ்ச்சியாக்கும் 💛
            </p>

            <p className="text-sm">
              With love ❤️ <br />
              Dhilip & Family
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeddingInvitation;