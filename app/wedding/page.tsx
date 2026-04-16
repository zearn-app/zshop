"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// ---------------- CONFIG ----------------
const weddingDate = new Date("2026-05-20T10:00:00");

const couple = {
  bride: "Partner",
  groom: "Dhilip",
};

const eventDetails = {
  date: "20 May 2026",
  time: "10:00 AM",
  location: "Kattur, Tamil Nadu",
  mapEmbed: "https://www.google.com/maps?q=Kattur,Tamil+Nadu&output=embed",
};

const gallery = ["/w1.jpeg", "/w2.jpeg", "/w3.jpeg", "/w4.jpeg"];

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

// ---------------- ENVELOPE ----------------
function EnvelopeIntro({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-black via-purple-950 to-black z-50"
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-center cursor-pointer"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
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
          {couple.groom} & {couple.bride}
        </h1>

        <p className="text-purple-300 mt-2 tracking-[0.3em] text-sm">
          WEDDING INVITATION
        </p>

        <p className="mt-6 text-white/60 text-sm">Tap to open ✨</p>
      </motion.div>
    </motion.div>
  );
}

// ---------------- PAPER WRAPPER ----------------
function PaperUnfold({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden"
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.8 }}
      style={{ transformOrigin: "top" }}
    >
      {children}
    </motion.div>
  );
}

// ---------------- FLIP COUNTDOWN CARD ----------------
function FlipNumber({ value }: { value: number }) {
  return (
    <div className="relative w-20 h-24 perspective-1000">
      <motion.div
        key={value}
        initial={{ rotateX: -90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl shadow text-2xl font-bold"
      >
        {value}
      </motion.div>
    </div>
  );
}

// ---------------- MAIN ----------------
export default function WeddingPage() {
  const [time, setTime] = useState(getTimeLeft());
  const [music, setMusic] = useState(false);

  const [intro, setIntro] = useState(true);
  const [opened, setOpened] = useState(false);
  const [paperOpen, setPaperOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const t = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    music ? audioRef.current.play().catch(() => {}) : audioRef.current.pause();
  }, [music]);

  const openInvitation = () => {
    setIntro(false);
    setMusic(true);

    setTimeout(() => {
      setOpened(true);
      setTimeout(() => setPaperOpen(true), 400);
    }, 500);
  };

  const share = async () => {
    try {
      await navigator.share({
        title: "Wedding Invitation",
        text: `${couple.groom} ❤️ ${couple.bride}`,
        url: window.location.href,
      });
    } catch {}
  };

  const { scrollYProgress } = useScroll();

  // SAFE PARALLAX VALUES (no hooks inside loop)
  const yTransforms = useMemo(
    () =>
      gallery.map((_, i) =>
        useTransform(scrollYProgress, [0, 1], [0, i % 2 === 0 ? 40 : -40])
      ),
    [scrollYProgress]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 text-gray-800 overflow-x-hidden">

      {/* ENVELOPE */}
      <AnimatePresence>
        {intro && <EnvelopeIntro onOpen={openInvitation} />}
      </AnimatePresence>

      {/* FLOATING HEARTS */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed text-pink-300 text-xl"
          initial={{ y: "100vh", x: Math.random() * 100 + "vw" }}
          animate={{ y: "-10vh" }}
          transition={{ duration: 12 + Math.random() * 8, repeat: Infinity }}
        >
          💖
        </motion.div>
      ))}

      {/* TOP BAR */}
      <div className="flex justify-between p-4 backdrop-blur-md bg-white/50 sticky top-0 z-40">
        <h1 className="font-serif text-lg">
          {couple.groom} ❤️ {couple.bride}
        </h1>

        <div className="flex gap-3">
          <button onClick={() => setMusic(!music)}>🎵</button>
          <button onClick={share}>🔗</button>
        </div>
      </div>

      <audio ref={audioRef} loop>
        <source src="/music.mp3" />
      </audio>

      {/* MAIN */}
      {opened && (
        <div className="p-4 flex flex-col gap-10">
          <AnimatePresence>
            {paperOpen && (
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
                <PaperUnfold>

                  {/* HERO */}
                  <section className="py-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif">
                      {couple.groom} ❤️ {couple.bride}
                    </h1>
                    <p className="mt-4 italic opacity-80">
                      Two hearts, one soul, forever begins here
                    </p>
                  </section>

                  {/* FLIP COUNTDOWN */}
                  <section className="py-16 text-center">
                    <h2 className="text-2xl font-serif mb-6">Countdown to Forever</h2>

                    <div className="flex flex-wrap justify-center gap-4">
                      {Object.entries(time).map(([k, v]) => (
                        <div key={k} className="text-center">
                          <FlipNumber value={v} />
                          <div className="text-xs mt-2 uppercase">{k}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* INVITATION */}
                  <section className="py-16 text-center max-w-2xl mx-auto">
                    <h2 className="text-2xl font-serif mb-4">Wedding Invitation</h2>
                    <p className="opacity-80">
                      With joyful hearts, we invite you to celebrate our union and bless our journey of love.
                    </p>
                  </section>

                  {/* EVENT */}
                  <section className="py-16 text-center">
                    <h2 className="text-2xl font-serif mb-6">Event Details</h2>

                    <div className="flex flex-wrap justify-center gap-4">
                      <div className="bg-white/70 p-4 rounded-2xl shadow">📅 {eventDetails.date}</div>
                      <div className="bg-white/70 p-4 rounded-2xl shadow">⏰ {eventDetails.time}</div>
                      <div className="bg-white/70 p-4 rounded-2xl shadow">📍 {eventDetails.location}</div>
                    </div>

                    <div className="mt-6 px-4">
                      <iframe
                        src={eventDetails.mapEmbed}
                        className="w-full h-64 rounded-2xl shadow-lg border-0"
                        loading="lazy"
                      />
                    </div>
                  </section>

                  {/* 3D FLIP GALLERY */}
                  <section className="py-16 text-center">
                    <h2 className="text-2xl font-serif mb-6">Our Memories</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
                      {gallery.map((img, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ rotateY: 15, rotateX: 10, scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 120 }}
                          className="perspective-1000"
                        >
                          <motion.img
                            src={img}
                            style={{ y: yTransforms[i] }}
                            className="rounded-2xl shadow-lg object-cover w-full h-40 md:h-48"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </section>

                </PaperUnfold>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}