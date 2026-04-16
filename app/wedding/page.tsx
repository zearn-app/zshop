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
const STARS_COUNT = 80;
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

const MUSIC_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

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

  // Mouse tilt
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

  // Quote & Message rotation
  useEffect(() => {
    const qInterval = setInterval(() => setQuoteIndex((prev) => (prev + 1) % quotes.length), 4200);
    const mInterval = setInterval(() => setMessageIndex((prev) => (prev + 1) % loveMessages.length), 4800);
    return () => { clearInterval(qInterval); clearInterval(mInterval); };
  }, []);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => setScrollProgress(Math.round(latest * 100)));
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
    setTimeout(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.play().catch(() => {});
        setIsPlaying(true);
      }
    }, 800);
  };

  return (
    <motion.div
      ref={containerRef}
      className={`min-h-screen overflow-x-hidden ${opened ? "" : "overflow-hidden"} relative bg-[#0a0612] text-white`}
    >
      <audio ref={audioRef} loop>
        <source src={MUSIC_URL} type="audio/mpeg" />
      </audio>

      {/* Progress Bar */}
      {opened && (
        <motion.div
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 z-[60]"
          style={{ width: `${scrollProgress}%` }}
        />
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
          <span className="text-2xl">{isPlaying ? "⏸️" : "🎵"}</span>
          <span className="hidden md:block font-medium tracking-widest">
            {isPlaying ? "PAUSE MUSIC" : "PLAY MUSIC"}
          </span>
        </motion.button>
      )}

      {/* Background Stars (no rain) */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: STARS_COUNT }).map((_, i) => (
          <FloatingStar key={i} index={i} />
        ))}
      </div>

      {/* HERO - Envelope / Card */}
      <section className="min-h-screen flex items-center justify-center relative px-6 pt-16">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="envelope"
              initial={{ scale: 0.88, opacity: 0, y: 60 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ y: -800, scale: 0.7, rotate: 25, opacity: 0 }}
              onClick={openInvitation}
              className="cursor-pointer max-w-md mx-auto"
            >
              <div className="relative p-16 md:p-24 rounded-[4.5rem] backdrop-blur-3xl bg-zinc-950/90 border border-white/10 shadow-2xl overflow-hidden">
                <div className="text-center">
                  <div className="text-[148px] mb-6">✉️</div>
                  <p className="font-serif text-3xl tracking-[6px] uppercase">You are invited</p>
                  <p className="text-sm opacity-70 tracking-widest mt-2">TAP TO REVEAL</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              ref={cardRef}
              style={{ rotateX: shouldReduceMotion ? 0 : rotateX, rotateY: shouldReduceMotion ? 0 : rotateY }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative max-w-2xl mx-auto p-10 md:p-20 rounded-3xl bg-white/95 text-zinc-950 border border-zinc-200/60 shadow-2xl"
            >
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-10 text-center">
                <motion.div variants={itemVariants}>
                  <span className="inline-block px-8 py-2 rounded-full border border-pink-400/30 text-pink-500 text-xs tracking-[4px] font-semibold">
                    SAVE THE DATE • 20.05.2026
                  </span>
                </motion.div>

                <motion.h1 variants={itemVariants} className="text-6xl md:text-7xl font-serif tracking-tighter">
                  Dhilip <span className="text-pink-500">&amp;</span> Partner
                </motion.h1>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={quoteIndex}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    className="text-3xl md:text-4xl italic font-serif text-pink-600 min-h-[110px] flex items-center justify-center"
                  >
                    “{quotes[quoteIndex]}”
                  </motion.p>
                </AnimatePresence>

                {/* Countdown */}
                <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4 my-12">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="flex flex-col items-center bg-white/60 backdrop-blur-md rounded-2xl py-6 border border-white/30">
                      <div className="text-5xl md:text-6xl font-semibold tabular-nums">
                        {value.toString().padStart(2, "0")}
                      </div>
                      <span className="uppercase text-[10px] tracking-[2px] mt-1 opacity-60">
                        {unit === "d" ? "DAYS" : unit === "h" ? "HOURS" : unit === "m" ? "MIN" : "SEC"}
                      </span>
                    </div>
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

      {/* DETAILS SECTION - Fixed Alignment */}
      <AnimatePresence>
        {opened && (
          <motion.section className="min-h-screen py-24 px-6 flex flex-col items-center justify-center gap-20">
            <div className="max-w-4xl w-full p-16 md:p-20 rounded-3xl bg-zinc-900/70 border border-white/10 backdrop-blur-xl">
              <div className="grid md:grid-cols-2 gap-16 text-center md:text-left">
                {/* Muhurtham */}
                <div className="space-y-8">
                  <h2 className="text-pink-500 font-serif text-5xl">The Sacred Union</h2>
                  <div>
                    <p className="opacity-70 text-lg">Muhurtham</p>
                    <p className="text-4xl font-semibold mt-3">9:00 AM — 10:30 AM</p>
                  </div>
                </div>

                {/* Reception */}
                <div className="space-y-8">
                  <h2 className="text-pink-500 font-serif text-5xl">Grand Celebration</h2>
                  <div>
                    <p className="opacity-70 text-lg">Reception & Dinner</p>
                    <p className="text-4xl font-semibold mt-3">6:30 PM onwards</p>
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                className="max-w-lg text-center text-2xl italic font-light tracking-wide"
              >
                {loveMessages[messageIndex]}
              </motion.p>
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open("https://www.google.com/maps", "_blank")}
              className="px-20 py-7 rounded-2xl text-xl font-semibold bg-white text-black hover:bg-pink-100 flex items-center gap-4"
            >
              LOCATE THE VENUE 📍
            </motion.button>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Closing */}
      {opened && (
        <section className="h-screen flex items-center justify-center relative">
          <div className="text-center px-6">
            <h2 className="text-[13vw] md:text-[180px] font-serif italic leading-none bg-gradient-to-b from-white/90 to-white/30 bg-clip-text text-transparent">
              We look forward<br />to celebrating<br />with you
            </h2>
          </div>
          <div className="absolute bottom-16 text-xs tracking-[4px] font-mono opacity-60">
            MADE WITH ∞ LOVE • MADURAI 2026
          </div>
        </section>
      )}
    </motion.div>
  );
}

/* Sub Components */
const ThemeToggle = ({ isDark, toggle }: { isDark: boolean; toggle: () => void }) => (
  <motion.div onClick={toggle} className="fixed top-8 right-8 z-50 cursor-pointer p-2 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20">
    <motion.div
      animate={{ x: isDark ? 48 : 4 }}
      className="w-11 h-11 rounded-2xl flex items-center justify-center text-3xl"
      style={{ background: isDark ? "#4c1d95" : "#ea580c" }}
    >
      {isDark ? "🌙" : "☀️"}
    </motion.div>
  </motion.div>
);

const FloatingStar = ({ index }: { index: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-white rounded-full"
    style={{ left: `\( {Math.random() * 100}%`, top: ` \){Math.random() * 100}%` }}
    animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.8, 1.4, 0.8] }}
    transition={{ duration: 4 + Math.random() * 6, repeat: Infinity, delay: index * 0.04 }}
  />
);