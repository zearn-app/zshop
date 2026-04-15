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
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Scroll-based transforms for the card
  const cardScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Mouse tracking for parallax
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
    const interval = setInterval(() => setQuoteIndex(p => (p + 1) % quotes.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full bg-[#0a0612] transition-all duration-1000 ${opened ? "h-[300vh]" : "h-screen overflow-hidden"}`}
    >
      {/* 🌌 STICKY BACKGROUND LAYER */}
      <motion.div style={{ y: backgroundY }} className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#2d1b4d] via-[#0a0612] to-black" />
        {stars.map((_, i) => <FloatingParticle key={i} i={i} />)}
        
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-0 left-0 w-full h-full bg-pink-900/10 blur-[150px]"
        />
      </motion.div>

      {/* 🌸 FALLING PETALS */}
      <AnimatePresence>
        {opened && petals.map((_, i) => (
          <motion.div
            key={`petal-${i}`}
            initial={{ y: -50, opacity: 0 }}
            animate={{ 
              y: "110vh", 
              x: (Math.random() - 0.5) * 1200, 
              rotate: 360, 
              opacity: [0, 1, 1, 0] 
            }}
            transition={{ duration: 7 + Math.random() * 5, repeat: Infinity, delay: i * 0.2 }}
            className="fixed z-50 text-xl pointer-events-none"
          >
            🌸
          </motion.div>
        ))}
      </AnimatePresence>

      {/* --- CONTENT LAYERS --- */}
      
      <main className="relative z-10 flex flex-col items-center">
        
        {/* SECTION 1: HERO & ENVELOPE */}
        <section className="h-screen w-full flex items-center justify-center p-4 sticky top-0">
          <AnimatePresence mode="wait">
            {!opened ? (
              <motion.div
                key="envelope"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ y: -500, opacity: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }}
                onClick={() => setOpened(true)}
                className="group relative z-20 cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-md p-12 rounded-[2rem] border border-white/20 shadow-2xl flex flex-col items-center"
                >
                  <motion.div 
                    animate={{ y: [0, -10, 0] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-7xl mb-6 relative"
                  >
                    💌
                  </motion.div>
                  <h3 className="text-white font-light tracking-[0.2em] uppercase text-sm">You are invited</h3>
                  <p className="text-white/50 text-xs mt-2 italic">Tap to reveal the magic</p>
                </motion.div>
              </motion.div>
            ) : (
              /* THE MAIN CARD with Scroll Sync */
              <motion.div
                key="card"
                style={{ rotateX, rotateY, scale: cardScale, opacity: cardOpacity }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                initial={{ y: 500, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 40, damping: 20 }}
                className="relative z-10 w-full max-w-lg"
              >
                <div className="relative bg-white/95 backdrop-blur-2xl rounded-[3rem] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] border-4 border-double border-pink-100 overflow-hidden text-center">
                  <motion.div style={{ left: cardGlowX }} className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 pointer-events-none" />
                  
                  <div className="mb-6">
                    {"WEDDING INVITATION".split("").map((char, i) => (
                      <motion.span key={i} className="inline-block text-xs font-black tracking-[0.4em] text-pink-500">{char === " " ? "\u00A0" : char}</motion.span>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.p key={quoteIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-gray-400 italic mb-8 font-serif">"{quotes[quoteIndex]}"</motion.p>
                  </AnimatePresence>

                  <h1 className="text-5xl font-serif font-bold text-gray-800 leading-tight mb-8">
                    Dhilip <br /> <span className="text-3xl text-pink-500">&</span> <br /> Partner Name
                  </h1>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-center gap-3">
                      {["20", "MAY", "2026"].map((item) => (
                        <div key={item} className="px-4 py-3 border border-pink-100 rounded-2xl text-xl font-bold text-gray-800">{item}</div>
                      ))}
                    </div>
                    <p className="text-gray-500 font-medium">📍 Sri Mahal Wedding Hall, Kattur</p>
                  </div>

                  <motion.div className="inline-flex items-center gap-4 bg-gray-900 text-white px-6 py-2 rounded-full text-sm mb-8">
                    <span className="animate-pulse text-pink-400">●</span>
                    <span>{timeLeft.d}d : {timeLeft.h}h : {timeLeft.m}m : {timeLeft.s}s</span>
                  </motion.div>

                  <div className="animate-bounce mt-4 text-pink-400 text-sm">Scroll Down ↓</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* SECTION 2: DETAILS (Reveals on scroll) */}
        {opened && (
          <section className="min-h-screen w-full max-w-4xl px-6 py-24 flex flex-col items-center justify-center space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              className="bg-white/10 backdrop-blur-xl p-12 rounded-[3rem] border border-white/10 w-full text-white"
            >
              <h2 className="text-3xl font-serif text-center mb-12 text-pink-300">The Ceremony</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4 border-l-2 border-pink-500/30 pl-6">
                  <h4 className="text-pink-400 font-bold uppercase tracking-widest text-xs">Muhurtham</h4>
                  <p className="text-xl">Morning 9:00 AM - 10:30 AM</p>
                  <p className="text-white/60 text-sm">Join us for the sacred union and traditional rituals.</p>
                </div>
                <div className="space-y-4 border-l-2 border-pink-500/30 pl-6">
                  <h4 className="text-pink-400 font-bold uppercase tracking-widest text-xs">Reception</h4>
                  <p className="text-xl">Evening 6:30 PM Onwards</p>
                  <p className="text-white/60 text-sm">An evening of celebration, dinner, and memories.</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              className="w-full flex justify-center"
            >
              <button
                onClick={() => window.open("https://maps.google.com", "_blank")}
                className="group bg-white text-black px-12 py-5 rounded-full font-bold text-lg hover:bg-pink-500 hover:text-white transition-all duration-500 shadow-2xl flex items-center gap-3"
              >
                Get Directions to Venue 🗺️
              </button>
            </motion.div>
          </section>
        )}

        {/* SECTION 3: FINAL FOOTER */}
        {opened && (
          <section className="h-screen flex items-center justify-center">
            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               className="text-center"
            >
              <h2 className="text-6xl font-serif text-white/20 mb-4 italic italic">See you there...</h2>
              <p className="text-pink-400 tracking-[0.5em] uppercase text-sm">We can't wait to celebrate with you</p>
            </motion.div>
          </section>
        )}
      </main>

      <style jsx global>{`
        body { background: #0a0612; overflow-x: hidden; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};

export default WeddingInvitation;
