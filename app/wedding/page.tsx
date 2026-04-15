"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const petals = Array.from({ length: 25 });
const stars = Array.from({ length: 50 });

const weddingDate = new Date("2026-05-20T10:00:00");

const quotes = [
  "Two hearts, one soul ❤️",
  "A journey of love begins 💍",
  "Together forever ♾️",
  "Love brought us here 💖",
];

const WeddingInvitation = () => {
  const [opened, setOpened] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);

  // --- 3D Tilt ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x);
  const mouseY = useSpring(y);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // 📍 Map
  const openMap = () => {
    window.open(
      "https://maps.google.com/?q=Sri+Mahal+Wedding+Hall+Kattur+Tamil+Nadu",
      "_blank"
    );
  };

  // ⏳ Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate.getTime() - now;

      if (distance < 0) return;

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const m = Math.floor((distance / (1000 * 60)) % 60);

      setTimeLeft(`${d}d ${h}h ${m}m`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 💬 Rotating Quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
              width: Math.random() * 2,
              height: Math.random() * 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
          />
        ))}
      </div>

      {/* 🌸 Petals */}
      <AnimatePresence>
        {opened &&
          petals.map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl z-50"
              initial={{ y: -100, x: Math.random() * 1200 }}
              animate={{
                y: "110vh",
                rotate: 720,
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "linear",
              }}
            >
              🌸
            </motion.div>
          ))}
      </AnimatePresence>

      {/* 💜 OPEN */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            onClick={() => setOpened(true)}
            className="z-20 text-center cursor-pointer"
            exit={{ scale: 0, opacity: 0 }}
          >
            <motion.div
              className="text-9xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              💜
            </motion.div>
            <p className="text-white mt-4">Tap to Open</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎉 CARD */}
      <AnimatePresence>
        {opened && (
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="z-10 max-w-xl w-full"
          >
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 text-center shadow-2xl overflow-hidden">

              {/* 🌟 Glow Pulse */}
              <motion.div
                className="absolute inset-0 bg-rose-300/20 rounded-3xl blur-2xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 4 }}
              />

              {/* ✨ Shine */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 5 }}
              />

              <h1 className="text-4xl font-bold text-rose-600 mb-3">
                Wedding Invitation
              </h1>

              {/* 💬 Quotes */}
              <motion.p
                key={quoteIndex}
                className="text-gray-500 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {quotes[quoteIndex]}
              </motion.p>

              <h2 className="text-3xl font-semibold mb-2">
                Dhilip 💖 Partner Name
              </h2>

              <p className="mb-4 text-gray-600">
                Together with their families invite you
              </p>

              {/* ⏳ Countdown */}
              <p className="mb-4 text-sm text-rose-500 font-semibold">
                ⏳ {timeLeft} left
              </p>

              <div className="bg-rose-100 p-4 rounded-xl mb-5">
                <p>📅 20 May 2026</p>
                <p>⏰ 10:00 AM</p>
              </div>

              <p className="text-gray-600">
                Sri Mahal Wedding Hall, Kattur
              </p>

              <motion.button
                onClick={openMap}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="mt-5 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-full shadow-lg"
              >
                📍 Get Directions
              </motion.button>

              <p className="italic mt-6 text-gray-700">
                Your presence will make our day special ❤️
              </p>

              <p className="text-sm mt-3 text-gray-500">
                With love, Dhilip & Family
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeddingInvitation;