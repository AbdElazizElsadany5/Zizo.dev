import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Palette, 
  Server, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const ICON_MAP = {
  'code-2': Code2,
  'palette': Palette,
  'server': Server,
  'sparkles': Sparkles,
  'trending-up': TrendingUp,
  'zap': Zap,
  'shield-check': ShieldCheck,
};

export default function Services({ services = [], philosophy = [] }) {
  // --- TOP SECTION: 4 Fixed Services Cards (User's Exact Text / DB) ---
  const defaultServices = [
    {
      id: "1",
      icon: "code-2",
      title: "Full-Stack Web Excellence",
      desc: "Building end-to-end web experiences that blend stunning visuals with rock-solid engineering. I bridge the gap between creative design and technical performance.",
      tags: ["End-to-End", "Next.js & React", "Node.js"]
    },
    {
      id: "2",
      icon: "palette",
      title: "Premium Frontend Design",
      desc: "Crafting immersive, 'Wow-factor' interfaces using modern technologies. Focusing on smooth animations, responsive layouts, and user-centric aesthetics.",
      tags: ["Framer Motion", "Tailwind CSS", "60 FPS UI"]
    },
    {
      id: "3",
      icon: "server",
      title: "High-Performance Backend",
      desc: "Architecting robust server-side systems that scale. From database optimization to complex API structures, ensuring speed and reliability is paramount.",
      tags: ["REST & GraphQL", "MongoDB / SQL", "High Concurrency"]
    },
    {
      id: "4",
      icon: "sparkles",
      title: "Custom Web Solutions",
      desc: "Delivering tailored web applications that solve real problems. Whether it's a platform, a tool, or a marketplace, I turn concepts into deployed reality.",
      tags: ["SaaS Architecture", "Cloud APIs", "Scalable Platforms"]
    }
  ];

  const fixedServices = (services && services.length > 0 ? services : defaultServices).map((s, idx) => ({
    ...defaultServices[idx],
    ...s,
    tags: Array.isArray(s?.tags) && s.tags.length > 0 ? s.tags : (defaultServices[idx]?.tags || [])
  }));

  // --- BOTTOM SECTION: Engineering Philosophy (Sticky Scroll Showcase / DB) ---
  const defaultPhilosophy = [
    {
      id: "scalability",
      icon: "trending-up",
      title: "Scalability First",
      tagline: "Architecture That Expands With Your Growth",
      desc: "Architecting systems that grow effortlessly from 100 to 1 million users without a rewrite.",
      points: [
        "Modular decoupled services & clean separation of concerns",
        "Stateless API design ready for auto-scaling containers",
        "Optimized database schemas with intelligent indexing",
        "Load-balanced architecture handling high-traffic spikes"
      ],
      metrics: [
        { label: "User Capacity", val: "1M+" },
        { label: "Code Architecture", val: "Modular" },
        { label: "Rewrites Needed", val: "0" }
      ]
    },
    {
      id: "performance",
      icon: "zap",
      title: "Performance",
      tagline: "Ultra-Low Latency & Instant Response",
      desc: "Every millisecond counts. Optimizing database queries and API response times for instant feedback.",
      points: [
        "Sub-second page rendering & asset streaming",
        "Aggressive database query profiling & indexing",
        "Distributed in-memory caching layers",
        "Lightweight bundles with zero bloat or render lag"
      ],
      metrics: [
        { label: "Target TTFB", val: "< 80ms" },
        { label: "Lighthouse", val: "100%" },
        { label: "Frame Rate", val: "60 FPS" }
      ]
    },
    {
      id: "security",
      icon: "shield-check",
      title: "Security",
      tagline: "Zero-Trust Engineering & Data Protection",
      desc: "Zero-trust architecture. Implementing robust authentication and authorization from day one.",
      points: [
        "Cryptographically signed JWT sessions & secure cookies",
        "Strict input validation, sanitization & SQLi/XSS defense",
        "Role-Based Access Control (RBAC) across all endpoints",
        "Rate limiting & DDoS abuse prevention"
      ],
      metrics: [
        { label: "Architecture", val: "Zero-Trust" },
        { label: "Encryption", val: "AES-256" },
        { label: "Auth Flow", val: "RBAC" }
      ]
    }
  ];

  const defaultPhilMap = new Map(defaultPhilosophy.map(p => [p.id, p]));
  const philosophyList = (philosophy && philosophy.length > 0 ? philosophy : defaultPhilosophy).map((p, idx) => {
    const fallback = defaultPhilosophy[idx] || defaultPhilMap.get(p?.id) || {};
    return {
      ...fallback,
      ...p,
      points: Array.isArray(p?.points) && p.points.length > 0 ? p.points : (fallback.points || []),
      metrics: Array.isArray(p?.metrics) && p.metrics.length > 0 ? p.metrics : (fallback.metrics || [])
    };
  });

  const [activePhilosophy, setActivePhilosophy] = useState(0);
  const stickyContainerRef = useRef(null);
  const isClickingRef = useRef(false);
  const totalPhilosophy = philosophyList.length;

  // Track natural scroll through the philosophy sticky container
  useEffect(() => {
    const onScroll = () => {
      if (isClickingRef.current || !stickyContainerRef.current) return;
      const rect = stickyContainerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;

      if (totalScrollable <= 0) return;

      const progress = -rect.top / totalScrollable;
      const clamped = Math.max(0, Math.min(0.999, progress));
      const targetIdx = Math.floor(clamped * totalPhilosophy);

      if (targetIdx !== activePhilosophy && targetIdx >= 0 && targetIdx < totalPhilosophy) {
        setActivePhilosophy(targetIdx);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [activePhilosophy, totalPhilosophy]);

  // Jump to specific philosophy card on click
  const goToPhilosophy = (idx) => {
    isClickingRef.current = true;
    setActivePhilosophy(idx);

    if (stickyContainerRef.current) {
      const rect = stickyContainerRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY + rect.top;
      const totalScrollable = rect.height - window.innerHeight;
      const targetScroll = scrollTop + (idx / totalPhilosophy) * totalScrollable + 20;

      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }

    setTimeout(() => {
      isClickingRef.current = false;
    }, 700);
  };

  const nextPhilosophy = () => {
    if (activePhilosophy < totalPhilosophy - 1) {
      goToPhilosophy(activePhilosophy + 1);
    }
  };

  const prevPhilosophy = () => {
    if (activePhilosophy > 0) {
      goToPhilosophy(activePhilosophy - 1);
    }
  };

  const currentPhil = philosophyList[activePhilosophy] || philosophyList[0];
  const PhilIcon = typeof currentPhil.icon === 'string' ? (ICON_MAP[currentPhil.icon] || TrendingUp) : (currentPhil.icon || TrendingUp);

  return (
    <>
      <section id="services" className="relative bg-[#080b11] border-b border-white/[0.06]">
      
      {/* ========================================================================= */}
      {/* PART 1: FIXED SERVICES CARDS (UPPER PART)                                 */}
      {/* ========================================================================= */}
      <div className="relative py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-semibold tracking-wider text-cyan-300 uppercase shadow-sm mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Technical Services</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Technical Services &amp; Solutions
          </h2>

          <p className="mt-4 text-slate-400 text-base sm:text-lg max-w-2xl">
            Delivering technical excellence and scalable architecture across the entire stack.
          </p>

          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 rounded-full mt-5" />
        </div>

        {/* 4 Fixed Services Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fixedServices.map((card, idx) => {
            const Icon = typeof card.icon === 'string' ? (ICON_MAP[card.icon] || Code2) : (card.icon || Code2);
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="p-7 rounded-3xl bg-[#0c101c]/80 border border-cyan-500/15 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl group backdrop-blur-xl relative overflow-hidden"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-900/90 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 group-hover:text-sky-300 transition-all shadow-inner">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-white font-['Outfit'] mb-3 group-hover:text-cyan-200 transition-colors leading-snug">
                    {card.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                  {(card.tags || []).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-[#111726] text-cyan-200 border border-cyan-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>

    {/* ========================================================================= */}
    {/* PART 2: STICKY SCROLL SHOWCASE (ENGINEERING PHILOSOPHY)                   */}
    {/* ========================================================================= */}
    <section
      id="philosophy"
      ref={stickyContainerRef}
      style={{ height: `${Math.max(3, totalPhilosophy) * 110}vh` }}
      className="relative bg-[#080b11] border-b border-white/[0.06]"
    >
        {/* Pinned Sticky Viewport */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden pt-20 pb-8 px-4 sm:px-6 lg:px-8">
          
          {/* Ambient Lighting (Blue/Cyan) */}
          <div className="absolute top-1/4 -right-48 w-96 h-96 bg-cyan-500/15 rounded-full blur-[160px] pointer-events-none -z-10" />
          <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-blue-600/15 rounded-full blur-[160px] pointer-events-none -z-10" />

          <div className="w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              
              {/* Left Column: Heading, Description & Progress (Image 2 Style) */}
              <div className="lg:col-span-5 flex flex-col items-start space-y-6">
                
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-semibold tracking-wider text-cyan-300 uppercase shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Our Core Principles</span>
                </div>

                {/* Title: Engineering Philosophy */}
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-['Outfit'] leading-none">
                  Engineering <br />
                  <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    Philosophy
                  </span>
                </h2>

                {/* Description - User's Exact Text */}
                <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-md">
                  The guiding principles that define my architectural decisions and coding standards.
                </p>

                {/* Status indicator: Scroll to explore */}
                <div className="inline-flex items-center gap-2.5 text-xs font-mono text-slate-400 tracking-wide">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.9)] animate-pulse" />
                  <span>Scroll down to navigate principles automatically</span>
                </div>

                {/* Stepper Navigation & Philosophy Counter */}
                <div className="w-full pt-4 flex items-center justify-between border-t border-white/[0.08]">
                  {/* Counter */}
                  <div className="flex items-center gap-3">
                    <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">
                      {String(activePhilosophy + 1).padStart(2, '0')}
                    </span>
                    <span className="text-slate-600 font-mono text-lg">/</span>
                    <span className="text-sm font-mono text-slate-400">
                      {String(totalPhilosophy).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Step indicator bars */}
                  <div className="flex items-center gap-2">
                    {philosophyList.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToPhilosophy(idx)}
                        aria-label={`Go to philosophy ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === activePhilosophy
                            ? 'w-8 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                            : 'w-2 bg-slate-800 hover:bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Arrow navigation buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevPhilosophy}
                      disabled={activePhilosophy === 0}
                      className={`nav-arrow-btn p-2.5 rounded-full border transition-all flex items-center justify-center ${
                        activePhilosophy === 0
                          ? 'border-white/10 text-slate-600 bg-slate-900/40 cursor-not-allowed opacity-40'
                          : 'border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400 bg-slate-900/80 hover:bg-slate-800'
                      }`}
                      aria-label="Previous principle"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextPhilosophy}
                      disabled={activePhilosophy === totalPhilosophy - 1}
                      className={`nav-arrow-btn p-2.5 rounded-full border transition-all flex items-center justify-center ${
                        activePhilosophy === totalPhilosophy - 1
                          ? 'border-white/10 text-slate-600 bg-slate-900/40 cursor-not-allowed opacity-40'
                          : 'border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400 bg-slate-900/80 hover:bg-slate-800'
                      }`}
                      aria-label="Next principle"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Featured Interactive Philosophy Card (Changes with Scroll) */}
              <div className="lg:col-span-7">
                <div className="relative min-h-[460px] sm:min-h-[500px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPhil.id || activePhilosophy}
                      initial={{ opacity: 0, y: 35, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -35, scale: 0.96 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full bg-[#0d111c]/90 border border-cyan-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl group hover:border-cyan-500/35 transition-all flex flex-col justify-between"
                    >
                      {/* Card Header: Icon, Badge & Counter */}
                      <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                            <PhilIcon className="w-7 h-7" />
                          </div>
                          <div>
                            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 block">
                              PRINCIPLE 0{activePhilosophy + 1}
                            </span>
                            <span className="text-sm text-slate-400 font-medium">
                              {currentPhil.tagline}
                            </span>
                          </div>
                        </div>

                        <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          Active Pillar
                        </span>
                      </div>

                      {/* Card Body: Title & User Description */}
                      <div className="mt-6 space-y-4">
                        <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
                          {currentPhil.title}
                        </h3>

                        <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-medium">
                          {currentPhil.desc}
                        </p>
                      </div>

                      {/* Metrics Showcase Bar */}
                      <div className="mt-6 p-4 rounded-2xl bg-[#090d16] border border-cyan-500/15 grid grid-cols-3 gap-3 text-center">
                        {(currentPhil.metrics || []).map((m, mIdx) => (
                          <div key={mIdx} className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5">
                            <span className="text-lg sm:text-xl font-bold font-mono text-cyan-400 block">
                              {m.val}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {m.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Detailed Bullet Points */}
                      <div className="mt-6 pt-5 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(currentPhil.points || []).map((p, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-snug">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>

                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
