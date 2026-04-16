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

// --- CINEMATIC INTRO (UPDATED) ---
function CinematicIntro({
  onDone,
  onEnter,
}: {
  onDone: () => void;
  onEnter: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 1000000); // keeps intro alive until user clicks
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[300px] h-[300px] rounded-full bg-purple-500 blur-3xl"
          style={{
            top: `${20 + i * 20}%`,
            left: `${10 + i * 25}%`,
          }}
          animate={{
            scale: [0.8, 1.4, 0.8],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        />
      ))}

      <motion.div
        initial={{ x: "-30%", opacity: 0 }}
        animate={{ x: "30%", opacity: 0.5 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        className="absolute w-[200px] h-full bg-white/10 blur-2xl rotate-12"
      />

      {/* TITLE */}
      <motion.div className="text-center z-10">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, scale: 1, letterSpacing: "0.2em" }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="text-white text-4xl md:text-6xl font-light"
        >
          DHILIP
        </motion.h1>

        <motion.div className="text-purple-300 mt-3 tracking-[0.4em] text-sm md:text-base">
          WEDDING INVITATION
        </motion.div>

        {/* 👇 NEW BUTTON */}
        <motion.button
          onClick={onEnter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8 px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-xl transition-all"
        >
          View Invitation 💌
        </motion.button>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent mt-6"
        />
      </motion.div>
    </motion.div>
  );
}

// --- GLOW ---
function Glow() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0.2, 0.6, 0.2],
        scale: [0.8, 1.4, 0.8],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        repeat: Infinity,
      }}
      className="fixed w-32 h-32 bg-purple-300 rounded-full blur-3xl z-0"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
    />
  );
}

// --- FIREWORK ---
function Firework({ x, y }: { x: number; y: number }) {
  const particles = Array.from({ length: 18 });

  return (
    <>
      {particles.map((_, i) => {
        const angle = (i / particles.length) * 2 * Math.PI;
        const distance = 70 + Math.random() * 80;

        return (
          <motion.span
            key={i}
            initial={{ x, y, opacity: 1, scale: 1 }}
            animate={{
              x: x + Math.cos(angle) * distance,
              y: y + Math.sin(angle) * distance,
              opacity: 0,
              scale: 0.3,
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="fixed w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full z-50 shadow-lg"
          />
        );
      })}
    </>
  );
}

// --- PETAL ---
function Petal() {
  const left = Math.random() * 100;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0, rotate: 0 }}
      animate={{
        y: "110vh",
        opacity: 1,
        x: [0, 30, -30, 0],
        rotate: 360,
      }}
      transition={{
        duration: 6 + Math.random() * 3,
        ease: "linear",
      }}
      className="fixed top-0 text-pink-300 text-xl z-40"
      style={{ left: `${left}%` }}
    >
      🌸
    </motion.div>
  );
}

// --- MAIN COMPONENT ---
export default function WeddingInvitation() {
  const [introDone, setIntroDone] = useState(false);
  const [opened, setOpened] = useState(false);

  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [fireworks, setFireworks] = useState<any[]>([]);
  const [showPetals, setShowPetals] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const fireworkId = useRef(0);

  // --- INTRO CONTROL (UPDATED) ---
  if (!introDone) {
    return (
      <CinematicIntro
        onDone={() => setIntroDone(true)}
        onEnter={() => setIntroDone(true)} // 👈 button triggers entry
      />
    );
  }

  // --- EFFECTS ---
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

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!opened) return;

    const interval = setInterval(() => {
      const fw = {
        id: fireworkId.current++,
        x: Math.random() * window.innerWidth,
        y: Math.random() * (window.innerHeight * 0.5),
      };

      setFireworks((prev) => [...prev, fw]);

      setTimeout(() => {
        setFireworks((prev) => prev.filter((f) => f.id !== fw.id));
      }, 1200);
    }, 500);

    return () => clearInterval(interval);
  }, [opened]);

  // --- ACTION ---
  const openInvitation = () => {
    setOpened(true);
    setShowPetals(true);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.volume = 0;
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);

        let vol = 0;
        const fade = setInterval(() => {
          if (vol >= 1) return clearInterval(fade);
          vol += 0.05;
          audioRef.current!.volume = vol;
        }, 100);
      }
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

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-purple-100 text-gray-800">

      {Array.from({ length: 6 }).map((_, i) => (
        <Glow key={i} />
      ))}

      {fireworks.map((fw) => (
        <Firework key={fw.id} x={fw.x} y={fw.y} />
      ))}

      {showPetals &&
        Array.from({ length: 25 }).map((_, i) => <Petal key={i} />)}

      <audio ref={audioRef} loop>
        <source src={MUSIC_URL} />
      </audio>

      {opened && (
        <button
          onClick={toggleMusic}
          className="fixed top-6 left-6 z-50 bg-white/90 px-5 py-3 rounded-full shadow-xl"
        >
          {isPlaying ? "⏸️ Pause" : "🎵 Play"}
        </button>
      )}

      {/* FADE IN INVITATION */}
      <AnimatePresence>
        {opened && (
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="h-screen flex items-center justify-center px-6 text-center relative z-10"
          >
            <motion.div
              variants={fadeContainer}
              initial="hidden"
              animate="visible"
              className="max-w-xl w-full bg-white p-10 rounded-3xl shadow-xl"
            >
              <motion.div className="text-4xl text-purple-800 mb-4">
                {title}
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

              <motion.div className="flex justify-center gap-6 mt-8 flex-wrap">
                <div>{timeLeft.d} Days</div>
                <div>{timeLeft.h} Hours</div>
                <div>{timeLeft.m} Minutes</div>
                <div>{timeLeft.s} Seconds</div>
              </motion.div>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}