import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Layout, Server, Terminal, Cpu, Sparkles } from 'lucide-react';

const ICON_MAP = {
  'code-2': Code2,
  layout: Layout,
  server: Server,
  terminal: Terminal,
};

export default function Skills({ skills = [], smoothScroll = false }) {
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

  return (
    <section
      id="skills"
      className="relative py-24 sm:py-32 bg-[#080b11] border-b border-white/[0.06] overflow-hidden w-full max-w-full"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-semibold tracking-wider text-cyan-300 uppercase shadow-sm mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>EXPERTISE</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-['Outfit'] tracking-tight">
            My Tech Stack
          </h2>

          <p className="mt-4 text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed">
            A comprehensive toolkit of modern technologies, libraries, and frameworks I leverage to engineer robust web platforms.
          </p>

          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 rounded-full mt-5" />
        </div>

        {/* Cards Grid: Rendered Side-by-Side (No Scroll Lock) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {displaySkills.map((cat, idx) => {
            const Icon = ICON_MAP[cat.icon] || Cpu;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="relative p-6 sm:p-7 rounded-3xl bg-[#0d111d]/90 border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 flex flex-col justify-between shadow-xl backdrop-blur-xl group hover:shadow-[0_20px_45px_rgba(6,182,212,0.15)]"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.08]">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all shadow-inner">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 font-semibold block uppercase tracking-wider">
                        {cat.badge}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] leading-tight group-hover:text-cyan-200 transition-colors">
                        {cat.category}
                      </h3>
                    </div>
                  </div>

                  {/* Skills Progress List */}
                  <div className="space-y-4">
                    {cat.skills?.map((s, sIdx) => (
                      <div key={sIdx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-medium">
                          <span className="text-slate-200">
                            {s.name}
                          </span>
                          <span className="font-mono text-cyan-400 font-bold">
                            {s.level}%
                          </span>
                        </div>
                        
                        <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden p-[1px]">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${s.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.85, delay: 0.15 + sIdx * 0.08, ease: 'easeOut' }}
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Counter */}
                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>STACK 0{idx + 1}</span>
                  <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.9)]" />
                    ACTIVE
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
