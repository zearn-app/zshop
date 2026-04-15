"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const petals = Array.from({ length: 15 });

const WeddingInvitation = () => {
  const [opened, setOpened] = useState(false);

  // 📍 Google Maps Link
  const openMap = () => {
    window.open(
      "https://www.google.com/maps/search/?api=1&query=Sri+Mahal+Wedding+Hall+Kattur+Tamil+Nadu",
      "_blank"
    );
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-pink-800 to-rose-600 flex items-center justify-center">

      {/* 🌸 Floating Petals */}
      {opened &&
        petals.map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-200 text-xl"
            initial={{ y: -100, x: Math.random() * window.innerWidth }}
            animate={{ y: "110vh", rotate: 360 }}
            transition={{
              duration: 6 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            🌸
          </motion.div>
        ))}

      {/* 🔮 Background Glow */}
      <motion.div
        className="absolute w-[500px] h-[500px] bg-purple-500 opacity-20 rounded-full blur-3xl"
        animate={{ x: [0, 120, -120, 0], y: [0, -120, 120, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* 💜 INTRO HEART */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            className="absolute flex items-center justify-center w-full h-full cursor-pointer"
            onClick={() => setOpened(true)}
            exit={{ scale: 3, opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="text-8xl drop-shadow-[0_0_25px_rgba(255,0,255,0.8)]"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 15, -15, 0],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
              }}
            >
              💜
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 💥 HEART BURST EFFECT */}
      <AnimatePresence>
        {opened && (
          <>
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-pink-400"
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.random() * 600 - 300,
                  y: Math.random() * 600 - 300,
                  opacity: 0,
                  scale: 1.5,
                }}
                transition={{ duration: 1 }}
              >
                💖
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* 🎉 INVITATION CARD */}
      <AnimatePresence>
        {opened && (
          <motion.div
            className="max-w-2xl w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center z-10 relative"
            initial={{ opacity: 0, y: 150, rotateX: 90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1 }}
            whileHover={{
              scale: 1.03,
              rotateX: 5,
              rotateY: 5,
            }}
          >

            {/* 💫 Card Breathing Animation */}
            <motion.div
              className="absolute inset-0 rounded-3xl border border-white/20"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {/* ✨ Shimmer Effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Header */}
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-rose-600 mb-4 relative"
              initial={{ y: -60, opacity: 0 }}
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

            {/* 💖 Names */}
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

            {/* 📅 Date */}
            <motion.div
              className="bg-rose-100 rounded-xl p-4 mb-6"
              initial={{ x: -120, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-lg font-semibold text-gray-700">
                📅 Date: 20th May 2026
              </p>
              <p className="text-lg font-semibold text-gray-700">
                ⏰ Time: 10:00 AM
              </p>
            </motion.div>

            {/* 📍 Venue */}
            <motion.div
              className="mb-6"
              initial={{ x: 120, opacity: 0 }}
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

              {/* 📍 GOOGLE MAP BUTTON */}
              <motion.button
                onClick={openMap}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-full shadow-lg relative overflow-hidden"
              >
                📍 Open in Google Maps

                {/* ✨ Ripple Effect */}
                <motion.span
                  className="absolute inset-0 bg-white/30 rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />

              </motion.button>
            </motion.div>

            <motion.div
              className="my-6 border-t border-gray-300"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.3 }}
            />

            {/* 💌 Message */}
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