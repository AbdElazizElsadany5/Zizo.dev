import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDone(true);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 500);
          }, 250);
          return 100;
        }
        const diff = Math.floor(Math.random() * 15) + 5;
        return Math.min(prev + diff, 100);
      });
    }, 85);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#080b11] overflow-hidden px-4 select-none touch-none w-screen h-screen"
        >
          {/* Ambient Background Glows (Properly scaled for mobile) */}
          <div className="absolute w-[280px] sm:w-[450px] h-[280px] sm:h-[450px] rounded-full bg-cyan-500/15 sm:bg-cyan-500/10 blur-[80px] sm:blur-[120px] pointer-events-none -z-10" />
          <div className="absolute w-[220px] sm:w-[350px] h-[220px] sm:h-[350px] rounded-full bg-violet-600/15 sm:bg-violet-600/10 blur-[70px] sm:blur-[100px] pointer-events-none -z-10" />

          {/* Center Monogram Container */}
          <div className="relative flex flex-col items-center max-w-full">
            {/* Rotating Ambient Rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-5 sm:-inset-8 rounded-full border border-dashed border-cyan-500/25 pointer-events-none"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-10 sm:-inset-14 rounded-full border border-cyan-500/15 pointer-events-none"
            />

            {/* Glowing Hexagon Badge with Stylized "Z" Logo */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-cyan-500/35 shadow-[0_0_40px_rgba(6,182,212,0.3)] backdrop-blur-xl">
              {/* Neon SVG Path Drawing for Z */}
              <svg
                width="54"
                height="54"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="overflow-visible w-14 h-14 sm:w-16 sm:h-16"
              >
                <defs>
                  <linearGradient id="zGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#06b6d4" floodOpacity="0.8" />
                  </filter>
                </defs>

                {/* Decorative background trace */}
                <path
                  d="M20 25 L80 25 L30 75 L80 75"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Animated Glowing "Z" Path */}
                <motion.path
                  d="M20 25 L80 25 L30 75 L80 75"
                  stroke="url(#zGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: 1.2, ease: 'easeInOut' },
                    opacity: { duration: 0.3 }
                  }}
                />

                {/* Accent Corner Dots */}
                <circle cx="20" cy="25" r="3.5" fill="#38bdf8" />
                <circle cx="80" cy="75" r="3.5" fill="#818cf8" />
              </svg>
            </div>

            {/* Typography */}
            <div className="mt-6 sm:mt-8 flex flex-col items-center text-center px-2">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="font-mono text-[10px] sm:text-xs tracking-[0.22em] sm:tracking-[0.3em] uppercase text-cyan-400 font-semibold mb-1.5 sm:mb-2"
              >
                ZIZO • PORTFOLIO
              </motion.span>
              <h2 className="text-lg sm:text-xl font-bold tracking-normal sm:tracking-wider text-slate-100 font-['Outfit']">
                AbdElaziz Elsadany
              </h2>
            </div>

            {/* Progress Bar & Counter */}
            <div className="w-48 sm:w-60 max-w-[80vw] mt-5 sm:mt-6 flex flex-col items-center gap-2">
              <div className="w-full h-1.5 sm:h-2 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/40 p-[1px]">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                />
              </div>

              <div className="w-full flex justify-between items-center text-[11px] sm:text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  LOADING
                </span>
                <span className="text-cyan-300 font-bold">{progress}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
