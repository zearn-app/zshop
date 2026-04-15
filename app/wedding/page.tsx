"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const petals = Array.from({ length: 30 });
const stars = Array.from({ length: 60 });

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

  const mouseX = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 100, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-12deg", "12deg"]);

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
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#0f0a1f] flex items-center justify-center p-4">

      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f2e] via-[#2b0f3a] to-[#3a0f2e] opacity-90" />

        {/* Glow circles */}
        <motion.div
          className="absolute w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl top-[-100px] left-[-100px]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <motion.div
          className="absolute w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-3xl bottom-[-100px] right-[-100px]"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Stars */}
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
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
          />
        ))}
      </div>

      {/* 🌸 PETALS */}
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
                delay: i * 0.15,
                ease: "linear",
              }}
            >
              🌸
            </motion.div>
          ))}
      </AnimatePresence>

      {/* 💜 OPEN BUTTON */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            onClick={() => setOpened(true)}
            className="z-20 text-center cursor-pointer"
            exit={{ scale: 0, opacity: 0 }}
          >
            <motion.div
              className="text-8xl relative"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              💜

              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 border-2 border-white rounded-full"
                animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>

            <p className="text-white mt-4 opacity-80">
              Tap to Open Invitation
            </p>
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
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.4)] overflow-hidden">

              {/* Shine sweep */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 6 }}
              />

              {/* Title */}
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-pink-500 via-rose-500 to-yellow-500 bg-clip-text text-transparent">
                {splitText("Wedding Invitation").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </h1>

              {/* Quotes */}
              <motion.p
                key={quoteIndex}
                className="text-gray-500 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {quotes[quoteIndex]}
              </motion.p>

              {/* Names */}
              <motion.h2
                className="text-3xl font-semibold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                Dhilip 💖 Partner Name
              </motion.h2>

              <p className="mb-4 text-gray-600">
                Together with their families invite you
              </p>

              {/* Countdown */}
              <p className="mb-4 text-sm font-semibold text-rose-500">
                ⏳ {timeLeft} left
              </p>

              {/* Date */}
              <motion.div
                className="bg-rose-50 p-4 rounded-xl mb-5 border border-rose-200 text-black"
                whileHover={{ scale: 1.05 }}
              >
                <p>📅 20 May 2026</p>
                <p>⏰ 10:00 AM</p>
              </motion.div>

              <p className="text-gray-600">
                Sri Mahal Wedding Hall, Kattur
              </p>

              {/* Button */}
              <motion.button
                onClick={openMap}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="mt-5 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-full shadow-lg"
              >
                📍 Get Directions
              </motion.button>

              {/* Footer */}
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