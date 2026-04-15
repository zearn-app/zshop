"use client";

import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

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

  // ✅ FIXED TYPE HERE
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
    window.open(
      "https://maps.google.com/?q=Sri+Mahal+Wedding+Hall+Kattur+Tamil+Nadu",
      "_blank"
    );
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

      {/* 🌸 Floating Petals */}
      <AnimatePresence>
        {opened &&
          petals.map((_, i) => (
            <motion.div
              key={`petal-${i}`}
              className="absolute z-50 pointer-events-none text-2xl"
              initial={{ y: -100, x: Math.random() * 1200, opacity: 0 }}
              animate={{
                y: "110vh",
                x: Math.random() * 1000,
                rotate: 720,
                opacity: [0, 1, 1, 0],
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

      {/* 💜 HEART */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            className="relative z-20 cursor-pointer group"
            onClick={() => setOpened(true)}
            exit={{ scale: 0, opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="text-9xl"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              💜
            </motion.div>

            <motion.p
              className="text-white mt-4 text-center uppercase"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Tap to Open
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎉 CARD */}
      <AnimatePresence>
        {opened && (
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            className="relative z-10 max-w-xl w-full bg-white/10 backdrop-blur-2xl rounded-[2rem] p-1"
          >
            <div className="bg-white/90 rounded-[1.8rem] p-8 text-center">
              <h1 className="text-5xl font-serif text-gray-800 mb-6">
                Wedding Invitation
              </h1>

              <h2 className="text-3xl font-bold">Dhilip</h2>
              <p>&</p>
              <h2 className="text-3xl font-bold">Partner Name</h2>

              <button
                onClick={openMap}
                className="mt-6 px-6 py-3 bg-black text-white rounded-full"
              >
                📍 Get Directions
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeddingInvitation;