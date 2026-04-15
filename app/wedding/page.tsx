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

const splitText = (text: string) => text.split("");

const WeddingInvitation = () => {
  const [opened, setOpened] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);

  // 🎯 3D Tilt
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

  // 💬 Quotes Rotation
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
            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
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

            <motion.p
              className="text-white mt-4"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              Tap to Open
            </motion.p>
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

              {/* Glow */}
              <motion.div
                className="absolute inset-0 bg-rose-300/20 blur-2xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 4 }}
              />

              {/* ✨ Shine */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 5 }}
              />

              {/* 🏷️ Header (Letter Animation + Gradient) */}
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-pink-500 via-rose-500 to-yellow-500 bg-clip-text text-transparent">
                {splitText("Wedding Invitation").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {char}
                  </motion.span>
                ))}
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

              {/* 💑 Names (Double Gradient + Glow) */}
              <motion.h2
                className="text-3xl font-semibold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                Dhilip 💖 Partner Name
              </motion.h2>

              <p className="mb-4 text-gray-600">
                Together with their families invite you
              </p>

              {/* ⏳ Countdown */}
              <motion.p
                className="mb-4 text-sm font-semibold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                ⏳ {timeLeft} left
              </motion.p>

              {/* 📅 Box */}
              <motion.div
                className="bg-rose-100 p-4 rounded-xl mb-5"
                whileHover={{ scale: 1.05 }}
              >
                <p>📅 20 May 2026</p>
                <p>⏰ 10:00 AM</p>
              </motion.div>

              <p className="text-gray-600">
                Sri Mahal Wedding Hall, Kattur
              </p>

              {/* 📍 Button */}
              <motion.button
                onClick={openMap}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="mt-5 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-full shadow-lg relative overflow-hidden"
              >
                📍 Get Directions

                <motion.span
                  className="absolute inset-0 bg-white/30"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>

              {/* 💌 Footer */}
              <motion.p
                className="italic mt-6 text-gray-700"
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                Your presence will make our day special ❤️
              </motion.p>

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