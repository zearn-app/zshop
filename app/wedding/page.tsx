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

// --- CINEMATIC INTRO ---
function CinematicIntro({
  onEnter,
}: {
  onEnter: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
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

      <motion.div className="text-center z-10">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-white text-4xl md:text-6xl font-light"
        >
          DHILIP
        </motion.h1>

        <motion.div className="text-purple-300 mt-3 tracking-[0.4em]">
          WEDDING INVITATION
        </motion.div>

        {/* FIXED BUTTON */}
        <motion.button
          onClick={onEnter}
          className="mt-8 px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          View Invitation 💌
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// --- GLOW ---
function Glow() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.2, 0.6, 0.2] }}
      transition={{ duration: 4, repeat: Infinity }}
      className="fixed w-32 h-32 bg-purple-300 rounded-full blur-3xl z-0"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
    />
  );
}

// --- PETAL ---
function Petal() {
  const left = Math.random() * 100;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: "110vh", opacity: 1 }}
      transition={{ duration: 7, ease: "linear" }}
      className="fixed top-0 text-pink-300 z-40"
      style={{ left: `${left}%` }}
    >
      🌸
    </motion.div>
  );
}

// --- MAIN ---
export default function WeddingInvitation() {
  // ✅ FIX: single safe screen controller
  const [screen, setScreen] = useState<"intro" | "main">("intro");

  const [opened, setOpened] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [quoteIndex, setQuoteIndex] = useState(0);

  const [fireworks, setFireworks] = useState<any[]>([]);
  const [showPetals, setShowPetals] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const fireworkId = useRef(0);

  // --- ENTER FROM INTRO (SAFE) ---
  const enterSite = () => {
    setScreen("main");
  };

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

  // --- OPEN INVITATION ---
  const openInvitation = () => {
    setOpened(true);
    setShowPetals(true);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.volume = 0;
        audioRef.current.play().catch(() => {});

        let vol = 0;
        const fade = setInterval(() => {
          if (vol >= 1) return clearInterval(fade);
          vol += 0.05;
          audioRef.current!.volume = vol;
        }, 100);
      }
    }, 500);
  };

  const title = "Dhilip & Partner";

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-purple-100 text-gray-800">

      {/* INTRO SCREEN */}
      <AnimatePresence>
        {screen === "intro" && (
          <CinematicIntro onEnter={enterSite} />
        )}
      </AnimatePresence>

      {/* MAIN SCREEN (SAFE) */}
      {screen === "main" && (
        <>
          {Array.from({ length: 6 }).map((_, i) => (
            <Glow key={i} />
          ))}

          {fireworks.map((fw) => (
            <motion.div
              key={fw.id}
              className="fixed w-2 h-2 bg-pink-400 rounded-full z-50"
              style={{ left: fw.x, top: fw.y }}
            />
          ))}

          {showPetals &&
            Array.from({ length: 25 }).map((_, i) => <Petal key={i} />)}

          <audio ref={audioRef} loop>
            <source src={MUSIC_URL} />
          </audio>

          <section className="h-screen flex items-center justify-center text-center">
            {!opened ? (
              <div
                onClick={openInvitation}
                className="cursor-pointer bg-white p-16 rounded-3xl shadow-2xl"
              >
                <div className="text-6xl">💌</div>
                <h2 className="text-purple-600">Tap to Open Invitation</h2>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-10 rounded-3xl shadow-xl max-w-xl w-full"
              >
                <h1 className="text-4xl text-purple-800 mb-4">{title}</h1>

                <p className="text-purple-600 mb-4">
                  With blessings of our families
                </p>

                <h2 className="text-2xl text-purple-700 mb-4">
                  Dhilip 💜 Partner
                </h2>

                <p className="text-purple-500">{quotes[quoteIndex]}</p>

                <div className="mt-6 flex justify-center gap-4">
                  <div>{timeLeft.d}D</div>
                  <div>{timeLeft.h}H</div>
                  <div>{timeLeft.m}M</div>
                  <div>{timeLeft.s}S</div>
                </div>
              </motion.div>
            )}
          </section>
        </>
      )}
    </div>
  );
}