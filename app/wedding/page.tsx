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
function CinematicIntro({ onEnter }: { onEnter: () => void }) {
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

      {/* ENVELOPE STAGE */}
      <motion.div className="text-center z-10">
        <motion.div
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          className="text-6xl"
        >
          💌
        </motion.div>

        <motion.h1 className="text-white text-4xl mt-4 font-light">
          DHILIP
        </motion.h1>

        <motion.div className="text-purple-300 mt-2 tracking-[0.4em]">
          WEDDING INVITATION
        </motion.div>

        {/* OPEN BUTTON */}
        <motion.button
          onClick={onEnter}
          className="mt-8 px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-xl"
          whileTap={{ scale: 0.95 }}
        >
          Open Envelope ✉️
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
  const [screen, setScreen] = useState<"intro" | "open" | "main">("intro");

  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [quoteIndex, setQuoteIndex] = useState(0);

  const [opened, setOpened] = useState(false);
  const [showPetals, setShowPetals] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // --- ENTER ---
  const enterSite = () => {
    setScreen("open"); // envelope stage
    setTimeout(() => setScreen("main"), 1200); // cinematic zoom delay
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

      {/* INTRO */}
      <AnimatePresence>
        {screen === "intro" && (
          <CinematicIntro onEnter={enterSite} />
        )}
      </AnimatePresence>

      {/* ENVELOPE TRANSITION SCREEN */}
      {screen === "open" && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black z-50"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            initial={{ scale: 0.5, rotateX: 80, opacity: 0 }}
            animate={{ scale: 1, rotateX: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-6xl"
          >
            📜 Opening Letter...
          </motion.div>
        </motion.div>
      )}

      {/* MAIN */}
      {screen === "main" && (
        <>
          {Array.from({ length: 6 }).map((_, i) => (
            <Glow key={i} />
          ))}

          {showPetals &&
            Array.from({ length: 25 }).map((_, i) => <Petal key={i} />)}

          <audio ref={audioRef} loop>
            <source src={MUSIC_URL} />
          </audio>

          {/* INVITATION CARD */}
          <section className="h-screen flex items-center justify-center text-center">
            {!opened ? (
              <motion.div
                onClick={openInvitation}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="cursor-pointer bg-white p-16 rounded-3xl shadow-2xl"
              >
                <div className="text-6xl">💌</div>
                <h2 className="text-purple-600">Tap to Open Invitation</h2>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 1,
                  type: "spring",
                }}
                className="bg-white p-10 rounded-3xl shadow-xl max-w-xl w-full"
              >
                {/* PAPER UNFOLD EFFECT */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.8 }}
                  className="origin-top"
                >
                  <h1 className="text-4xl text-purple-800 mb-4">
                    {title}
                  </h1>

                  <p className="text-purple-600 mb-4">
                    With blessings of our families
                  </p>

                  <h2 className="text-2xl text-purple-700 mb-4">
                    Dhilip 💜 Partner
                  </h2>

                  <motion.p
                    key={quoteIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-purple-500"
                  >
                    {quotes[quoteIndex]}
                  </motion.p>

                  <div className="mt-6 flex justify-center gap-4">
                    <div>{timeLeft.d}D</div>
                    <div>{timeLeft.h}H</div>
                    <div>{timeLeft.m}M</div>
                    <div>{timeLeft.s}S</div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </section>
        </>
      )}
    </div>
  );
}