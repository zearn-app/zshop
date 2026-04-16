"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

// --- CONFIG ---
const weddingDate = new Date("2026-05-20T10:00:00");

const quotes = [
  "Two hearts, one soul ❤️",
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
    transition: { staggerChildren: 0.15 },
  },
};

const fadeItem: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
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
    }, 4000);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 text-gray-800 overflow-x-hidden">

      {/* MUSIC */}
      <audio ref={audioRef} loop>
        <source src={MUSIC_URL} />
      </audio>

      {/* MUSIC BUTTON */}
      {opened && (
        <button
          onClick={toggleMusic}
          className="fixed top-6 left-6 z-50 bg-white shadow-lg px-4 py-2 rounded-full"
        >
          {isPlaying ? "⏸️" : "🎵"}
        </button>
      )}

      {/* HERO */}
      <section className="h-screen flex items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="closed"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              onClick={openInvitation}
              className="cursor-pointer bg-white shadow-2xl p-16 rounded-3xl"
            >
              <div className="text-6xl mb-4">💌</div>
              <h2 className="text-2xl tracking-widest">Tap to Open</h2>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              variants={fadeContainer}
              initial="hidden"
              animate="visible"
              className="max-w-xl w-full bg-white p-10 rounded-3xl shadow-xl"
            >
              <motion.h1 variants={fadeItem} className="text-4xl font-serif">
                Dhilip & Partner
              </motion.h1>

              <motion.div variants={fadeItem}>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={quoteIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-6 text-xl italic text-pink-500"
                  >
                    {quotes[quoteIndex]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>

              {/* COUNTDOWN */}
              <motion.div
                variants={fadeItem}
                className="grid grid-cols-4 gap-4 mt-10"
              >
                {Object.entries(timeLeft).map(([k, v]) => (
                  <div key={k} className="bg-pink-100 p-4 rounded-xl">
                    <div className="text-2xl font-bold">
                      {v.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs uppercase">
                      {k === "d"
                        ? "Days"
                        : k === "h"
                        ? "Hours"
                        : k === "m"
                        ? "Min"
                        : "Sec"}
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.p variants={fadeItem} className="mt-8 text-lg">
                May 20, 2026 • 10:00 AM
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* DETAILS */}
      {opened && (
        <section className="py-20 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-lg"
          >
            <h2 className="text-3xl text-pink-500 mb-6">
              Wedding Ceremony
            </h2>

            <p className="text-lg">Muhurtham: 9:00 AM – 10:30 AM</p>
            <p className="text-lg mt-2">Reception: 6:30 PM onwards</p>

            <button
              onClick={() =>
                window.open("https://www.google.com/maps", "_blank")
              }
              className="mt-8 px-6 py-3 bg-pink-500 text-white rounded-full"
            >
              View Location 📍
            </button>
          </motion.div>
        </section>
      )}

      {/* SIMPLE FLOATING DECOR (2D) */}
      {opened && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{ y: -50, opacity: 0 }}
              animate={{
                y: "100vh",
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{ left: `${i * 6}%` }}
            >
              ❤️
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}