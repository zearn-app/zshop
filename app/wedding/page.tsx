"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useInView,
  useReducedMotion,
  Variants,
} from "framer-motion";

// --- Constants & Config ---
const PETALS_COUNT = 52;
const STARS_COUNT = 95;
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

// Advanced Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 90, damping: 18 },
  },
};

const envelopeVariants: Variants = {
  closed: { scale: 0.88, opacity: 0, y: 60, rotate: -8 },
  open: {
    scale: 1,
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    y: -920,
    scale: 0.65,
    rotate: 22,
    opacity: 0,
    transition: { duration: 0.85, ease: "easeInOut" },
  },
};

export default function WeddingInvitation() {
  const [opened, setOpened] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "center center"] });
  
  const shouldReduceMotion = useReducedMotion();

  // Advanced 3D Tilt with perspective
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 120, damping: 28, mass: 0.6 };
  const sx = useSpring(mouseX, springConfig);
  const sy = useSpring(mouseY, springConfig);

  const rotateX = useTransform(sy, [-0.5, 0.5], ["18deg", "-18deg"]);
  const rotateY = useTransform(sx, [-0.5, 0.5], ["-22deg", "22deg"]);
  const cardDepth = useTransform(scrollYProgress, [0, 0.4], [1, 0.92]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0.82]);

  // Parallax background layers
  const bgY1 = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set((e.clientX - centerX) / (rect.width / 2));
    mouseY.set((e.clientY - centerY) / (rect.height / 2));
  }, [mouseX, mouseY]);

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = weddingDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }

      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Quote rotator
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  // Message rotator
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loveMessages.length);
    }, 4800);
    return () => clearInterval(interval);
  }, []);

  // Open card with confetti burst
  const openInvitation = () => {
    setOpened(true);
    setTimeout(() => setShowConfetti(true), 400);
    setTimeout(() => setShowConfetti(false), 4800);
  };

  return (
    <motion.div
      ref={containerRef}
      className={`min-h-screen overflow-x-hidden ${opened ? "" : "overflow-hidden"}`}
      animate={{
        backgroundColor: isDark ? "#0a0612" : "#fffaf0",
      }}
      transition={{ duration: 1.2 }}
    >
      <ThemeToggle isDark={isDark} toggle={() => setIsDark(!isDark)} />

      {/* Dynamic Background Layers */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Deep parallax layer */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(#6b21a8_0.8px,transparent_1px)] bg-[length:48px_48px]"
          style={{ y: bgY1, opacity: isDark ? 0.25 : 0.12 }}
        />
        
        {/* Stars & Particles */}
        {Array.from({ length: STARS_COUNT }).map((_, i) => (
          <FloatingStar key={i} isDark={isDark} index={i} />
        ))}

        {/* Soft glow orb */}
        <motion.div
          animate={{
            scale: isDark ? [1, 1.25, 1] : [1.15, 1.45, 1.15],
            opacity: isDark ? [0.18, 0.32, 0.18] : [0.25, 0.42, 0.25],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[620px] h-[620px] bg-gradient-to-br from-violet-400 via-fuchsia-400 to-amber-300 rounded-full blur-[120px] opacity-30"
        />
      </div>

      {/* Petals / Confetti Layer */}
      <AnimatePresence>
        {(opened || showConfetti) && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: PETALS_COUNT }).map((_, i) => (
              <FloatingPetal key={i} isDark={isDark} delay={i * 0.035} index={i} />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="min-h-screen flex items-center justify-center relative px-6 pt-16">
        <AnimatePresence mode="wait">
          {!opened ? (
            /* === ENVELOPE === */
            <motion.div
              key="envelope"
              variants={envelopeVariants}
              initial="closed"
              animate="open"
              exit="exit"
              onClick={openInvitation}
              className="cursor-pointer group relative max-w-md mx-auto"
            >
              <motion.div
                whileHover={{ scale: 1.04, y: -18 }}
                whileTap={{ scale: 0.96 }}
                className={`relative p-16 md:p-24 rounded-[4.5rem] backdrop-blur-3xl border shadow-2xl overflow-hidden
                  ${isDark 
                    ? "bg-zinc-950/90 border-white/10" 
                    : "bg-gradient-to-br from-orange-50 to-rose-50 border-orange-200"}`}
              >
                {/* Envelope seal */}
                <motion.div
                  className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-dashed flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                >
                  <div className={`w-11 h-11 rounded-full ${isDark ? "bg-violet-600" : "bg-rose-500"}`} />
                </motion.div>

                <motion.div
                  animate={{ y: [0, -22, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity }}
                  className="text-[148px] text-center drop-shadow-2xl mt-8"
                >
                  {isDark ? "✉️" : "💌"}
                </motion.div>

                <div className="text-center mt-6">
                  <p className="font-serif text-3xl tracking-[6px] uppercase mb-1">You are invited</p>
                  <p className="text-sm opacity-70 tracking-widest">TAP TO REVEAL</p>
                </div>

                {/* Hover sparkles */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="absolute text-4xl"
                      style={{
                        top: `${15 + i * 12}%`,
                        left: `${20 + (i % 3) * 25}%`,
                      }}
                      animate={{ scale: [0.6, 1.3, 0.8], opacity: [0.4, 0.9, 0.3] }}
                      transition={{ duration: 2.8 + i * 0.3, repeat: Infinity }}
                    >
                      ✨
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            /* === OPENED 3D CARD === */
            <motion.div
              ref={cardRef}
              style={{
                rotateX: shouldReduceMotion ? 0 : rotateX,
                rotateY: shouldReduceMotion ? 0 : rotateY,
                scale: cardDepth,
                opacity: cardOpacity,
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className={`relative max-w-2xl mx-auto p-10 md:p-20 rounded-3xl backdrop-blur-2xl border shadow-2xl overflow-hidden
                ${isDark 
                  ? "bg-white/95 text-zinc-950 border-zinc-200/60" 
                  : "bg-zinc-900/95 text-white border-zinc-700"}`}
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-10 text-center"
              >
                <motion.div variants={itemVariants}>
                  <motion.span
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="inline-block px-8 py-2 rounded-full border border-pink-400/30 text-pink-500 text-xs tracking-[4px] font-semibold"
                  >
                    SAVE THE DATE • 20.05.2026
                  </motion.span>
                </motion.div>

                <motion.h1 
                  variants={itemVariants}
                  className="text-6xl md:text-7xl font-serif tracking-tighter leading-none"
                >
                  Dhilip <span className="text-pink-500">&amp;</span> Partner
                </motion.h1>

                {/* Elegant Quote Carousel */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={quoteIndex}
                    initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -30, filter: "blur(4px)" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-3xl md:text-4xl italic font-serif text-pink-600 dark:text-pink-400 min-h-[110px] flex items-center justify-center"
                  >
                    “{quotes[quoteIndex]}”
                  </motion.p>
                </AnimatePresence>

                {/* Countdown with spring numbers */}
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-4 gap-4 md:gap-6 my-12"
                >
                  {Object.entries(timeLeft).map(([unit, value], idx) => (
                    <motion.div
                      key={unit}
                      whileHover={{ scale: 1.08 }}
                      className="flex flex-col items-center bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md rounded-2xl py-6 border border-white/30"
                    >
                      <motion.div
                        className="text-5xl md:text-6xl font-semibold tabular-nums tracking-tighter"
                        key={`\( {unit}- \){value}`}
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        {value.toString().padStart(2, "0")}
                      </motion.div>
                      <span className="uppercase text-[10px] tracking-[2px] mt-1 opacity-60">
                        {unit === "d" ? "DAYS" : unit === "h" ? "HOURS" : unit === "m" ? "MIN" : "SEC"}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div variants={itemVariants} className="text-xl font-light tracking-widest opacity-80">
                  WEDNESDAY, MAY 20TH 2026 — 10:00 AM
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* DETAILS & CELEBRATION SECTION */}
      <AnimatePresence>
        {opened && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen py-24 px-6 flex flex-col items-center justify-center gap-20"
          >
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className={`max-w-4xl w-full p-16 md:p-20 rounded-3xl backdrop-blur-xl border
                ${isDark ? "bg-zinc-900/70 border-white/10" : "bg-white/70 border-orange-100"}`}
            >
              <div className="grid md:grid-cols-2 gap-16 text-center md:text-left">
                <div className="space-y-8">
                  <h2 className="text-pink-500 font-serif text-5xl">The Sacred Union</h2>
                  <div>
                    <p className="opacity-70">Muhurtham</p>
                    <p className="text-4xl font-semibold mt-2">9:00 AM — 10:30 AM</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <h2 className="text-pink-500 font-serif text-5xl">Grand Celebration</h2>
                  <div>
                    <p className="opacity-70">Reception & Dinner</p>
                    <p className="text-4xl font-semibold mt-2">6:30 PM onwards</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Rotating Love Message */}
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-lg text-center text-2xl italic font-light tracking-wide min-h-[90px]"
              >
                {loveMessages[messageIndex]}
              </motion.p>
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open("https://www.google.com/maps", "_blank")}
              className={`px-20 py-7 rounded-2xl text-xl font-semibold shadow-xl flex items-center gap-4 group
                ${isDark 
                  ? "bg-white text-black hover:bg-pink-100" 
                  : "bg-zinc-900 text-white hover:bg-rose-600"}`}
            >
              LOCATE THE VENUE 
              <span className="group-hover:rotate-12 transition-transform">📍</span>
            </motion.button>
          </motion.section>
        )}
      </AnimatePresence>

      {/* CLOSING SECTION */}
      <AnimatePresence>
        {opened && (
          <motion.section className="h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-transparent via-black/30 to-transparent">
            <motion.h2
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 1.8 }}
              className="text-[13vw] md:text-[180px] font-serif italic select-none text-center leading-none px-4"
            >
              We look forward<br />to celebrating<br />with you
            </motion.h2>

            <motion.div
              animate={{ opacity: [0.4, 0.75, 0.4] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute bottom-16 text-xs tracking-[4px] font-mono"
            >
              MADE WITH ∞ LOVE
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ====================== SUB COMPONENTS ====================== */

const ThemeToggle = ({ isDark, toggle }: { isDark: boolean; toggle: () => void }) => (
  <motion.div
    onClick={toggle}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.92 }}
    className="fixed top-8 right-8 z-50 cursor-pointer p-2 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl"
  >
    <motion.div
      animate={{ x: isDark ? 48 : 4 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      className="w-11 h-11 rounded-2xl flex items-center justify-center text-3xl shadow-inner"
      style={{ background: isDark ? "#4c1d95" : "#ea580c" }}
    >
      {isDark ? "🌙" : "☀️"}
    </motion.div>
  </motion.div>
);

const FloatingStar = ({ isDark, index }: { isDark: boolean; index: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-white rounded-full"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
    animate={{
      opacity: [0.2, 0.9, 0.2],
      scale: [0.6, 1.4, 0.6],
    }}
    transition={{
      duration: 3 + Math.random() * 7,
      repeat: Infinity,
      delay: index * 0.06,
    }}
  />
);

const FloatingPetal = ({ isDark, delay, index }: { isDark: boolean; delay: number; index: number }) => {
  const sideWays = useMotionValue(Math.random() * 140 - 70);

  return (
    <motion.div
      className="fixed text-4xl z-50 pointer-events-none select-none"
      initial={{
        y: "-8vh",
        x: (Math.random() - 0.5) * 60 + "vw",
        rotate: Math.random() * 40 - 20,
        scale: 0.4 + Math.random() * 0.5,
      }}
      animate={{
        y: "108vh",
        x: sideWays,
        rotate: [0, 180 + Math.random() * 360],
        opacity: [0, 1, 0.9, 0],
      }}
      transition={{
        duration: 7 + Math.random() * 11,
        delay,
        repeat: Infinity,
        repeatDelay: 0.6,
        ease: "linear",
      }}
    >
      {isDark ? (index % 3 === 0 ? "✨" : "💫") : "🌸"}
    </motion.div>
  );
};