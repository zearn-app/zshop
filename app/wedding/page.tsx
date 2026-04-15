"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

const petals = Array.from({ length: 20 });
const stars = Array.from({ length: 30 });

const WeddingInvitation = () => {
  const [opened, setOpened] = useState(false);
  
  // --- 3D Tilt Logic ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const openMap = () => {
    window.open("https://maps.google.com/?q=Sri+Mahal+Wedding+Hall+Kattur+Tamil+Nadu", "_blank");
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#1a0b2e] flex items-center justify-center perspective-1000 p-4">
      
      {/* 🌌 Animated Cosmic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-rose-900 opacity-50" />
        {stars.map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3,
              height: Math.random() * 3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.2, 1] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
          />
        ))}
      </div>

      {/* 🌸 Floating Petals (Active after opening) */}
      <AnimatePresence>
        {opened && petals.map((_, i) => (
          <motion.div
            key={`petal-${i}`}
            className="absolute z-50 pointer-events-none text-2xl"
            initial={{ y: -100, x: Math.random() * 1200, opacity: 0 }}
            animate={{ 
              y: "110vh", 
              x: (Math.random() * 1000), 
              rotate: 720,
              opacity: [0, 1, 1, 0] 
            }}
            transition={{
              duration: 7 + Math.random() * 5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.2,
            }}
          >
            🌸
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 💜 INITIAL INTERACTIVE HEART */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            className="relative z-20 cursor-pointer group"
            onClick={() => setOpened(true)}
            exit={{ scale: 0, opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="text-9xl filter drop-shadow-[0_0_30px_rgba(255,100,255,0.8)]"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              💜
            </motion.div>
            <motion.p 
              className="text-white font-light tracking-[0.3em] mt-4 text-center uppercase"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Tap to Open
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎉 THE MAIN INVITATION CARD */}
      <AnimatePresence>
        {opened && (
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="relative z-10 max-w-xl w-full bg-white/10 backdrop-blur-2xl rounded-[2rem] p-1 border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            {/* Inner Content Border */}
            <div className="bg-white/90 rounded-[1.8rem] p-8 md:p-12 text-center overflow-hidden relative">
              
              {/* ✨ Animated Corner Ornaments */}
              {[0, 90, 180, 270].map((rot) => (
                <motion.div
                  key={rot}
                  className="absolute text-rose-300 opacity-40 text-4xl"
                  style={{ 
                    rotate: `${rot}deg`,
                    top: rot < 180 ? 10 : "auto",
                    bottom: rot >= 180 ? 10 : "auto",
                    left: (rot === 90 || rot === 180) ? 10 : "auto",
                    right: (rot === 0 || rot === 270) ? 10 : "auto"
                  }}
                >
                  ❧
                </motion.div>
              ))}

              {/* Header Section */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-rose-500 font-medium tracking-widest uppercase text-sm block mb-2">Save the Date</span>
                <h1 className="text-5xl md:text-6xl font-serif text-gray-800 mb-6">Wedding Invitation</h1>
              </motion.div>

              {/* Names with Springy Animation */}
              <div className="flex flex-col items-center justify-center gap-2 my-8">
                <motion.h2
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                >
                  Dhilip
                </motion.h2>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, type: "spring" }}
                  className="text-3xl text-rose-500"
                >
                  &
                </motion.div>
                <motion.h2
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-rose-600 bg-clip-text text-transparent"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                >
                  Partner Name
                </motion.h2>
              </div>

              {/* Detail Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <motion.div
                  className="bg-rose-50 rounded-2xl p-4 border border-rose-100"
                  whileHover={{ y: -5, backgroundColor: "#fff1f2" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                >
                  <p className="text-rose-600 font-bold uppercase text-xs tracking-tighter mb-1">When</p>
                  <p className="text-gray-800 font-semibold">May 20th, 2026</p>
                  <p className="text-gray-500 text-sm">Wednesday, 10:00 AM</p>
                </motion.div>

                <motion.div
                  className="bg-purple-50 rounded-2xl p-4 border border-purple-100"
                  whileHover={{ y: -5, backgroundColor: "#f5f3ff" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 }}
                >
                  <p className="text-purple-600 font-bold uppercase text-xs tracking-tighter mb-1">Where</p>
                  <p className="text-gray-800 font-semibold">Sri Mahal Hall</p>
                  <p className="text-gray-500 text-sm">Kattur, TN</p>
                </motion.div>
              </div>

              {/* Call to Action */}
              <motion.button
                onClick={openMap}
                className="group relative px-8 py-4 bg-gray-900 text-white rounded-full font-medium overflow-hidden transition-all"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  📍 Get Directions
                </span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-rose-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </motion.button>

              <motion.p
                className="mt-8 text-gray-400 italic text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                "A celebration of love, laughter, and happily ever after."
              </motion.p>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeddingInvitation;
