"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

// --- CONFIG ---
const weddingDate = new Date("2026-05-20T10:00:00");

const quotes = [
  "Two hearts, one soul 💜",
  "A journey of love begins 💍",
  "Together forever ♾️",
  "Love brought us here 💖",
  "Forever starts with you ✨",
];

const MUSIC_URL = "/anba-va-en-anba-va.mp3";

// --- ANIMATIONS ---
const fadeContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const fadeItem: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

// --- 🎆 FIREWORK PARTICLE ---
function Firework({ x, y }: { x: number; y: number }) {
  const particles = Array.from({ length: 16 });

  return (
    <>
      {particles.map((_, i) => {
        const angle = (i / particles.length) * 2 * Math.PI;
        const distance = 60 + Math.random() * 60;

        return (
          <motion.span
            key={i}
            initial={{ x, y, opacity: 1, scale: 1 }}
            animate={{
              x: x + Math.cos(angle) * distance,
              y: y + Math.sin(angle) * distance,
              opacity: 0,
              scale: 0.4,
            }}
            transition={{ duration: 1 }}
            className="fixed w-2 h-2 bg-pink-400 rounded-full z-50"
          />
        );
      })}
    </>
  );
}

// --- 🌸 FLOWER PETAL ---
function Petal() {
  const left = Math.random() * 100;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: "110vh", opacity: 1 }}
      transition={{ duration: 5 + Math.random() * 3, ease: "linear" }}
      className="fixed top-0 text-pink-300 text-xl z-40"
      style={{ left: `${left}%` }}
    >
      🌸
    </motion.div>
  );
}

// --- FLIP DIGIT ---
function FlipDigit({ value }: { value: string }) {
  return (
    <div className="relative w-12 h-16 perspective">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={value}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-white rounded-xl flex items-center justify-center text-3xl font-bold text-purple-700 shadow-md"
        >
          {value}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// --- FLIP UNIT ---
function FlipUnit({ value, label }: { value: number; label: string }) {
  const str = value.toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-1">
        <FlipDigit value={str[0]} />
        <FlipDigit value={str[1]} />
      </div>
      <span className="text-xs mt-2 text-purple-400 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

// --- MAIN ---
export default function WeddingInvitation() {
  const [opened, setOpened] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [fireworks, setFireworks] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [showPetals, setShowPetals] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const fireworkId = useRef(0);

  // --- Countdown ---
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = weddingDate.getTime() - Date.now();
      if (diff <= 0) return;

      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // --- Quotes ---
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4200);

    return () => clearInterval(interval);
  }, []);

  // 🎆 Continuous Fireworks
  useEffect(() => {
    if (!opened) return;

    const interval = setInterval(() => {
      const newFirework = {
        id: fireworkId.current++,
        x: Math.random() * window.innerWidth,
        y: Math.random() * (window.innerHeight * 0.6),
      };

      setFireworks((prev) => [...prev, newFirework]);

      // remove after animation
      setTimeout(() => {
        setFireworks((prev) =>
          prev.filter((fw) => fw.id !== newFirework.id)
        );
      }, 1000);
    }, 600);

    return () => clearInterval(interval);
  }, [opened]);

  const openInvitation = () => {
    setOpened(true);
    setShowPetals(true);

    setTimeout(() => {
      audioRef.current?.play().catch(() => {});
      setIsPlaying(true);
    }, 500);
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) audio.pause();
    else audio.play();

    setIsPlaying(!isPlaying);
  };

  const title = "Dhilip & Partner";
  const letters = title.split("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-purple-100 text-gray-800 overflow-x-hidden">

      {/* 🎆 Continuous Fireworks */}
      {fireworks.map((fw) => (
        <Firework key={fw.id} x={fw.x} y={fw.y} />
      ))}

      {/* 🌸 Petals */}
      {showPetals &&
        Array.from({ length: 20 }).map((_, i) => <Petal key={i} />)}

      {/* Audio */}
      <audio ref={audioRef} loop>
        <source src={MUSIC_URL} />
      </audio>

      {/* Music Button */}
      {opened && (
        <button
          onClick={toggleMusic}
          className="fixed top-6 left-6 z-50 bg-white/90 px-5 py-3 rounded-full shadow-xl"
        >
          {isPlaying ? "⏸️ Pause" : "🎵 Play"}
        </button>
      )}

      {/* MAIN */}
      <section className="h-screen flex items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="closed"
              onClick={openInvitation}
              className="cursor-pointer bg-white p-16 rounded-3xl shadow-2xl"
            >
              <div className="text-6xl mb-4">💌</div>
              <h2 className="text-2xl text-purple-600">
                Tap to Open Invitation
              </h2>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              variants={fadeContainer}
              initial="hidden"
              animate="visible"
              className="max-w-xl w-full bg-white p-10 rounded-3xl shadow-xl"
            >
              <motion.div className="text-4xl text-purple-800 mb-4">
                {letters.map((l, i) => (
                  <span key={i}>{l}</span>
                ))}
              </motion.div>

              <motion.p className="text-purple-600 mb-4">
                With the blessings of our beloved families,
                we joyfully invite you to celebrate the wedding of
              </motion.p>

              <motion.h2 className="text-2xl font-semibold text-purple-700 mb-4">
                Dhilip 💜 Partner
              </motion.h2>

              <motion.p className="text-lg text-purple-500">
                {quotes[quoteIndex]}
              </motion.p>

              <motion.div
                variants={fadeItem}
                className="flex justify-center gap-6 mt-8 flex-wrap"
              >
                <FlipUnit value={timeLeft.d} label="Days" />
                <FlipUnit value={timeLeft.h} label="Hours" />
                <FlipUnit value={timeLeft.m} label="Minutes" />
                <FlipUnit value={timeLeft.s} label="Seconds" />
              </motion.div>

              <motion.div className="mt-8 text-purple-700 space-y-2">
                <p>📅 May 20, 2026</p>
                <p>⏰ 10:00 AM onwards</p>
                <p>📍 Wedding Hall, Your City</p>
              </motion.div>

              <motion.p className="mt-6 text-purple-600">
                Your presence will make our day even more special.
                We look forward to celebrating with you 💖
              </motion.p>

              <motion.p className="mt-6 text-sm text-purple-400">
                With love & blessings 🙏
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}