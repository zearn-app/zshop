"use client";

import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const petals = Array.from({ length: 25 });
const stars = Array.from({ length: 40 });

const WeddingInvitation = () => {
  const [opened, setOpened] = useState(false);

  // --- 3D Tilt ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x);
  const mouseY = useSpring(y);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // 📍 Google Maps
  const openMap = () => {
    window.open(
      "https://maps.google.com/?q=Sri+Mahal+Wedding+Hall+Kattur+Tamil+Nadu",
      "_blank"
    );
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#12071f] flex items-center justify-center p-4">

      {/* 🌌 Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-rose-800 opacity-70" />

        {stars.map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3,
              height: Math.random() * 3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
          />
        ))}
      </div>

      {/* 🌸 Petals */}
      <AnimatePresence>
        {opened &&
          petals.map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl pointer-events-none z-50"
              initial={{ y: -100, x: Math.random() * 1200 }}
              animate={{
                y: "110vh",
                x: Math.random() * 1000,
                rotate: 720,
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 7 + Math.random() * 5,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            >
              🌸
            </motion.div>
          ))}
      </AnimatePresence>

      {/* 💜 OPEN HEART */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            className="relative z-20 text-center cursor-pointer"
            onClick={() => setOpened(true)}
            exit={{ scale: 0, opacity: 0, filter: "blur(20px)" }}
          >
            <motion.div
              className="text-9xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              💜
            </motion.div>

            <motion.p
              className="text-white mt-4 tracking-widest"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              TAP TO OPEN INVITATION
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 💥 BURST */}
      <AnimatePresence>
        {opened &&
          Array.from({ length: 25 }).map((_, i) => (
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
      </AnimatePresence>

      {/* 🎉 MAIN CARD */}
      <AnimatePresence>
        {opened && (
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10 max-w-xl w-full"
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden">

              {/* ✨ Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* 🏷️ Header */}
              <h1 className="text-4xl font-bold text-rose-600 mb-4">
                Wedding Invitation
              </h1>

              <p className="text-gray-600 mb-4">
                Together with their families
              </p>

              {/* 💑 Names */}
              <motion.h2
                className="text-3xl font-semibold text-gray-800 mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                Dhilip 💖 Partner Name
              </motion.h2>

              <p className="text-gray-500 mb-6">
                Invite you to celebrate their beautiful journey of love ❤️
              </p>

              {/* 📅 Details */}
              <div className="bg-rose-100 rounded-xl p-4 mb-6">
                <p>📅 20th May 2026</p>
                <p>⏰ 10:00 AM</p>
              </div>

              {/* 📍 Venue */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">📍 Venue</h3>
                <p className="text-gray-600">
                  Sri Mahal Wedding Hall,<br />
                  Kattur, Tamil Nadu
                </p>

                <button
                  onClick={openMap}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-full shadow-lg"
                >
                  📍 Get Directions
                </button>
              </div>

              {/* 💌 Message */}
              <p className="italic text-gray-700 mb-4">
                "Your presence will make our celebration more joyful and
                memorable."
              </p>

              <p className="text-sm text-gray-500">
                With love ❤️ <br />
                Dhilip & Family
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeddingInvitation;