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
const petals = Array.from({ length: 45 });
const stars = Array.from({ length: 80 });
const weddingDate = new Date("2026-05-20T10:00:00");

const quotes = [
  "Two hearts, one soul ❤️",
  "A journey of love begins 💍",
  "Together forever ♾️",
  "Love brought us here 💖",
  "Forever starts with you ✨",
];

const loveMessages = [
  "With love & gratitude",
  "We can't wait to celebrate with you",
  "Your presence will make our day complete",
  "Join us in this beautiful chapter",
];

export default function WeddingInvitation() {
  const [opened, setOpened] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });

  const scale = useTransform(scrollYProgress, [0, 0.25], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.75]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 80, damping: 25 });
  const sy = useSpring(y, { stiffness: 80, damping: 25 });

  const rotateX = useTransform(sy, [-0.6, 0.6], ["12deg", "-12deg"]);
  const rotateY = useTransform(sx, [-0.6, 0.6], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  // Countdown Timer
  useEffect(() => {
    const interval = setInterval(() => {
      const difference = weddingDate.getTime() - Date.now();
      if (difference < 0) return;

      setTimeLeft({
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / (1000 * 60)) % 60),
        s: Math.floor((difference / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Rotating Quotes
  useEffect(() => {
    const q = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 3800);
    return () => clearInterval(q);
  }, []);

  // Rotating Love Messages
  useEffect(() => {
    const m = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loveMessages.length);
    }, 4500);
    return () => clearInterval(m);
  }, []);

  return (
    <motion.div
      ref={ref}
      animate={{
        backgroundColor: isDark ? "#0a0612" : "#fff7ed",
        color: isDark ? "#ffffff" : "#431407",
      }}
      className={`min-h-screen transition-colors duration-1000 ${opened ? "" : "overflow-hidden"}`}
    >
      <ThemeToggle isDark={isDark} toggle={() => setIsDark(!isDark)} />

      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {stars.map((_, i) => (
          <FloatingElement key={i} isDark={isDark} delay={i * 0.08} />
        ))}

        {/* Soft Ambient Glow */}
        <motion.div
          animate={{
            scale: isDark ? [1, 1.1, 1] : [1.2, 1.4, 1.2],
            opacity: isDark ? 0.25 : 0.45,
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-amber-400/10"
        />
      </div>

      {/* Floating Petals when opened */}
      <AnimatePresence>
        {opened &&
          petals.map((_, i) => (
            <motion.div
              key={i}
              className="fixed text-3xl z-10 pointer-events-none"
              initial={{ y: "-10vh", opacity: 0, scale: 0.6 }}
              animate={{
                y: "110vh",
                x: (Math.random() - 0.5) * 180 + "vw",
                rotate: [0, 180, 360],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 6 + Math.random() * 8,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "linear",
              }}
            >
              {isDark ? "✨" : "🌸"}
            </motion.div>
          ))}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="min-h-screen flex items-center justify-center relative px-6">
        <AnimatePresence mode="wait">
          {!opened ? (
            // Elegant Envelope
            <motion.div
              key="envelope"
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ y: -900, opacity: 0, rotate: 15, scale: 0.7 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              onClick={() => setOpened(true)}
              className="cursor-pointer group relative"
            >
              <motion.div
                whileHover={{ y: -15, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className={`p-20 rounded-[60px] backdrop-blur-3xl border-2 shadow-2xl transition-all duration-700
                  ${isDark ? "bg-white/5 border-white/20" : "bg-orange-50/70 border-orange-300"}`}
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 2.8 }}
                  className="text-[120px] mb-8 text-center drop-shadow-lg"
                >
                  {isDark ? "✉️" : "💌"}
                </motion.div>

                <div className="text-center">
                  <p className="text-2xl font-light tracking-[4px] uppercase mb-2">You're Invited</p>
                  <p className="text-lg opacity-75">Tap to open</p>
                </div>
              </motion.div>

              {/* Sparkle effect on hover */}
              <motion.div
                className="absolute -inset-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-6 left-6 text-4xl">✨</div>
                <div className="absolute bottom-8 right-10 text-3xl">💫</div>
              </motion.div>
            </motion.div>
          ) : (
            // Opened Card with 3D Tilt
            <motion.div
              style={{ rotateX, rotateY, scale, opacity }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => { x.set(0); y.set(0); }}
              className={`relative p-14 md:p-20 rounded-[60px] text-center max-w-2xl shadow-2xl border backdrop-blur-xl transition-all duration-1000
                ${isDark ? "bg-white/95 text-black border-white/30" : "bg-stone-900/95 text-stone-100 border-stone-700"}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.span 
                  className="block text-pink-500 text-sm tracking-[4px] uppercase font-semibold mb-6"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  SAVE THE DATE
                </motion.span>

                <h1 className="text-6xl md:text-7xl font-serif mb-8 leading-tight">
                  Dhilip <span className="text-pink-500">&amp;</span> Partner
                </h1>

                {/* Animated Quote */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={quoteIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-2xl italic font-serif min-h-[80px] text-pink-600/90 dark:text-pink-400"
                  >
                    "{quotes[quoteIndex]}"
                  </motion.p>
                </AnimatePresence>

                {/* Countdown */}
                <div className="my-12 grid grid-cols-4 gap-6">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <motion.div
                      key={unit}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <motion.span 
                        className="text-5xl font-bold tabular-nums"
                        key={value}
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                      >
                        {value.toString().padStart(2, '0')}
                      </motion.span>
                      <span className="text-xs uppercase tracking-widest opacity-60 mt-1">
                        {unit === 'd' ? 'Days' : unit === 'h' ? 'Hours' : unit === 'm' ? 'Minutes' : 'Seconds'}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="text-lg opacity-80 tracking-wider">
                  WEDNESDAY, 20 MAY 2026 • 10:00 AM
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* DETAILS SECTION */}
      {opened && (
        <section className="min-h-screen flex flex-col justify-center items-center gap-16 px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-14 md:p-20 rounded-[50px] backdrop-blur-2xl border w-full max-w-3xl
              ${isDark ? "bg-white/5 border-white/10" : "bg-white/70 border-orange-200"}`}
          >
            <div className="grid md:grid-cols-2 gap-16">
              <div className="space-y-6">
                <h2 className="text-4xl font-serif text-pink-500">The Sacred Union</h2>
                <div className="space-y-3">
                  <p className="text-lg opacity-80">Muhurtham</p>
                  <p className="text-3xl font-bold tracking-tight">9:00 AM — 10:30 AM</p>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-4xl font-serif text-pink-500">Grand Celebration</h2>
                <div className="space-y-3">
                  <p className="text-lg opacity-80">Reception & Dinner</p>
                  <p className="text-3xl font-bold tracking-tight">6:30 PM onwards</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Animated Love Message */}
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-xl italic text-center max-w-md opacity-80"
            >
              {loveMessages[messageIndex]}
            </motion.p>
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.06, y: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => window.open("https://maps.google.com", "_blank")}
            className={`px-16 py-6 rounded-full font-bold text-xl shadow-2xl flex items-center gap-3 transition-all
              ${isDark 
                ? "bg-white text-black hover:bg-pink-100" 
                : "bg-stone-900 text-white hover:bg-rose-700"}`}
          >
            Find the Venue 📍
          </motion.button>
        </section>
      )}

      {/* FOOTER */}
      {opened && (
        <section className="h-screen flex items-center justify-center relative overflow-hidden">
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.12, scale: 1 }}
            className="text-[8vw] md:text-[120px] font-serif italic text-center leading-none px-6 select-none"
          >
            We look forward<br />to celebrating<br />with you
          </motion.h2>

          <motion.div 
            className="absolute bottom-12 text-sm opacity-40 tracking-widest"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            MADE WITH LOVE ✨
          </motion.div>
        </section>
      )}
    </motion.div>
  );
}

// Theme Toggle Component (Improved)
const ThemeToggle = ({ isDark, toggle }: { isDark: boolean; toggle: () => void }) => (
  <div
    onClick={toggle}
    className="fixed top-8 right-8 z-50 cursor-pointer p-1.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/30 w-24 h-12 flex items-center shadow-xl"
  >
    <motion.div
      animate={{ x: isDark ? 52 : 4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="w-9 h-9 rounded-full flex items-center justify-center text-2xl shadow-md"
      style={{ background: isDark ? "#6b21a8" : "#f59e0b" }}
    >
      {isDark ? "🌙" : "☀️"}
    </motion.div>
  </div>
);

// Floating Element with better control
const FloatingElement = ({ isDark, delay = 0 }: { isDark: boolean; delay?: number }) => (
  <motion.div
    className="absolute rounded-full blur-sm"
    style={{
      width: Math.random() * 5 + 2,
      height: Math.random() * 5 + 2,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      backgroundColor: isDark 
        ? "rgba(255,255,255,0.35)" 
        : "rgba(245, 158, 11, 0.45)",
    }}
    animate={{
      y: ["0vh", "-150vh"],
      x: [0, Math.random() * 80 - 40],
      opacity: [0, 0.9, 0],
    }}
    transition={{
      duration: 10 + Math.random() * 14,
      repeat: Infinity,
      delay: delay,
      ease: "linear",
    }}
  />
);