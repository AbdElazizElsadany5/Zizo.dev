import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Maximize2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import ProjectPreviewModal from './ProjectPreviewModal';

export default function ProjectsSection({ projects }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const containerRef = useRef(null);
  const isClickingRef = useRef(false);

  const displayProjects = projects || [];
  const total = displayProjects.length;

  // Track natural scroll progress through the tall container to automatically switch projects
  useEffect(() => {
    if (!projects || total === 0) return;
    const onScroll = () => {
      if (isClickingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;

      if (totalScrollable <= 0) return;

      const progress = -rect.top / totalScrollable;
      const clamped = Math.max(0, Math.min(0.999, progress));
      const targetIndex = Math.floor(clamped * total);

      if (targetIndex !== currentIndex && targetIndex >= 0 && targetIndex < total) {
        setCurrentIndex(targetIndex);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [currentIndex, total, projects]);

  // Jump to specific project on dot/arrow click
  const goToProject = (idx) => {
    if (total === 0) return;
    isClickingRef.current = true;
    setCurrentIndex(idx);

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

  const nextProject = () => {
    if (currentIndex < total - 1) {
      goToProject(currentIndex + 1);
    }
  };

  const prevProject = () => {
    if (currentIndex > 0) {
      goToProject(currentIndex - 1);
    }
  };

  // While projects are fetching from API, display a sleek minimalist loader
  if (!projects) {
    return (
      <section id="projects" className="min-h-[50vh] flex flex-col items-center justify-center py-28 bg-[#080b11] border-b border-white/[0.06]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
            <Sparkles className="w-5 h-5 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <p className="text-sm font-mono text-slate-400 tracking-wider">Loading projects...</p>
        </div>
      </section>
    );
  }

  // If projects fetched and empty
  if (projects.length === 0) {
    return (
      <section id="projects" className="min-h-[40vh] flex flex-col items-center justify-center py-20 bg-[#080b11] border-b border-white/[0.06]">
        <p className="text-slate-400 font-mono text-sm">No projects added yet.</p>
      </section>
    );
  }

  const current = displayProjects[currentIndex] || displayProjects[0];

  return (
    <section
      id="projects"
      ref={containerRef}
      style={{ height: `${Math.max(2, total) * 100}vh` }}
      className="relative bg-[#080b11] border-b border-white/[0.06]"
    >
      {/* Pinned Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Background ambient lighting (Blue & Cyan) */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* Left Column: Heading, Description & Progress (Image 2 style) */}
            <div className="lg:col-span-5 flex flex-col items-start space-y-6">
              
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-semibold tracking-wider text-cyan-300 uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Selected Portfolio</span>
              </div>

              {/* Title: My Works */}
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-['Outfit'] leading-none">
                My <br />
                <span className="text-white">Works</span>
              </h2>

              {/* Description */}
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-md">
                A curated showcase of high-performance architecture, AI tools, open-source systems, and digital platforms.
              </p>

              {/* Status indicator: Scroll to explore */}
              <div className="inline-flex items-center gap-2.5 text-xs font-mono text-slate-400 tracking-wide">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.9)] animate-pulse" />
                <span>Scroll down to navigate projects automatically</span>
              </div>

              {/* Stepper Navigation & Project Counter */}
              <div className="w-full pt-4 flex items-center justify-between border-t border-white/[0.08]">
                {/* Counter */}
                <div className="flex items-center gap-3">
                  <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">
                    {String(currentIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="text-slate-600 font-mono text-lg">/</span>
                  <span className="text-sm font-mono text-slate-400">
                    {String(total).padStart(2, '0')}
                  </span>
                </div>

                {/* Step indicator bars */}
                <div className="flex items-center gap-2">
                  {displayProjects.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToProject(idx)}
                      aria-label={`Go to project ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentIndex
                          ? 'w-8 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                          : 'w-2 bg-slate-800 hover:bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                {/* Arrow navigation buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevProject}
                    disabled={currentIndex === 0}
                    className={`nav-arrow-btn p-2.5 rounded-full border transition-all flex items-center justify-center ${
                      currentIndex === 0
                        ? 'border-white/10 text-slate-600 bg-slate-900/40 cursor-not-allowed opacity-40'
                        : 'border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400 bg-slate-900/80 hover:bg-slate-800'
                    }`}
                    aria-label="Previous project"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextProject}
                    disabled={currentIndex === total - 1}
                    className={`nav-arrow-btn p-2.5 rounded-full border transition-all flex items-center justify-center ${
                      currentIndex === total - 1
                        ? 'border-white/10 text-slate-600 bg-slate-900/40 cursor-not-allowed opacity-40'
                        : 'border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400 bg-slate-900/80 hover:bg-slate-800'
                    }`}
                    aria-label="Next project"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Project Showcase Card (Image 2 style) */}
            <div className="lg:col-span-7">
              <div className="relative min-h-[480px] sm:min-h-[540px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id || currentIndex}
                    initial={{ opacity: 0, y: 35, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -35, scale: 0.96 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full bg-[#0d111c] border border-cyan-500/15 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl group hover:border-cyan-500/30 transition-all"
                  >
                    {/* Screenshot Mockup Container */}
                    <div className="relative w-full aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 border border-white/[0.06] shadow-inner">
                      <img
                        src={current.image}
                        alt={current.title}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d111c]/80 via-transparent to-transparent opacity-40 pointer-events-none" />
                    </div>

                    {/* Project Details Below Screenshot */}
                    <div className="mt-6 flex flex-col space-y-4">
                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-2">
                        {current.tags?.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full text-xs font-semibold bg-[#121927] text-cyan-200 border border-cyan-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Outfit']">
                        {current.title}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-400 text-sm sm:text-base leading-relaxed line-clamp-3">
                        {current.description}
                      </p>

                      {/* Action Buttons (Visit Project & Preview) */}
                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        {current.demoLink && (
                          <a
                            href={current.demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-950 font-semibold text-sm hover:bg-cyan-100 transition-all shadow-md active:scale-95"
                          >
                            <span>Visit Project</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        )}

                        <button
                          onClick={() => setSelectedPreview(current)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#121927] hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-sm border border-cyan-500/30 transition-all active:scale-95"
                        >
                          <span>Preview</span>
                          <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                        </button>

                        {current.githubLink && (
                          <a
                            href={current.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center p-2.5 rounded-full bg-[#121927] hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-cyan-500/30 transition-all ml-auto"
                            aria-label="View source code on GitHub"
                          >
                            <GithubIcon className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Interactive Modal Preview */}
      <ProjectPreviewModal
        project={selectedPreview}
        isOpen={!!selectedPreview}
        onClose={() => setSelectedPreview(null)}
      />
    </section>
  );
}
