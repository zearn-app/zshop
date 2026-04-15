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
const petals = Array.from({ length: 25 });
const stars = Array.from({ length: 50 });

const weddingDate = new Date("2026-05-20T10:00:00");

const quotes = [
  "Two hearts, one soul ❤️",
  "A journey of love begins 💍",
  "Together forever ♾️",
  "Love brought us here 💖",
];

// --- Floating Particles (Optimized) ---
const FloatingParticle = ({ i }: { i: number }) => {
  return (
    <motion.div
      className="absolute bg-white/20 rounded-full"
      style={{
        width: 2,
        height: 2,
        left: `${Math.random() * 100}%`,
        top: "100%",
      }}
      animate={{
        y: ["0vh", "-100vh"],
        opacity: [0, 0.7, 0],
      }}
      transition={{
        duration: 15 + Math.random() * 10,
        repeat: Infinity,
        ease: "linear",
        delay: i * 0.2,
      }}
    />
  );
};

const WeddingInvitation = () => {
  const [opened, setOpened] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [quoteIndex, setQuoteIndex] = useState(0);

  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // --- CLEAN SCROLL ANIMATIONS ---
  const cardScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const cardY = useTransform(scrollYProgress, [0, 0.3], [0, -40]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Smooth springs
  const smoothScale = useSpring(cardScale, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(cardY, { stiffness: 80, damping: 20 });

  // --- Mouse Tilt (Reduced Intensity) ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(x, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // --- Countdown ---
  useEffect(() => {
    const timer = setInterval(() => {
      const distance = weddingDate.getTime() - new Date().getTime();
      if (distance < 0) return;

      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance / (1000 * 60 * 60)) % 24),
        m: Math.floor((distance / (1000 * 60)) % 60),
        s: Math.floor((distance / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // --- Quotes ---
  useEffect(() => {
    const interval = setInterval(
      () => setQuoteIndex((p) => (p + 1) % quotes.length),
      4000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-[#0a0612] ${
        opened ? "h-[250vh]" : "h-screen overflow-hidden"
      }`}
    >
      {/* 🌌 BACKGROUND */}
      <motion.div style={{ y: bgY }} className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f2e] via-[#0a0612] to-black" />
        {stars.map((_, i) => (
          <FloatingParticle key={i} i={i} />
        ))}
      </motion.div>

      {/* 🌸 FALLING PETALS - IMPROVED */}
<AnimatePresence>
  {opened &&
    petals.map((_, i) => {
      const angle = Math.random() * Math.PI * 2; // spread in all directions
      const radius = 300 + Math.random() * 800; // distance from center

      const xEnd = Math.cos(angle) * radius;
      const yEnd = Math.sin(angle) * radius + window.innerHeight;

      const sway = Math.random() * 100 - 50;

      return (
        <motion.div
          key={`petal-${i}`}
          initial={{
            x: 0,
            y: -100,
            opacity: 0,
            scale: 0.6 + Math.random() * 0.6,
          }}
          animate={{
            x: [0, sway, xEnd],
            y: ["-10vh", "50vh", `${yEnd}px`],
            rotate: [0, 180, 360],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            ease: "easeInOut",
            repeat: Infinity,
            delay: i * 0.15,
          }}
          className="fixed z-50 text-xl pointer-events-none"
        >
          🌸
        </motion.div>
      );
    })}
</AnimatePresence>
      {/* CONTENT */}
      <main className="relative z-10 flex flex-col items-center">
        {/* HERO */}
        <section className="h-screen flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!opened ? (
              <motion.div
                key="envelope"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ y: -300, opacity: 0 }}
                onClick={() => setOpened(true)}
                className="cursor-pointer"
              >
                <div className="bg-white/10 backdrop-blur-xl p-12 rounded-3xl text-center">
                  <div className="text-6xl mb-4">💌</div>
                  <p className="text-white text-sm tracking-widest">
                    Tap to Open
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                style={{
                  scale: smoothScale,
                  y: smoothY,
                  rotateX,
                  rotateY,
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="max-w-lg w-full"
              >
                <div className="bg-white rounded-[2.5rem] p-10 text-center shadow-2xl">
                  <p className="text-xs tracking-[0.4em] text-pink-500 mb-4">
                    WEDDING INVITATION
                  </p>

                  <AnimatePresence mode="wait">
                    <motion.p
                      key={quoteIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-gray-400 italic mb-6"
                    >
                      {quotes[quoteIndex]}
                    </motion.p>
                  </AnimatePresence>

                  <h1 className="text-4xl font-serif mb-6">
                    Dhilip <br /> & <br /> Partner Name
                  </h1>

                  <p className="text-gray-500 mb-4">
                    📍 Sri Mahal Wedding Hall, Kattur
                  </p>

                  <div className="bg-black text-white px-4 py-2 rounded-full inline-block">
                    {timeLeft.d}d : {timeLeft.h}h : {timeLeft.m}m :{" "}
                    {timeLeft.s}s
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* DETAILS */}
        {opened && (
          <section className="min-h-screen flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl text-white max-w-3xl"
            >
              <h2 className="text-2xl mb-6 text-center text-pink-300">
                Ceremony
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-pink-400">Muhurtham</h4>
                  <p>9:00 AM - 10:30 AM</p>
                </div>

                <div>
                  <h4 className="text-pink-400">Reception</h4>
                  <p>6:30 PM onwards</p>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* FOOTER */}
        {opened && (
          <section className="h-screen flex items-center justify-center">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-white/20 text-5xl italic"
            >
              See you there...
            </motion.h2>
          </section>
        )}
      </main>
    </div>
  );
};

export default WeddingInvitation;