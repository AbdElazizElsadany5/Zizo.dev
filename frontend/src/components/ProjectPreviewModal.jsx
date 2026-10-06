import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from './SocialIcons';

export default function ProjectPreviewModal({ project, isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Dark Backdrop with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-[#090c15] border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden z-10 my-auto flex flex-col"
        >
          {/* Top-Right Floating Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/10 shadow-lg cursor-pointer hover:scale-105"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Project Screenshot / Live Preview Area */}
          <div className="relative w-full bg-[#05070d] p-3 sm:p-6 pb-2 sm:pb-3 flex items-center justify-center">
            <div className="w-full rounded-xl sm:rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl bg-black">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-auto max-h-[68vh] object-cover sm:object-contain object-top mx-auto"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80';
                }}
              />
            </div>
          </div>

          {/* Bottom Info Bar: Title + Description on Left, Action Buttons on Right */}
          <div className="px-5 sm:px-8 py-5 sm:py-6 bg-[#090c15] border-t border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit'] truncate">
                {project.title}
              </h3>
              <p className="mt-1 text-slate-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                {project.description}
              </p>
              {project.tags && project.tags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              {project.githubLink && project.githubLink !== '#' && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs sm:text-sm font-medium border border-white/10 transition-all"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>Code</span>
                </a>
              )}
              {project.demoLink && (
                <a
                  href={project.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-slate-200 text-black font-semibold text-xs sm:text-sm shadow-md hover:shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  <span>Visit Site</span>
                  <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

