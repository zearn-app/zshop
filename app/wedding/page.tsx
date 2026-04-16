"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------- CONFIG ----------------
const weddingDate = new Date("2026-05-20T10:00:00");

const couple = {
  bride: "Partner",
  groom: "Dhilip",
};

const gallery = ["/w1.jpg", "/w2.jpg", "/w3.jpg", "/w4.jpg"];

const timeline = [
  { title: "We Met", desc: "A beautiful coincidence turned destiny." },
  { title: "First Talk", desc: "Endless conversations began." },
  { title: "Love Grew", desc: "Every moment became special." },
  { title: "Forever", desc: "Now we begin our forever." },
];

// ---------------- UTIL ----------------
function getTimeLeft() {
  const diff = weddingDate.getTime() - Date.now();
  return {
    d: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
    h: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
    m: Math.max(0, Math.floor((diff / (1000 * 60)) % 60)),
    s: Math.max(0, Math.floor((diff / 1000) % 60)),
  };
}

// ---------------- ENVELOPE INTRO ----------------
function EnvelopeIntro({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-black via-purple-950 to-black z-50 overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* glowing orbs */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-40 h-40 rounded-full bg-purple-500 blur-3xl opacity-20"
          animate={{
            scale: [1, 1.5, 1],
            x: [0, 40, -40, 0],
            y: [0, -40, 40, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: i * 0.4,
          }}
          style={{
            top: `${20 + i * 10}%`,
            left: `${10 + i * 12}%`,
          }}
        />
      ))}

      {/* envelope */}
      <motion.div
        className="text-center z-10 cursor-pointer"
        initial={{ scale: 0.6, opacity: 0, rotateX: 80 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        transition={{ duration: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpen}
      >
        <motion.div
          className="text-7xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💌
        </motion.div>

        <h1 className="text-white text-3xl mt-4 font-serif">
          Dhilip & Partner
        </h1>

        <p className="text-purple-300 mt-2 tracking-[0.3em] text-sm">
          WEDDING INVITATION
        </p>

        <motion.div
          className="mt-6 text-white/70 text-sm"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Tap to open envelope ✨
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ---------------- MAIN ----------------
export default function WeddingPage() {
  const [time, setTime] = useState(getTimeLeft());
  const [music, setMusic] = useState(false);
  const [theme, setTheme] = useState("light");
  const [rsvp, setRsvp] = useState(false);

  // NEW: intro control
  const [intro, setIntro] = useState(true);
  const [opened, setOpened] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const t = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    music ? audioRef.current.play().catch(() => {}) : audioRef.current.pause();
  }, [music]);

  const share = async () => {
    try {
      await navigator.share({
        title: "Wedding Invitation",
        text: `${couple.groom} ❤️ ${couple.bride} Wedding Invitation`,
        url: window.location.href,
      });
    } catch {}
  };

  return (
    <div
      className={
        theme === "dark"
          ? "bg-black text-white min-h-screen"
          : "bg-pink-50 text-gray-800 min-h-screen"
      }
    >
      {/* ENVELOPE INTRO */}
      <AnimatePresence>
        {intro && (
          <EnvelopeIntro
            onOpen={() => {
              setIntro(false);
              setTimeout(() => setOpened(true), 600);
            }}
          />
        )}
      </AnimatePresence>

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-pink-100 via-purple-100 to-rose-100" />

      {/* FLOATING HEARTS */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed text-pink-300 text-xl"
          initial={{ y: "100vh", x: Math.random() * 100 + "vw" }}
          animate={{ y: "-10vh" }}
          transition={{ duration: 10 + Math.random() * 10, repeat: Infinity }}
        >
          💖
        </motion.div>
      ))}

      {/* TOP BAR */}
      <div className="flex justify-between p-4 backdrop-blur-md bg-white/40 sticky top-0 z-40">
        <h1 className="font-serif text-xl">
          {couple.groom} ❤️ {couple.bride}
        </h1>

        <div className="flex gap-3">
          <button onClick={() => setMusic(!music)}>🎵</button>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            🌓
          </button>
          <button onClick={share}>🔗</button>
        </div>
      </div>

      <audio ref={audioRef} loop>
        <source src="/music.mp3" />
      </audio>

      {/* HERO */}
      {opened && (
        <>
          <section className="h-screen flex flex-col items-center justify-center text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-serif"
            >
              {couple.groom} ❤️ {couple.bride}
            </motion.h1>

            <p className="mt-4 text-lg italic opacity-80">
              Two hearts, one soul, forever begins here
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setRsvp(true)}
              className="mt-6 px-6 py-3 rounded-full bg-pink-500 text-white shadow-lg"
            >
              RSVP Now
            </motion.button>
          </section>

          {/* COUNTDOWN */}
          <section className="py-20 text-center">
            <h2 className="text-3xl font-serif mb-6">
              Countdown to Forever
            </h2>

            <div className="flex justify-center gap-6 text-2xl">
              {Object.entries(time).map(([k, v]) => (
                <div
                  key={k}
                  className="bg-white/60 px-4 py-3 rounded-xl shadow"
                >
                  <div className="text-3xl font-bold">{v}</div>
                  <div className="text-sm uppercase">{k}</div>
                </div>
              ))}
            </div>
          </section>

          {/* INVITATION */}
          <section className="max-w-3xl mx-auto p-6">
            <div className="backdrop-blur-xl bg-white/60 p-10 rounded-3xl shadow-xl text-center">
              <h2 className="text-2xl font-serif mb-4">
                Wedding Invitation
              </h2>
              <p>
                With joyful hearts, we invite you to celebrate our union and
                bless our journey of love.
              </p>
            </div>
          </section>

          {/* EVENT DETAILS */}
          <section className="py-20 text-center">
            <h2 className="text-3xl font-serif mb-6">Event Details</h2>

            <div className="flex flex-col md:flex-row justify-center gap-6">
              <div className="bg-white/70 p-6 rounded-2xl shadow">
                📅 20 May 2026
              </div>
              <div className="bg-white/70 p-6 rounded-2xl shadow">
                ⏰ 10:00 AM
              </div>
              <div className="bg-white/70 p-6 rounded-2xl shadow">
                📍 Wedding Hall, Tamil Nadu
              </div>
            </div>
          </section>

          {/* GALLERY */}
          <section className="py-20 px-6">
            <h2 className="text-3xl text-center font-serif mb-10">
              Gallery
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((img, i) => (
                <motion.img
                  key={i}
                  src={img}
                  className="rounded-2xl shadow-lg hover:scale-105 transition-transform"
                />
              ))}
            </div>
          </section>

          {/* LOVE STORY */}
          <section className="py-20 max-w-3xl mx-auto">
            <h2 className="text-3xl text-center font-serif mb-10">
              Our Story
            </h2>

            <div className="space-y-6">
              {timeline.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="bg-white/60 p-6 rounded-xl shadow"
                >
                  <h3 className="font-bold">{t.title}</h3>
                  <p>{t.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* FOOTER */}
          <footer className="text-center py-10 opacity-70">
            Made with 💖 for a beautiful beginning
          </footer>

          {/* RSVP MODAL */}
          <AnimatePresence>
            {rsvp && (
              <motion.div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white p-8 rounded-2xl w-80 text-center"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  <h2 className="text-xl mb-4">RSVP</h2>
                  <input
                    className="border p-2 w-full mb-3"
                    placeholder="Your Name"
                  />
                  <button className="bg-pink-500 text-white px-4 py-2 rounded-full w-full">
                    Confirm
                  </button>

                  <button
                    onClick={() => setRsvp(false)}
                    className="mt-3 text-sm opacity-70"
                  >
                    Close
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}