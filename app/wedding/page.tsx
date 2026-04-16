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
const weddingDate = new Date("2026-05-20T10:00:00");

const quotes = [
  "Two hearts, one soul ❤️",
  "A journey of love begins 💍",
  "Together forever ♾️",
  "Love brought us here 💖",
];

// --- Components ---

const ThemeToggle = ({ isDark, toggle }: { isDark: boolean; toggle: () => void }) => (
  <div 
    onClick={toggle}
    className="fixed top-8 right-8 z-50 cursor-pointer p-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 w-20 h-10 flex items-center"
  >
    <motion.div
      animate={{ x: isDark ? 40 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-8 h-8 rounded-full flex items-center justify-center text-xl shadow-lg"
      style={{ background: isDark ? "#4c1d95" : "#fbbf24" }}
    >
      {isDark ? "🌙" : "☀️"}
    </motion.div>
  </div>
);

const FloatingElement = ({ isDark }: { isDark: boolean }) => {
  return (
    <motion.div
      className="absolute rounded-full blur-[1px]"
      style={{
        width: Math.random() * 4 + 1,
        height: Math.random() * 4 + 1,
        left: `${Math.random() * 100}%`,
        top: "100%",
        backgroundColor: isDark ? "rgba(255,255,255,0.4)" : "rgba(251, 191, 36, 0.5)",
      }}
      animate={{
        y: ["0vh", "-120vh"],
        x: [0, Math.random() * 100 - 50],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 8 + Math.random() * 10,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

export default function WeddingInvitation() {
  const [opened, setOpened] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [quoteIndex, setQuoteIndex] = useState(0);

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });

  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.7]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 100, damping: 20 });
  const sy = useSpring(y, { stiffness: 100, damping: 20 });

  const rotateX = useTransform(sy, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(sx, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

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

  useEffect(() => {
    const q = setInterval(() => setQuoteIndex((p) => (p + 1) % quotes.length), 4000);
    return () => clearInterval(q);
  }, []);

  return (
    <motion.div
      ref={ref}
      animate={{ 
        backgroundColor: isDark ? "#0a0612" : "#fff7ed",
        color: isDark ? "#ffffff" : "#431407"
      }}
      className={`transition-colors duration-1000 ${opened ? "h-[300vh]" : "h-screen overflow-hidden"}`}
    >
      <ThemeToggle isDark={isDark} toggle={() => setIsDark(!isDark)} />

      {/* 🌌 Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {stars.map((_, i) => (
          <FloatingElement key={i} isDark={isDark} />
        ))}
        {/* Animated Sun/Moon Glow */}
        <motion.div 
          animate={{
            scale: isDark ? 1 : 1.5,
            opacity: isDark ? 0.2 : 0.4,
            background: isDark ? "radial-gradient(circle, #4c1d95 0%, transparent 70%)" : "radial-gradient(circle, #fbbf24 0%, transparent 70%)"
          }}
          className="absolute -top-20 -left-20 w-96 h-96 blur-3xl"
        />
      </div>

      {/* 🌸 Interactive Petals */}
      <AnimatePresence>
        {opened && petals.map((_, i) => (
          <motion.div
            key={i}
            className="fixed text-2xl z-10"
            initial={{ y: -100, opacity: 0 }}
            animate={{ 
              y: "110vh", 
              x: `${(Math.random() - 0.5) * 100}vw`,
              rotate: 360,
              opacity: 1
            }}
            transition={{ duration: 7 + Math.random() * 5, repeat: Infinity, ease: "linear" }}
          >
            {isDark ? "✨" : "🌸"}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="h-screen flex items-center justify-center relative px-4">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="envelope"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ y: -800, opacity: 0, rotate: 10 }}
              onClick={() => setOpened(true)}
              className="cursor-pointer group"
            >
              <motion.div
                whileHover={{ y: -10 }}
                className={`p-16 rounded-[40px] backdrop-blur-2xl border-2 transition-colors duration-700
                  ${isDark ? "bg-white/5 border-white/10" : "bg-orange-100/50 border-orange-200"}`}
              >
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-8xl mb-6 text-center"
                >
                  {isDark ? "✉️" : "💌"}
                </motion.div>
                <p className="text-xl font-light tracking-widest uppercase">Open Invitation</p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              style={{ rotateX, rotateY, scale, opacity }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => { x.set(0); y.set(0); }}
              className={`p-12 rounded-[50px] text-center max-w-lg shadow-2xl transition-colors duration-1000
                ${isDark ? "bg-white text-black" : "bg-stone-900 text-stone-100"}`}
            >
              <motion.span className="block text-pink-500 text-sm tracking-[0.3em] uppercase mb-4 font-bold">
                Save The Date
              </motion.span>
              
              <h1 className="text-5xl font-serif mb-6">
                Dhilip <span className="text-pink-500">&</span> Partner
              </h1>

              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIndex}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  className="text-xl italic font-serif mb-8 h-8"
                >
                  {quotes[quoteIndex]}
                </motion.p>
              </AnimatePresence>

              <div className="flex justify-center gap-4 mb-8">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="flex flex-col items-center">
                    <span className="text-2xl font-bold">{value}</span>
                    <span className="text-[10px] uppercase opacity-60">{unit}</span>
                  </div>
                ))}
              </div>

              <div className="text-sm border-t border-current/10 pt-6 opacity-80">
                WEDNESDAY • MAY 20 • 2026
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* DETAILS SECTION */}
      {opened && (
        <section className="min-h-screen flex flex-col justify-center items-center gap-12 px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-12 rounded-[40px] backdrop-blur-xl border w-full max-w-2xl
              ${isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}
          >
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-serif text-pink-400">The Vows</h2>
                <p className="text-lg opacity-80">Muhurtham</p>
                <p className="text-2xl font-bold">9:00 AM - 10:30 AM</p>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-serif text-pink-400">The Party</h2>
                <p className="text-lg opacity-80">Grand Reception</p>
                <p className="text-2xl font-bold">Starts at 6:30 PM</p>
              </div>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open("https://maps.google.com")}
            className={`px-12 py-4 rounded-full font-bold text-lg shadow-xl transition-all
              ${isDark ? "bg-white text-black hover:bg-pink-100" : "bg-stone-900 text-white hover:bg-stone-800"}`}
          >
            Get Directions 📍
          </motion.button>
        </section>
      )}

      {/* FOOTER */}
      {opened && (
        <section className="h-screen flex items-center justify-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.15 }}
            className="text-7xl md:text-9xl font-serif italic text-center px-4"
          >
            Waiting for you...
          </motion.h2>
        </section>
      )}
    </motion.div>
  );
}
