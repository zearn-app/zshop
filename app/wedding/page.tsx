"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

// --- Types & Constants ---
const petals = Array.from({ length: 40 });
const stars = Array.from({ length: 80 });
const weddingDate = new Date("2026-05-20T10:00:00");
const quotes = [
  "Two hearts, one soul ❤️",
  "A journey of love begins 💍",
  "Together forever ♾️",
  "Love brought us here 💖",
];

// --- Sub-components ---

const FloatingParticle = ({ i }: { i: number }) => {
  const randomX = Math.random() * 100;
  const randomDelay = Math.random() * 5;
  const randomDuration = 10 + Math.random() * 20;

  return (
    <motion.div
      className="absolute bg-white/20 rounded-full blur-[1px] pointer-events-none"
      style={{
        width: Math.random() * 4 + 1,
        height: Math.random() * 4 + 1,
        left: `${randomX}%`,
        top: "100%",
      }}
      animate={{
        y: ["0vh", "-110vh"],
        x: [0, Math.random() * 100 - 50],
        opacity: [0, 0.8, 0],
      }}
      transition={{
        duration: randomDuration,
        repeat: Infinity,
        delay: randomDelay,
        ease: "linear",
      }}
    />
  );
};

const WeddingInvitation = () => {
  const [opened, setOpened] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [quoteIndex, setQuoteIndex] = useState(0);
  
  // 🎯 Mouse tracking for parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  const cardGlowX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // ⏳ Countdown Logic
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

  // 💬 Quote Cycle
  useEffect(() => {
    const interval = setInterval(() => setQuoteIndex(p => (p + 1) % quotes.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#0a0612] flex items-center justify-center p-4 overflow-hidden perspective-1000">
      
      {/* 🌌 DYNAMIC BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#2d1b4d] via-[#0a0612] to-black" />
        {stars.map((_, i) => <FloatingParticle key={i} i={i} />)}
        
        {/* Animated Glow Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-pink-600/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/20 rounded-full blur-[120px]" 
        />
      </div>

      {/* 🌸 FALLING PETALS (Active after open) */}
      <AnimatePresence>
        {opened && petals.map((_, i) => (
          <motion.div
            key={`petal-${i}`}
            initial={{ y: -50, opacity: 0 }}
            animate={{ 
              y: "110vh", 
              x: (Math.random() - 0.5) * 1000, 
              rotate: 360, 
              opacity: [0, 1, 1, 0] 
            }}
            transition={{ duration: 7 + Math.random() * 5, repeat: Infinity, delay: i * 0.2 }}
            className="absolute z-50 text-xl pointer-events-none"
          >
            🌸
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 💜 INTERACTIVE ENVELOPE / BUTTON */}
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="envelope"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ y: -100, opacity: 0, transition: { duration: 0.8, ease: "backIn" } }}
            onClick={() => setOpened(true)}
            className="group relative z-20 cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }}
              className="bg-white/10 backdrop-blur-md p-12 rounded-[2rem] border border-white/20 shadow-2xl flex flex-col items-center"
            >
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-7xl mb-6 relative"
              >
                💌
                <motion.div 
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 bg-pink-500 rounded-full blur-xl -z-10"
                />
              </motion.div>
              <h3 className="text-white font-light tracking-[0.2em] uppercase text-sm">You are invited</h3>
              <p className="text-white/50 text-xs mt-2 italic">Tap to reveal the magic</p>
            </motion.div>
          </motion.div>
        ) : (
          /* 🎉 THE MAIN CARD 🎉 */
          <motion.div
            key="card"
            style={{ rotateX, rotateY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ y: 200, scale: 0.8, opacity: 0, rotateY: 45 }}
            animate={{ y: 0, scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            className="relative z-10 w-full max-w-lg"
          >
            <div className="relative bg-white/95 backdrop-blur-2xl rounded-[3rem] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] border-4 border-double border-pink-100 overflow-hidden text-center">
              
              {/* Dynamic Shine Sweep */}
              <motion.div 
                style={{ left: cardGlowX }}
                className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 pointer-events-none"
              />

              {/* Decorative Corner Flowers */}
              <div className="absolute top-4 left-4 text-2xl opacity-20 rotate-45">🌿</div>
              <div className="absolute top-4 right-4 text-2xl opacity-20 -rotate-45">🌿</div>

              {/* Title Section */}
              <motion.div className="mb-6">
                {"WEDDING INVITATION".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="inline-block text-xs font-black tracking-[0.4em] text-pink-500"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-gray-400 italic mb-8 font-serif"
                >
                  "{quotes[quoteIndex]}"
                </motion.p>
              </AnimatePresence>

              {/* Names Section */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mb-8"
              >
                <h1 className="text-5xl font-serif font-bold text-gray-800 leading-tight">
                  Dhilip <br />
                  <span className="text-3xl text-pink-500">&</span> <br />
                  Partner Name
                </h1>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 1.5 }}
                className="space-y-4 mb-8"
              >
                <div className="flex justify-center items-center gap-4 text-gray-600">
                  <div className="h-px w-8 bg-gray-200" />
                  <span className="text-sm font-medium">SAVE THE DATE</span>
                  <div className="h-px w-8 bg-gray-200" />
                </div>

                {/* Date Boxes */}
                <div className="flex justify-center gap-3">
                  {["20", "MAY", "2026"].map((item, idx) => (
                    <motion.div
                      key={item}
                      whileHover={{ y: -5, backgroundColor: "#fff5f7" }}
                      className="px-4 py-3 border border-pink-100 rounded-2xl"
                    >
                      <span className="block text-xl font-bold text-gray-800">{item}</span>
                    </motion.div>
                  ))}
                </div>

                <p className="text-gray-500 font-medium">
                  📍 Sri Mahal Wedding Hall, Kattur
                </p>
              </motion.div>

              {/* Timer Pill */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                className="inline-flex items-center gap-4 bg-gray-900 text-white px-6 py-2 rounded-full text-sm mb-8"
              >
                <span className="animate-pulse text-pink-400">●</span>
                <span>{timeLeft.d}d : {timeLeft.h}h : {timeLeft.m}m : {timeLeft.s}s</span>
              </motion.div>

              {/* Magnetic Action Button */}
              <div>
                <motion.button
                  whileHover={{ scale: 1.1, boxShadow: "0 20px 40px rgba(244, 63, 94, 0.3)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => window.open("https://maps.google.com", "_blank")}
                  className="relative overflow-hidden group bg-gradient-to-r from-pink-500 to-rose-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl"
                >
                  <motion.span 
                    className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" 
                  />
                  View Location & Details
                </motion.button>
              </div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 2.2 }}
                className="mt-8 text-xs text-gray-400 tracking-widest uppercase"
              >
                With Love, The Family
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default WeddingInvitation;
