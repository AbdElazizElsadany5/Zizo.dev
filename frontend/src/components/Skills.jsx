import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Layout, Server, Terminal, Cpu, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const ICON_MAP = {
  'code-2': Code2,
  layout: Layout,
  server: Server,
  terminal: Terminal,
};

export default function Skills({ skills = [] }) {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef(null);
  const isClickingRef = useRef(false);

  const displaySkills = skills.length > 0 ? skills : [
    {
      category: "Languages & Core",
      icon: "code-2",
      badge: "Core Fundamentals",
      skills: [
        { name: "JavaScript (ES6+)", level: 95 },
        { name: "TypeScript", level: 85 },
        { name: "HTML5 & CSS3", level: 95 },
        { name: "PHP / Python", level: 75 }
      ]
    },
    {
      category: "Frontend Frameworks",
      icon: "layout",
      badge: "Modern UI Architecture",
      skills: [
        { name: "React.js", level: 92 },
        { name: "Next.js (App Router)", level: 90 },
        { name: "TailwindCSS", level: 95 },
        { name: "Redux / Zustand", level: 85 }
      ]
    },
    {
      category: "Backend & Databases",
      icon: "server",
      badge: "High-Concurrency APIs",
      skills: [
        { name: "Node.js / Express", level: 90 },
        { name: "MongoDB", level: 88 },
        { name: "PostgreSQL / MySQL", level: 85 },
        { name: "RESTful & GraphQL APIs", level: 90 }
      ]
    },
    {
      category: "Tools & DevOps",
      icon: "terminal",
      badge: "CI/CD & Cloud Ops",
      skills: [
        { name: "Git & GitHub", level: 95 },
        { name: "Docker", level: 70 },
        { name: "Linux / Bash", level: 80 },
        { name: "Vercel / Netlify / AWS", level: 90 }
      ]
    }
  ];

  const total = displaySkills.length;

  // Track natural scroll through the tall container to reveal cards box-by-box
  useEffect(() => {
    const onScroll = () => {
      if (isClickingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;

      if (totalScrollable <= 0) return;

      const progress = -rect.top / totalScrollable;
      const clamped = Math.max(0, Math.min(0.999, progress));
      const targetStep = Math.floor(clamped * total);

      if (targetStep !== activeStep && targetStep >= 0 && targetStep < total) {
        setActiveStep(targetStep);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [activeStep, total]);

  // Jump to specific step on dot/arrow click
  const goToStep = (idx) => {
    isClickingRef.current = true;
    setActiveStep(idx);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY + rect.top;
      const totalScrollable = rect.height - window.innerHeight;
      const targetScroll = scrollTop + (idx / total) * totalScrollable + 20;

      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }

    setTimeout(() => {
      isClickingRef.current = false;
    }, 700);
  };

  const nextStep = () => {
    if (activeStep < total - 1) {
      goToStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      goToStep(activeStep - 1);
    }
  };

  return (
    <section
      id="skills"
      ref={containerRef}
      style={{ height: `${total * 95}vh` }}
      className="relative bg-[#080b11] border-b border-white/[0.06]"
    >
      {/* Pinned Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-[150px] pointer-events-none -z-10" />

        <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
          
          {/* Section Header */}
          <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-semibold tracking-wider text-cyan-300 uppercase shadow-sm mb-4">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>EXPERTISE</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-['Outfit'] tracking-tight">
              My Tech Stack
            </h2>

            <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 rounded-full mt-4" />

            {/* Scroll Indicator & Controls */}
            <div className="mt-5 flex items-center gap-6 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Scroll down to unveil boxes side-by-side</span>
              </span>

              <div className="hidden sm:flex items-center gap-2">
                <span className="text-cyan-300 font-bold font-mono">0{activeStep + 1}</span>
                <span className="text-slate-600">/</span>
                <span>0{total}</span>
              </div>

              {/* Arrow navigation buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={prevStep}
                  disabled={activeStep === 0}
                  className={`nav-arrow-btn p-1.5 rounded-full border transition-all flex items-center justify-center ${
                    activeStep === 0
                      ? 'border-white/10 text-slate-600 bg-slate-900/40 opacity-40 cursor-not-allowed'
                      : 'border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400 bg-slate-900/80 hover:bg-slate-800'
                  }`}
                  aria-label="Previous skill category"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={nextStep}
                  disabled={activeStep === total - 1}
                  className={`nav-arrow-btn p-1.5 rounded-full border transition-all flex items-center justify-center ${
                    activeStep === total - 1
                      ? 'border-white/10 text-slate-600 bg-slate-900/40 opacity-40 cursor-not-allowed'
                      : 'border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400 bg-slate-900/80 hover:bg-slate-800'
                  }`}
                  aria-label="Next skill category"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Cards Grid: Boxes Reveal One-by-One from the Side (مربع مربع من الجنب) */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 items-stretch">
            {displaySkills.map((cat, idx) => {
              const Icon = ICON_MAP[cat.icon] || Cpu;
              const isRevealed = idx <= activeStep;
              const isCurrent = idx === activeStep;

              return (
                <motion.div
                  key={idx}
                  initial={false}
                  animate={{
                    opacity: isRevealed ? 1 : 0.12,
                    x: isRevealed ? 0 : 70,
                    scale: isCurrent ? 1.02 : isRevealed ? 1 : 0.94,
                    filter: isRevealed ? 'blur(0px)' : 'blur(4px)',
                  }}
                  transition={{
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`relative p-6 sm:p-7 rounded-3xl bg-[#0d111d]/90 border transition-all duration-300 flex flex-col justify-between shadow-xl backdrop-blur-xl ${
                    isCurrent
                      ? 'border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/30'
                      : isRevealed
                      ? 'border-cyan-500/20 hover:border-cyan-500/40'
                      : 'border-white/[0.05] pointer-events-none'
                  }`}
                >
                  {/* Active Indicator Top Pill */}
                  {isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-mono text-[10px] font-extrabold tracking-wider uppercase shadow-md">
                      ACTIVE BOX
                    </div>
                  )}

                  <div>
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.08]">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors shadow-inner ${
                        isCurrent
                          ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                          : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 font-semibold block uppercase">
                          {cat.badge}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] leading-tight">
                          {cat.category}
                        </h3>
                      </div>
                    </div>

                    {/* Skills Progress List */}
                    <div className="space-y-4">
                      {cat.skills?.map((s, sIdx) => (
                        <div key={sIdx} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs font-medium">
                            <span className={isRevealed ? 'text-slate-200' : 'text-slate-500'}>
                              {s.name}
                            </span>
                            <span className="font-mono text-cyan-400 font-bold">
                              {s.level}%
                            </span>
                          </div>
                          
                          <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden p-[1px]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: isRevealed ? `${s.level}%` : '0%' }}
                              transition={{ duration: 0.8, delay: sIdx * 0.08, ease: 'easeOut' }}
                              className={`h-full rounded-full transition-all ${
                                isCurrent
                                  ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                                  : 'bg-gradient-to-r from-cyan-500/80 to-blue-600/80'
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Counter */}
                  <div className="mt-6 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>STACK 0{idx + 1}</span>
                    <span className={isRevealed ? 'text-cyan-400' : 'text-slate-600'}>
                      {isRevealed ? 'REVEALED' : 'LOCKED'}
                    </span>
                  </div>

                </motion.div>
              );
            })}
          </div>

          {/* Stepper Progress Indicator at the bottom */}
          <div className="mt-8 flex items-center gap-2">
            {displaySkills.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToStep(idx)}
                aria-label={`Go to skill stack ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeStep
                    ? 'w-8 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                    : idx < activeStep
                    ? 'w-3 bg-cyan-600/60'
                    : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
