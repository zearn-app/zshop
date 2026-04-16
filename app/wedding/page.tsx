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

const MUSIC_URL =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

// --- ANIMATIONS ---
const fadeContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const fadeItem: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const letterVariant: Variants = {
  hidden: { opacity: 0, y: 30, rotateX: 90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.05,
      ease: "backOut",
    },
  }),
};

const countdownVariant: Variants = {
  hidden: { scale: 0.6, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 15 },
  },
};

// --- MAIN COMPONENT ---
export default function WeddingInvitation() {
  const [opened, setOpened] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

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

  // --- Open ---
  const openInvitation = () => {
    setOpened(true);
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

      {/* MUSIC */}
      <audio ref={audioRef} loop>
        <source src={MUSIC_URL} />
      </audio>

      {/* MUSIC BUTTON */}
      {opened && (
        <button
          onClick={toggleMusic}
          className="fixed top-6 left-6 z-50 bg-white/90 backdrop-blur-md shadow-xl px-5 py-3 rounded-full flex items-center gap-2 hover:scale-110 transition-transform"
        >
          {isPlaying ? "⏸️ Pause" : "🎵 Play"}
        </button>
      )}

      {/* HERO */}
      <section className="h-screen flex items-center justify-center px-6 text-center relative">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="closed"
              initial={{ scale: 0.8, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.6, opacity: 0, rotate: 8 }}
              onClick={openInvitation}
              className="cursor-pointer bg-white shadow-2xl p-16 rounded-3xl hover:scale-105 transition-transform duration-300 border border-purple-100"
            >
              <motion.div 
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="text-7xl mb-6"
              >
                💌
              </motion.div>
              <h2 className="text-3xl tracking-widest font-light text-purple-600">Tap to Open Invitation</h2>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              variants={fadeContainer}
              initial="hidden"
              animate="visible"
              className="max-w-xl w-full bg-white/95 backdrop-blur-md p-12 rounded-3xl shadow-2xl border border-purple-100"
            >
              {/* Animated Title */}
              <motion.div 
                variants={fadeItem}
                className="text-5xl md:text-6xl font-serif text-purple-800 mb-8 flex flex-wrap justify-center gap-x-3"
              >
                {letters.map((letter, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={letterVariant}
                    initial="hidden"
                    animate="visible"
                    className="inline-block"
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </motion.div>

              {/* Animated Quote */}
              <motion.div variants={fadeItem} className="min-h-[80px]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={quoteIndex}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="mt-4 text-2xl italic font-light text-purple-600 tracking-wide"
                  >
                    {quotes[quoteIndex]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>

              {/* Enhanced Countdown */}
              <motion.div
                variants={fadeItem}
                className="grid grid-cols-4 gap-4 mt-12"
              >
                {Object.entries(timeLeft).map(([k, v], index) => (
                  <motion.div
                    key={k}
                    variants={countdownVariant}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.08, y: -5 }}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl shadow-inner border border-purple-100"
                  >
                    <div className="text-4xl font-bold text-purple-700 tabular-nums">
                      {v.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs uppercase tracking-widest mt-1 text-purple-400 font-medium">
                      {k === "d" ? "Days" : k === "h" ? "Hours" : k === "m" ? "Minutes" : "Seconds"}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.p 
                variants={fadeItem}
                className="mt-10 text-xl text-purple-700 font-light"
              >
                May 20, 2026 • 10:00 AM
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* DETAILS */}
      {opened && (
        <section className="py-24 px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md p-12 rounded-3xl shadow-xl border border-purple-100"
          >
            <motion.h2 
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              className="text-4xl font-serif text-purple-600 mb-8"
            >
              Wedding Ceremony
            </motion.h2>

            <div className="space-y-4 text-lg text-gray-700">
              <p><span className="font-medium text-purple-600">Muhurtham:</span> 9:00 AM – 10:30 AM</p>
              <p><span className="font-medium text-purple-600">Reception:</span> 6:30 PM onwards</p>
            </div>

            <button
              onClick={() =>
                window.open("https://www.google.com/maps", "_blank")
              }
              className="mt-10 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full text-lg font-medium hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-3 mx-auto"
            >
              📍 View Location on Maps
            </button>
          </motion.div>
        </section>
      )}

      {/* ENHANCED FLOATING DECORATIONS */}
      {opened && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
          {/* Purple Hearts */}
          {[...Array(18)].map((_, i) => (
            <motion.div
              key={`heart-${i}`}
              className="absolute text-3xl"
              initial={{ y: -100, opacity: 0, scale: 0.6 }}
              animate={{
                y: "105vh",
                opacity: [0, 1, 0],
                scale: [0.6, 1.2, 0.8],
                rotate: [0, 25, -25, 0],
              }}
              transition={{
                duration: Math.random() * 7 + 9,
                repeat: Infinity,
                delay: i * 0.4 + Math.random() * 3,
              }}
              style={{ 
                left: `${Math.random() * 100}%`,
                filter: "drop-shadow(0 4px 6px rgba(168, 85, 247, 0.3))"
              }}
            >
              💜
            </motion.div>
          ))}

          {/* Extra Elements */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute text-2xl"
              initial={{ y: -80, opacity: 0 }}
              animate={{
                y: "110vh",
                opacity: [0, 1, 0],
                x: [0, Math.random() * 60 - 30],
              }}
              transition={{
                duration: Math.random() * 6 + 11,
                repeat: Infinity,
                delay: i * 0.7,
              }}
              style={{ left: `${Math.random() * 95}%` }}
            >
              ✨
            </motion.div>
          ))}

          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute text-3xl"
              initial={{ y: -120, opacity: 0, rotate: 0 }}
              animate={{
                y: "105vh",
                opacity: [0, 1, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 8 + 12,
                repeat: Infinity,
                delay: i * 1.2,
              }}
              style={{ left: `${Math.random() * 100}%` }}
            >
              💍
            </motion.div>
          ))}
        </div>
      )}

      {/* Bottom subtle text */}
      {opened && (
        <div className="py-12 text-center text-purple-300/70 text-sm tracking-widest">
          Made with 💜 for a beautiful beginning
        </div>
      )}
    </div>
  );
}