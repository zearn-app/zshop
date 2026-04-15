"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WeddingInvitation = () => {
  const [opened, setOpened] = useState(false);

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-pink-800 to-rose-600 flex items-center justify-center">

      {/* 🔮 Floating Background  Glow */}
      <motion.div
        className="absolute w-[500px] h-[500px] bg-purple-500 opacity-20 rounded-full blur-3xl"
        animate={{ x: [0, 100, -100, 0], y: [0, -100, 100, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* 💜 INTRO HEART SCREEN */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            className="absolute flex items-center justify-center w-full h-full cursor-pointer"
            onClick={() => setOpened(true)}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="text-7xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              💜
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎉 INVITATION CARD */}
      <AnimatePresence>
        {opened && (
          <motion.div
            className="max-w-2xl w-full bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center z-10"
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Header */}
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-rose-600 mb-4"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Wedding Invitation
            </motion.h1>

            <motion.p
              className="text-gray-600 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Together with their families
            </motion.p>

            {/* Couple Names */}
            <motion.h2
              className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
            >
              Dhilip 💖 Partner Name
            </motion.h2>

            <motion.p
              className="text-gray-500 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Request the pleasure of your presence at their wedding ceremony
            </motion.p>

            {/* Date & Time */}
            <motion.div
              className="bg-rose-100 rounded-xl p-4 mb-6"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-lg font-semibold text-gray-700">
                📅 Date: 20th May 2026
              </p>
              <p className="text-lg font-semibold text-gray-700">
                ⏰ Time: 10:00 AM
              </p>
            </motion.div>

            {/* Venue */}
            <motion.div
              className="mb-6"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                📍 Venue
              </h3>
              <p className="text-gray-600">
                Sri Mahal Wedding Hall,<br />
                Kattur, Tamil Nadu
              </p>
            </motion.div>

            <motion.div
              className="my-6 border-t border-gray-300"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.3 }}
            />

            <motion.p
              className="text-gray-700 italic mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              "Your presence will make our celebration more joyful and memorable."
            </motion.p>

            <motion.p
              className="text-gray-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              With love ❤️ <br />
              Dhilip & Family
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeddingInvitation;