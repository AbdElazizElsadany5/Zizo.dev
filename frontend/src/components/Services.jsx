import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Palette, 
  Server, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
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

export default function Services({ services = [], philosophy = [], smoothScroll = false }) {
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

  // --- BOTTOM SECTION: Engineering Philosophy (Cards Side-by-Side) ---
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

  return (
    <>
      <section id="services" className="relative bg-[#080b11] border-b border-white/[0.06] overflow-hidden w-full max-w-full">
      
      {/* ========================================================================= */}
      {/* PART 1: FIXED SERVICES CARDS (UPPER PART)                                 */}
      {/* ========================================================================= */}
      <div className="relative py-20 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/[0.06]">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[320px] sm:w-[500px] md:w-[700px] h-[300px] sm:h-[350px] bg-cyan-500/10 rounded-full blur-[140px] sm:blur-[160px] pointer-events-none -z-10" />

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
    {/* PART 2: ENGINEERING PHILOSOPHY (CARDS SIDE BY SIDE - NO SCROLL LOCK)     */}
    {/* ========================================================================= */}
    <section
      id="philosophy"
      className="relative py-24 sm:py-32 bg-[#080b11] border-b border-white/[0.06] overflow-hidden"
    >
      {/* Ambient Lighting (Blue/Cyan) */}
      <div className="absolute top-1/4 -right-48 w-96 h-96 bg-cyan-500/15 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-blue-600/15 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-16">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-semibold tracking-wider text-cyan-300 uppercase shadow-sm mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Our Core Principles</span>
          </div>

          {/* Title: Engineering Philosophy */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-['Outfit']">
            Engineering{' '}
            <span className="text-cyan-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.35)]">
              Philosophy
            </span>
          </h2>

          {/* Description */}
          <p className="mt-4 text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl">
            The guiding principles that define my architectural decisions and coding standards.
          </p>

          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 rounded-full mt-5" />
        </div>

        {/* Philosophy Cards Grid (Side-by-Side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {philosophyList.map((item, idx) => {
            const Icon = typeof item.icon === 'string' ? (ICON_MAP[item.icon] || TrendingUp) : (item.icon || TrendingUp);

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="relative bg-[#0d111c]/90 border border-cyan-500/20 hover:border-cyan-400/50 rounded-3xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col justify-between group transition-all duration-300 hover:shadow-[0_20px_50px_rgba(6,182,212,0.15)]"
              >
                <div>
                  {/* Card Header: Icon & Principle Number */}
                  <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
                    <div className="w-13 h-13 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      PRINCIPLE 0{idx + 1}
                    </span>
                  </div>

                  {/* Card Content: Tagline, Title & Description */}
                  <div className="mt-5 space-y-2.5">
                    <span className="text-xs font-mono text-cyan-400/80 block uppercase tracking-wider font-semibold">
                      {item.tagline}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed pt-1">
                      {item.desc}
                    </p>
                  </div>

                  {/* Metrics Showcase Bar */}
                  {item.metrics && item.metrics.length > 0 && (
                    <div className="mt-6 p-3 sm:p-4 rounded-2xl bg-[#090d16] border border-cyan-500/15 grid grid-cols-3 gap-2 text-center">
                      {item.metrics.map((m, mIdx) => (
                        <div key={mIdx} className="p-2 rounded-xl bg-slate-900/80 border border-white/5">
                          <span className="text-base sm:text-lg font-bold font-mono text-cyan-400 block">
                            {m.val}
                          </span>
                          <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-tight block truncate">
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Detailed Bullet Points */}
                  {item.points && item.points.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-white/[0.06] space-y-2.5">
                      {item.points.map((p, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-snug">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Card Accent Indicator */}
                <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>PILLAR 0{idx + 1}</span>
                  <span className="text-cyan-400 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                    STANDARD
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  </>
);
}
