
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useReducedMotion,
  Variants,
} from "framer-motion";

// --- Constants ---
const PETALS_COUNT = 65;
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

// ✅ Fixed: Direct MP3 link (royalty-free romantic music)
const MUSIC_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.92 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 90, damping: 18 } },
};

export default function WeddingInvitation() {
  const [opened, setOpened] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 120, damping: 28, mass: 0.6 };
  const sx = useSpring(mouseX, springConfig);
  const sy = useSpring(mouseY, springConfig);

  const rotateX = useTransform(sy, [-0.5, 0.5], ["18deg", "-18deg"]);
  const rotateY = useTransform(sx, [-0.5, 0.5], ["-22deg", "22deg"]);

  const bgY1 = useTransform(scrollYProgress, [0, 1], ["0%", "45%"]);
  const detailsY = useTransform(scrollYProgress, [0.2, 0.6], ["60px", "0px"]);

  // Mouse tilt
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set((e.clientX - centerX) / (rect.width / 2));
    mouseY.set((e.clientY - centerY) / (rect.height / 2));
  }, [mouseX, mouseY]);

  // Countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = weddingDate.getTime() - Date.now();
      if (diff <= 0) return setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });

      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Rotators
  useEffect(() => {
    const q = setInterval(() => setQuoteIndex((p) => (p + 1) % quotes.length), 4200);
    const m = setInterval(() => setMessageIndex((p) => (p + 1) % loveMessages.length), 4800);
    return () => { clearInterval(q); clearInterval(m); };
  }, []);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => setScrollProgress(Math.round(v * 100)));
    return unsubscribe;
  }, [scrollYProgress]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.pause() : audio.play().catch(() => {});
    setIsPlaying(!isPlaying);
  };

  const openInvitation = () => {
    setOpened(true);
    setTimeout(() => setShowConfetti(true), 300);
    setTimeout(() => setShowConfetti(false), 5500);

    setTimeout(() => {
      audioRef.current?.play().catch(() => {});
      setIsPlaying(true);
    }, 600);
  };

  return (
    <motion.div
      ref={containerRef}
      className={`min-h-screen overflow-x-hidden relative ${opened ? "" : "overflow-hidden"}`}
      animate={{ backgroundColor: isDark ? "#0a0612" : "#fffaf0" }}
    >
      {/* Background Music */}
      <audio ref={audioRef} loop>
        <source src={MUSIC_URL} type="audio/mpeg" />
      </audio>

      {/* Scroll Progress */}
      {opened && (
        <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 z-[60]" style={{ width: `${scrollProgress}%` }} />
      )}

      <ThemeToggle isDark={isDark} toggle={() => setIsDark(!isDark)} />

      {/* Music Toggle */}
      {opened && (
        <motion.button
          onClick={toggleMusic}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed top-8 left-8 z-50 p-4 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 flex items-center gap-3"
        >
          <span className="text-3xl">{isPlaying ? "⏸️" : "🎵"}</span>
        </motion.button>
      )}

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div className="absolute inset-0 bg-[radial-gradient(#6b21a8_0.8px,transparent_1px)] bg-[length:48px_48px]" style={{ y: bgY1, opacity: isDark ? 0.28 : 0.14 }} />

        {Array.from({ length: STARS_COUNT }).map((_, i) => (
          <FloatingStar key={i} index={i} />
        ))}
      </div>

      {/* Floating Petals / Sparkles - Improved Distribution */}
      <AnimatePresence>
        {(opened || showConfetti) && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: PETALS_COUNT }).map((_, i) => (
              <FloatingPetal key={i} isDark={isDark} delay={i * 0.022} index={i} />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="min-h-screen flex items-center justify-center relative px-6 pt-16">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="envelope"
              initial={{ scale: 0.88, opacity: 0, y: 60 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ y: -800, scale: 0.6, rotate: 25, opacity: 0 }}
              onClick={openInvitation}
              className="cursor-pointer group relative max-w-md mx-auto"
            >
              {/* Envelope UI (same as before) */}
              <motion.div
                whileHover={{ scale: 1.04, y: -18 }}
                whileTap={{ scale: 0.96 }}
                className={`relative p-16 md:p-24 rounded-[4.5rem] backdrop-blur-3xl border shadow-2xl overflow-hidden
                  ${isDark ? "bg-zinc-950/90 border-white/10" : "bg-gradient-to-br from-orange-50 to-rose-50 border-orange-200"}`}
              >
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 28, repeat: Infinity }} className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-dashed flex items-center justify-center">
                  <div className={`w-11 h-11 rounded-full ${isDark ? "bg-violet-600" : "bg-rose-500"}`} />
                </motion.div>

                <motion.div animate={{ y: [0, -22, 0] }} transition={{ duration: 3.2, repeat: Infinity }} className="text-[148px] text-center mt-8">
                  {isDark ? "✉️" : "💌"}
                </motion.div>

                <div className="text-center mt-6">
                  <p className="font-serif text-3xl tracking-[6px] uppercase">You are invited</p>
                  <p className="text-sm opacity-70 tracking-widest mt-2">TAP TO REVEAL</p>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            /* 3D Card */
            <motion.div
              ref={cardRef}
              style={{ rotateX: shouldReduceMotion ? 0 : rotateX, rotateY: shouldReduceMotion ? 0 : rotateY }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
              className={`relative max-w-2xl mx-auto p-8 md:p-20 rounded-3xl backdrop-blur-2xl border shadow-2xl
                ${isDark ? "bg-white/95 text-zinc-950 border-zinc-200/60" : "bg-zinc-900/95 text-white border-zinc-700"}`}
            >
              {/* Card Content */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-10 text-center">
                {/* ... (Your existing card content - kept same for brevity) */}
                <motion.h1 variants={itemVariants} className="text-6xl md:text-7xl font-serif tracking-tighter">
                  Dhilip <span className="text-pink-500">&amp;</span> Partner
                </motion.h1>
                {/* Quote, Countdown, Date - same as before */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* DETAILS SECTION - Fixed Mobile Layout */}
      <AnimatePresence>
        {opened && (
          <motion.section
            style={{ y: detailsY }}
            className="min-h-screen py-20 px-6 flex flex-col items-center justify-center gap-16 relative"
          >
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`max-w-4xl w-full p-10 md:p-20 rounded-3xl backdrop-blur-xl border text-center md:text-left
                ${isDark ? "bg-zinc-900/80 border-white/10" : "bg-white/70 border-orange-100"}`}
            >
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h2 className="text-pink-500 font-serif text-5xl">The Sacred Union</h2>
                  <div>
                    <p className="opacity-70 text-sm">Muhurtham</p>
                    <p className="text-4xl font-semibold mt-1">9:00 AM — 10:30 AM</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-pink-500 font-serif text-5xl">Grand Celebration</h2>
                  <div>
                    <p className="opacity-70 text-sm">Reception & Dinner</p>
                    <p className="text-4xl font-semibold mt-1">6:30 PM onwards</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Rotating Message */}
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="max-w-lg text-center text-2xl italic font-light tracking-wide min-h-[80px] px-4"
              >
                {loveMessages[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ==================== SUB COMPONENTS ==================== */

const ThemeToggle = ({ isDark, toggle }: { isDark: boolean; toggle: () => void }) => (
  <motion.div onClick={toggle} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="fixed top-8 right-8 z-50 p-2 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 cursor-pointer">
    <motion.div animate={{ x: isDark ? 48 : 4 }} className="w-11 h-11 rounded-2xl flex items-center justify-center text-3xl" style={{ background: isDark ? "#4c1d95" : "#ea580c" }}>
      {isDark ? "🌙" : "☀️"}
    </motion.div>
  </motion.div>
);

const FloatingStar = ({ index }: { index: number }) => (
  <motion.div
    className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full shadow-[0_0_8px_#facc15]"
    style={{ left: `\( {Math.random() * 100}%`, top: ` \){Math.random() * 100}%` }}
    animate={{ opacity: [0.3, 1, 0.3], scale: [0.7, 1.4, 0.7] }}
    transition={{ duration: 4 + Math.random() * 6, repeat: Infinity, delay: index * 0.03 }}
  />
);

const FloatingPetal = ({ isDark, delay, index }: { isDark: boolean; delay: number; index: number }) => {
  const xDrift = useMotionValue((Math.random() - 0.5) * 120);

  return (
    <motion.div
      className="absolute text-4xl pointer-events-none select-none"
      style={{ x: xDrift }}
      initial={{
        y: "-12vh",
        x: `${(Math.random() - 0.5) * 110}vw`,
        rotate: Math.random() * 60 - 30,
        scale: 0.4 + Math.random() * 0.7,
      }}
      animate={{
        y: "115vh",
        rotate: [0, 180 + Math.random() * 400],
        opacity: [0, 1, 0.9, 0],
      }}
      transition={{
        duration: 7 + Math.random() * 14,
        delay,
        repeat: Infinity,
        repeatDelay: 0.3,
        ease: "linear",
      }}
    >
      {isDark ? (index % 4 === 0 ? "💫" : "✨") : "🌸"}
    </motion.div>
  );
};