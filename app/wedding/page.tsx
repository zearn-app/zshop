"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";

// --- Constants ---
const petals = Array.from({ length: 35 });
const stars = Array.from({ length: 70 });
const sparkles = Array.from({ length: 25 });

const weddingDate = new Date("2026-05-20T10:00:00");

const quotes = [
  "Two hearts, one soul ❤️",
  "A journey of love begins 💍",
  "Together forever ♾️",
  "Love brought us here 💖",
];

// --- Floating Particles ---
const FloatingParticle = () => {
  return (
    <motion.div
      className="absolute bg-white/20 rounded-full blur-[1px]"
      style={{
        width: Math.random() * 3 + 1,
        height: Math.random() * 3 + 1,
        left: `${Math.random() * 100}%`,
        top: "100%",
      }}
      animate={{
        y: ["0vh", "-120vh"],
        x: [0, Math.random() * 80 - 40],
        opacity: [0, 0.8, 0],
      }}
      transition={{
        duration: 10 + Math.random() * 15,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

// --- Sparkle Burst ---
const Sparkle = () => (
  <motion.div
    className="absolute text-pink-300"
    initial={{ scale: 0, opacity: 0 }}
    animate={{
      scale: [0, 1.5, 0],
      opacity: [0, 1, 0],
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 300,
    }}
    transition={{ duration: 1.5 }}
  >
    ✨
  </motion.div>
);

export default function WeddingInvitation() {
  const [opened, setOpened] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [quoteIndex, setQuoteIndex] = useState(0);

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });

  // Scroll Animations
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.7]);

  // Mouse Parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 120, damping: 20 });
  const sy = useSpring(y, { stiffness: 120, damping: 20 });

  const rotateX = useTransform(sy, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(sx, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const resetMouse = () => {
    x.set(0);
    y.set(0);
  };

  // Countdown
  useEffect(() => {
    const t = setInterval(() => {
      const d = weddingDate.getTime() - Date.now();
      if (d < 0) return;
      setTimeLeft({
        d: Math.floor(d / (1000 * 60 * 60 * 24)),
        h: Math.floor((d / (1000 * 60 * 60)) % 24),
        m: Math.floor((d / (1000 * 60)) % 60),
        s: Math.floor((d / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Quotes Loop
  useEffect(() => {
    const q = setInterval(
      () => setQuoteIndex((p) => (p + 1) % quotes.length),
      3500
    );
    return () => clearInterval(q);
  }, []);

  return (
    <div
      ref={ref}
      className={`bg-[#0a0612] text-white ${
        opened ? "h-[300vh]" : "h-screen overflow-hidden"
      }`}
    >
      {/* 🌌 Background */}
      <div className="fixed inset-0">
        {stars.map((_, i) => (
          <FloatingParticle key={i} />
        ))}
      </div>

      {/* 🌸 Petals */}
      <AnimatePresence>
        {opened &&
          petals.map((_, i) => (
            <motion.div
              key={i}
              className="fixed text-xl"
              initial={{ y: -50 }}
              animate={{
                y: "110vh",
                x: (Math.random() - 0.5) * 1000,
                rotate: 360,
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
              }}
            >
              🌸
            </motion.div>
          ))}
      </AnimatePresence>

      {/* HERO */}
      <section className="h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="envelope"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ y: -500, opacity: 0 }}
              onClick={() => setOpened(true)}
              className="cursor-pointer text-center"
            >
              <motion.div
                whileHover={{ rotateY: 15, scale: 1.05 }}
                className="p-12 bg-white/10 rounded-3xl backdrop-blur-xl"
              >
                <div className="text-7xl mb-4">💌</div>
                <p>Tap to open</p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              style={{ rotateX, rotateY, scale, opacity }}
              onMouseMove={handleMouseMove}
              onMouseLeave={resetMouse}
              className="bg-white text-black p-10 rounded-3xl text-center max-w-md"
            >
              {/* Sparkles */}
              {sparkles.map((_, i) => (
                <Sparkle key={i} />
              ))}

              <h1 className="text-4xl font-bold mb-4 animate-pulse">
                Dhilip ❤️ Partner
              </h1>

              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="italic mb-4"
                >
                  {quotes[quoteIndex]}
                </motion.p>
              </AnimatePresence>

              <p className="mb-4">20 MAY 2026</p>

              <div className="bg-black text-white p-2 rounded-full">
                {timeLeft.d}d {timeLeft.h}h {timeLeft.m}m {timeLeft.s}s
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* DETAILS */}
      {opened && (
        <section className="h-screen flex flex-col justify-center items-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white/10 p-10 rounded-3xl backdrop-blur-lg"
          >
            <h2 className="text-2xl mb-4 text-pink-300">The Ceremony</h2>
            <p>Muhurtham: 9:00 AM</p>
            <p>Reception: 6:30 PM</p>
          </motion.div>

          <button
            onClick={() => window.open("https://maps.google.com")}
            className="bg-white text-black px-6 py-3 rounded-full hover:bg-pink-500 hover:text-white"
          >
            Open Map 🗺️
          </button>
        </section>
      )}

      {/* FOOTER */}
      {opened && (
        <section className="h-screen flex items-center justify-center">
          <h2 className="text-5xl text-white/20 italic">
            See you there...
          </h2>
        </section>
      )}
    </div>
  );
}