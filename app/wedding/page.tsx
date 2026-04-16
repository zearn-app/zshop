"use client";

import React, { useEffect, useRef, useState } from "react";
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
    h: Math.max(0, Math.floor((diff / (1000 * 60 * 60) % 24))),
    m: Math.max(0, Math.floor((diff / (1000 * 60) % 60))),
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
        transition={{ duration: 0.8 }}
        onClick={onOpen}
      >
        <motion.div
          className="text-7xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💌
        </motion.div>

        {/* Name reveal */}
        <motion.h1
          className="text-white text-3xl mt-4 font-serif"
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {couple.groom} & {couple.bride}
        </motion.h1>

        <motion.p
          className="text-purple-300 mt-2 tracking-[0.3em] text-sm"
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "0.3em" }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          WEDDING INVITATION
        </motion.p>

        <motion.p
          className="mt-6 text-white/60 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Tap to open ✨
        </motion.p>
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

// ---------------- FLIP CARD ----------------
function FlipCard({ value }: { value: number }) {
  return (
    <div className="w-20 h-24">
      <motion.div
        key={value}
        initial={{ rotateX: -90, opacity: 0 }}
        animate={{
          rotateX: 0,
          opacity: 1,
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 0.6 }}
        className="w-full h-full flex items-center justify-center bg-white/80 rounded-xl shadow text-2xl font-bold"
      >
        {value}
      </motion.div>
    </div>
  );
}

// ---------------- SECTION WRAPPER ----------------
function StorySection({ children }: any) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95, y: 80 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8 }}
      className="py-16 text-center"
    >
      {children}
    </motion.section>
  );
}

// ---------------- TEXT WRAPPER ----------------
function FadeText({ children }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
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
  const globalY = useTransform(scrollYProgress, [0, 1], [0, -30]);

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
        
        {/* ❤️ HEARTBEAT ADDED HERE */}
        <motion.h1
          className="font-serif text-lg"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <span className="inline-block animate-pulse">
            {couple.groom}
          </span>
          {" "}💜{" "}
          <span className="inline-block animate-pulse">
            {couple.bride}
          </span>
        </motion.h1>

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

                  {/* HEADER */}
                  <motion.div className="text-center py-20">
                    <motion.h1
                      className="text-5xl md:text-6xl font-serif"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      A Love Story
                    </motion.h1>

                    <FadeText>
                      <p className="mt-2 opacity-70">
                        Scroll to experience our journey
                      </p>
                    </FadeText>
                  </motion.div>

                  {/* HERO */}
                  <StorySection>
                    <FadeText>
                      <h1 className="text-4xl md:text-6xl font-serif">
                        {couple.groom} ❤️ {couple.bride}
                      </h1>
                    </FadeText>

                    <FadeText>
                      <p className="mt-4 italic opacity-80">
                        Two hearts, one soul, forever begins here
                      </p>
                    </FadeText>
                  </StorySection>

                  {/* COUNTDOWN */}
                  <StorySection>
                    <FadeText>
                      <h2 className="text-2xl font-serif mb-6">
                        Countdown to Forever
                      </h2>
                    </FadeText>

                    <div className="flex flex-wrap justify-center gap-4">
                      {Object.entries(time).map(([k, v]) => (
                        <div key={k} className="text-center">
                          <FlipCard value={v} />
                          <div className="text-xs mt-2 uppercase tracking-widest">
                            {k}
                          </div>
                        </div>
                      ))}
                    </div>
                  </StorySection>

                  {/* INVITATION */}
                  <StorySection>
                    <FadeText>
                      <h2 className="text-2xl font-serif mb-4">
                        Wedding Invitation
                      </h2>
                    </FadeText>

                    <FadeText>
                      <p className="opacity-80 max-w-xl mx-auto leading-relaxed">
                        With joyful hearts, we invite you to celebrate our union and bless our journey of love.
                      </p>

                      {/* ❤️ NEW INVITE MESSAGE */}
                      <p className="mt-4 font-medium text-pink-500">
                        Come with your family and bless us with full of heart ❤️
                      </p>
                    </FadeText>
                  </StorySection>

                  {/* EVENT */}
                  <StorySection>
                    <FadeText>
                      <h2 className="text-2xl font-serif mb-6">Event Details</h2>
                    </FadeText>

                    <div className="flex flex-wrap justify-center gap-4">
                      {["📅", "⏰", "📍"].map((icon, i) => (
                        <FadeText key={i}>
                          <div className="bg-white/70 p-4 rounded-2xl shadow hover:scale-105 transition">
                            {icon}{" "}
                            {[eventDetails.date, eventDetails.time, eventDetails.location][i]}
                          </div>
                        </FadeText>
                      ))}
                    </div>

                    <FadeText>
                      <div className="mt-6 px-4">
                        <iframe
                          src={eventDetails.mapEmbed}
                          className="w-full h-64 rounded-2xl shadow-lg border-0"
                          loading="lazy"
                        />
                      </div>
                    </FadeText>
                  </StorySection>

                  {/* GALLERY */}
                  <StorySection>
                    <FadeText>
                      <h2 className="text-2xl font-serif mb-6">Our Memories</h2>
                    </FadeText>

                    <motion.div style={{ y: globalY }}>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
                        {gallery.map((img, i) => (
                          <motion.img
                            key={i}
                            whileHover={{ scale: 1.08 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            src={img}
                            className="rounded-2xl shadow-lg object-cover w-full h-40 md:h-48"
                          />
                        ))}
                      </div>
                    </motion.div>
                  </StorySection>

                  {/* END */}
                  <motion.div
                    className="py-20 text-center text-xl opacity-70"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                  >
                    The Beginning of Forever ❤️
                  </motion.div>

                </PaperUnfold>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}
    </div>
  );
}