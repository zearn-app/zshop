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
const PETAL_COUNT = 45;
const STAR_COUNT = 80;

const petals = Array.from({ length: PETAL_COUNT });
const stars = Array.from({ length: STAR_COUNT });

const weddingDate = new Date("2026-05-20T10:00:00");

const quotes = [
  "Two hearts, one soul ❤️",
  "A journey of love begins 💍",
  "Together forever ♾️",
  "Love brought us here 💖",
];

// --- Floating Stars ---
const FloatingParticle = () => {
  return (
    <motion.div
      className="absolute bg-white/20 rounded-full blur-[1px]"
      style={{
        width: Math.random() * 3 + 1,
        height: Math.random() * 3 + 1,
        left: `${Math.random() * 100}%`,
        top: "100%",
      }}
      animate={{
        y: ["0vh", "-120vh"],
        x: [0, (Math.random() - 0.5) * 80],
        opacity: [0, 0.8, 0],
      }}
      transition={{
        duration: 12 + Math.random() * 15,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

// 🌸 NEW PETAL COMPONENT (CLEAN + SPREAD)
const Petal = ({ i }: { i: number }) => {
  const startX = Math.random() * window.innerWidth;
  const direction = Math.random() > 0.5 ? 1 : -1;

  const driftX1 = (Math.random() * 200 + 50) * direction;
  const driftX2 = (Math.random() * 300 + 100) * -direction;

  const rotateStart = Math.random() * 180;
  const rotateEnd = rotateStart + (Math.random() * 720 + 360);

  const scale = Math.random() * 0.6 + 0.6;
  const blur = Math.random() * 2;

  return (
    <motion.div
      initial={{
        x: startX,
        y: -50,
        opacity: 0,
        rotate: rotateStart,
        scale,
      }}
      animate={{
        x: [startX, startX + driftX1, startX + driftX2],
        y: ["0vh", "50vh", "110vh"],
        rotate: rotateEnd,
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay: i * 0.15,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        filter: `blur(${blur}px)`,
      }}
      className="fixed z-50 text-2xl pointer-events-none"
    >
      🌸
    </motion.div>
  );
};

// --- Main Component ---
const WeddingInvitation = () => {
  const [opened, setOpened] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [quoteIndex, setQuoteIndex] = useState(0);

  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const cardScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

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
        opened ? "h-[300vh]" : "h-screen overflow-hidden"
      }`}
    >
      {/* 🌌 Background */}
      <motion.div style={{ y: backgroundY }} className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2d1b4d] to-black" />
        {stars.map((_, i) => (
          <FloatingParticle key={i} />
        ))}
      </motion.div>

      {/* 🌸 NEW PETALS */}
      <AnimatePresence>
        {opened &&
          petals.map((_, i) => <Petal key={i} i={i} />)}
      </AnimatePresence>

      {/* 🎯 Content */}
      <main className="relative z-10 flex flex-col items-center">
        <section className="h-screen flex items-center justify-center">
          {!opened ? (
            <motion.div
              onClick={() => setOpened(true)}
              className="cursor-pointer bg-white/10 p-10 rounded-3xl text-white"
            >
              💌 Tap to Open
            </motion.div>
          ) : (
            <motion.div
              style={{ rotateX, rotateY, scale: cardScale, opacity: cardOpacity }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="bg-white p-10 rounded-3xl text-center max-w-md"
            >
              <h1 className="text-4xl font-bold mb-6">
                Dhilip & Partner
              </h1>

              <p className="mb-4 text-gray-500 italic">
                {quotes[quoteIndex]}
              </p>

              <p className="mb-4">📅 May 20, 2026</p>
              <p className="mb-4">📍 Sri Mahal, Kattur</p>

              <div className="text-sm bg-black text-white px-4 py-2 rounded-full inline-block">
                {timeLeft.d}d : {timeLeft.h}h : {timeLeft.m}m : {timeLeft.s}s
              </div>
            </motion.div>
          )}
        </section>
      </main>
    </div>
  );
};

export default WeddingInvitation;