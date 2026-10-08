import React from 'react';

const TECH_ITEMS = [
  'MYSQL',
  'GIT',
  'GITHUB',
  'DOCKER',
  'LINUX',
  'FLUTTER',
  'DART',
  'NEXT.JS',
  'HTML',
  'CSS',
  'JAVASCRIPT',
  'TAILWIND',
  'REACT.JS',
  'NODE.JS',
  'MONGODB',
  'TYPESCRIPT',
  'PYTHON',
  'EXPRESS',
  'REDUX',
  'POSTGRESQL',
];

export default function TechMarquee() {
  return (
    <section dir="ltr" className="relative w-full max-w-full py-8 overflow-hidden bg-[#080b11] border-y border-white/[0.06] select-none">
      {/* Edge Blur / Gradients for seamless infinite fade */}
      <div className="marquee-fade-left absolute top-0 bottom-0 left-0 w-24 sm:w-44 bg-gradient-to-r from-[#080b11] via-[#080b11]/80 to-transparent z-10 pointer-events-none" />
      <div className="marquee-fade-right absolute top-0 bottom-0 right-0 w-24 sm:w-44 bg-gradient-to-l from-[#080b11] via-[#080b11]/80 to-transparent z-10 pointer-events-none" />

      {/* Marquee Track */}
      <div className="flex animate-marquee hover:[animation-play-state:paused] select-none">
        {/* Set 1 */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 pr-3 sm:pr-4">
          {TECH_ITEMS.map((tech, idx) => (
            <div
              key={`tech-1-${idx}`}
              className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-[#0d121e]/90 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-[#111827] text-slate-300 hover:text-white transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] cursor-pointer group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/90 shadow-[0_0_8px_rgba(6,182,212,0.9)] group-hover:scale-125 transition-transform" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase font-['Plus_Jakarta_Sans',sans-serif]">
                {tech}
              </span>
            </div>
          ))}
        </div>

        {/* Set 2 (Duplicate for seamless loop) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 pr-3 sm:pr-4">
          {TECH_ITEMS.map((tech, idx) => (
            <div
              key={`tech-2-${idx}`}
              className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-[#0d121e]/90 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-[#111827] text-slate-300 hover:text-white transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] cursor-pointer group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/90 shadow-[0_0_8px_rgba(6,182,212,0.9)] group-hover:scale-125 transition-transform" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase font-['Plus_Jakarta_Sans',sans-serif]">
                {tech}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
