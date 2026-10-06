import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Maximize2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import ProjectPreviewModal from './ProjectPreviewModal';

export default function ProjectsSection({ projects, smoothScroll = true }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const containerRef = useRef(null);
  const isClicking = useRef(false);
  const touchStartX = useRef(null);

  const displayProjects = projects || [];
  const total = displayProjects.length;

  // Track window resize to ensure smooth scroll is strictly active ONLY on laptops and desktops (>= 1024px)
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Smooth scroll is strictly enabled ONLY if smoothScroll setting is true AND device is a desktop/laptop (>= 1024px)
  const effectiveSmooth = Boolean(smoothScroll && isDesktop);

  // Track natural scroll progress through tall container only when smoothScroll is enabled on desktop/laptops
  useEffect(() => {
    if (!effectiveSmooth || !projects || total === 0) return;
    const onScroll = () => {
      if (isClicking.current || !containerRef.current) return;
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
  }, [effectiveSmooth, currentIndex, total, projects]);

  // Jump to specific project on dot/arrow click
  const goToProject = (idx) => {
    if (total === 0) return;
    setCurrentIndex(idx);

    if (effectiveSmooth && containerRef.current) {
      isClicking.current = true;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY + rect.top;
      const totalScrollable = rect.height - window.innerHeight;
      const targetProgress = (idx + 0.5) / total;
      const targetScroll = scrollTop + targetProgress * totalScrollable;

      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });

      setTimeout(() => {
        isClicking.current = false;
      }, 700);
    }
  };

  const nextProject = () => {
    if (currentIndex < total - 1) {
      goToProject(currentIndex + 1);
    } else {
      goToProject(0);
    }
  };

  const prevProject = () => {
    if (currentIndex > 0) {
      goToProject(currentIndex - 1);
    } else {
      goToProject(total - 1);
    }
  };

  // Touch swipe handling for mobile devices
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      nextProject();
    } else if (diff < -45) {
      prevProject();
    }
    touchStartX.current = null;
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
      style={{ height: effectiveSmooth ? `${Math.max(2, total) * 75}vh` : 'auto' }}
      className={`relative bg-[#080b11] border-b border-white/[0.06] ${effectiveSmooth ? '' : 'py-12 sm:py-20 lg:py-28'}`}
    >
      {/* Pinned Sticky Viewport if smoothScroll on desktop, or clean static showcase on mobile & when disabled */}
      <div 
        className={effectiveSmooth ? "sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden py-4 sm:py-6" : "w-full flex items-center justify-center overflow-hidden py-4 sm:py-6"}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 -left-48 w-80 sm:w-96 h-80 sm:h-96 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 -right-48 w-80 sm:w-96 h-80 sm:h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-center">
            
            {/* Left Column: Heading, Description & Progress */}
            <div className="lg:col-span-5 flex flex-col items-start space-y-3 sm:space-y-6">
              
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-semibold tracking-wider text-cyan-300 uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Selected Portfolio</span>
              </div>

              {/* Title: My Works */}
              <h2 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white font-['Outfit'] leading-none">
                My <br className="hidden sm:inline" />
                <span className="text-white">Works</span>
              </h2>

              {/* Description */}
              <p className="text-slate-400 text-xs sm:text-base lg:text-lg leading-relaxed max-w-md line-clamp-2 sm:line-clamp-none">
                A curated showcase of high-performance architecture, AI tools, open-source systems, and digital platforms.
              </p>

              {/* Navigation indicator */}
              <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 tracking-wide">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)] animate-pulse" />
                <span>
                  {effectiveSmooth
                    ? "Scroll down to navigate projects automatically"
                    : "Use arrows or swipe to navigate projects"}
                </span>
              </div>

              {/* Stepper Navigation & Project Counter */}
              <div className="w-full pt-3 sm:pt-4 flex items-center justify-between border-t border-white/[0.08]">
                {/* Counter */}
                <div className="flex items-center gap-2.5">
                  <span className="text-lg sm:text-2xl font-bold font-mono text-cyan-400">
                    {String(currentIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="text-slate-600 font-mono text-base sm:text-lg">/</span>
                  <span className="text-xs sm:text-sm font-mono text-slate-400">
                    {String(total).padStart(2, '0')}
                  </span>
                </div>

                {/* Step indicator bars */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {displayProjects.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToProject(idx)}
                      aria-label={`Go to project ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentIndex
                          ? 'w-7 sm:w-8 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
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
                    className={`nav-arrow-btn p-2 sm:p-2.5 rounded-full border transition-all flex items-center justify-center cursor-pointer min-w-[36px] min-h-[36px] ${
                      currentIndex === 0
                        ? 'border-white/10 text-slate-600 bg-slate-900/40 cursor-not-allowed opacity-40'
                        : 'border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400 bg-slate-900/80 hover:bg-slate-800 active:scale-95'
                    }`}
                    aria-label="Previous project"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextProject}
                    disabled={currentIndex === total - 1}
                    className={`nav-arrow-btn p-2 sm:p-2.5 rounded-full border transition-all flex items-center justify-center cursor-pointer min-w-[36px] min-h-[36px] ${
                      currentIndex === total - 1
                        ? 'border-white/10 text-slate-600 bg-slate-900/40 cursor-not-allowed opacity-40'
                        : 'border-cyan-500/30 text-slate-300 hover:text-white hover:border-cyan-400 bg-slate-900/80 hover:bg-slate-800 active:scale-95'
                    }`}
                    aria-label="Next project"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Project Showcase Card (Changes smoothly with scroll) */}
            <div className="lg:col-span-7 w-full">
              <div className="relative min-h-[360px] sm:min-h-[460px] lg:min-h-[520px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id || currentIndex}
                    initial={{ opacity: 0, y: 25, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -25, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full bg-[#0d111c] border border-cyan-500/20 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 lg:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl group hover:border-cyan-500/35 transition-all"
                  >
                    {/* Screenshot Mockup Container */}
                    <div className="relative w-full aspect-[16/10] max-h-[160px] sm:max-h-[260px] lg:max-h-[320px] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 border border-white/[0.06] shadow-inner">
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
                    <div className="mt-3.5 sm:mt-5 flex flex-col space-y-2.5 sm:space-y-4">
                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {current.tags?.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-[#121927] text-cyan-200 border border-cyan-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white tracking-tight font-['Outfit']">
                        {current.title}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-400 text-xs sm:text-sm lg:text-base leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {current.description}
                      </p>

                      {/* Action Buttons - Fully visible and accessible */}
                      <div className="pt-1.5 sm:pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                        {current.demoLink && (
                          <a
                            href={current.demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-white text-slate-950 font-semibold text-xs sm:text-sm hover:bg-cyan-100 transition-all shadow-md active:scale-95 cursor-pointer"
                          >
                            <span>Visit Project</span>
                            <ArrowUpRight className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                          </a>
                        )}

                        <button
                          onClick={() => setSelectedPreview(current)}
                          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-[#121927] hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs sm:text-sm border border-cyan-500/30 transition-all active:scale-95 cursor-pointer"
                        >
                          <span>Preview</span>
                          <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                        </button>

                        {current.githubLink && (
                          <a
                            href={current.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center p-2 rounded-full bg-[#121927] hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-cyan-500/30 transition-all ml-auto active:scale-95 cursor-pointer"
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
