import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Download } from 'lucide-react';

function TextWordReveal({ text, progress, range }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const y = useTransform(progress, range, [3, 0]);
  const filter = useTransform(progress, range, ['blur(3px)', 'blur(0px)']);

  return (
    <motion.span
      style={{ opacity, y, filter }}
      className="inline-block mr-1 transition-colors duration-150"
    >
      {text}
    </motion.span>
  );
}

function ScrollParagraphReveal({ text, progress, startProgress, endProgress, className = "" }) {
  const words = text.split(' ');
  const total = words.length;

  return (
    <p className={className}>
      {words.map((word, idx) => {
        const start = startProgress + (idx / total) * (endProgress - startProgress);
        const end = start + (1 / total) * (endProgress - startProgress);
        return (
          <TextWordReveal
            key={idx}
            text={word}
            progress={progress}
            range={[start, end]}
          />
        );
      })}
    </p>
  );
}

export default function About({ profile }) {
  const containerRef = useRef(null);

  // Track scroll through the pinned 260vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const sectionTitle = profile?.bioTitle || "The Mind Behind The Architecture";
  const bio1 = profile?.bioText1 || "I'm AbdElaziz Elsadany, a 20-year-old Senior Software Architect who believes that true digital excellence lies at the intersection of powerful engineering and stunning design. My journey isn't just about managing servers; it's about crafting complete, immersive web experiences.";
  const bio2 = profile?.bioText2 || "I specialize in building 'wow-factor' applications—where high-performance backends meet sleek, responsive frontends. Whether I'm architecting a system to serve millions or fine-tuning the animations of a user interface, my goal is always the same: to create software that is not only robust and scalable but also beautiful and intuitive to use.";
  const location = profile?.location || 'Cairo, Egypt';
  const email = profile?.email || 'zizoelsadany5@gmail.com';

  return (
    <section
      id="about"
      ref={containerRef}
      style={{ height: '280vh' }}
      className="relative bg-[#080b11] border-b border-white/[0.06]"
    >
      {/* Pinned Sticky Viewport: Locks on screen until all text is completely revealed */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        
        {/* Subtle background ambient lighting */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />

        <div className="w-full max-w-4xl mx-auto flex flex-col">
          
          {/* Section Header - Centered 'About Me' with Accent Line like Skills */}
          <div className="flex flex-col items-center text-center w-full mb-6 sm:mb-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight font-['Outfit']">
              About Me
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 rounded-full mt-4" />
          </div>

          {/* About Card - Exact Screenshot 1:1 Design */}
          <div className="about-card w-full relative p-6 sm:p-10 md:p-12 rounded-3xl bg-[#0b0f17]/95 border border-white/[0.08] backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden">
            
            {/* Scroll-Driven Text Content */}
            <div className="space-y-6">
              {/* Paragraph 1 */}
              <ScrollParagraphReveal
                text={bio1}
                progress={scrollYProgress}
                startProgress={0.0}
                endProgress={0.25}
                className="text-base sm:text-lg md:text-xl font-medium sm:font-semibold leading-relaxed text-white font-['Plus_Jakarta_Sans']"
              />

              {/* Paragraph 2 - Starts blurred and illuminates smoothly as user scrolls */}
              <ScrollParagraphReveal
                text={bio2}
                progress={scrollYProgress}
                startProgress={0.20}
                endProgress={0.80}
                className="text-base sm:text-lg md:text-xl font-medium sm:font-semibold leading-relaxed text-slate-300 font-['Plus_Jakarta_Sans']"
              />
            </div>

            {/* Bottom Bar: Location/Email on Left + Download CV pill on Right */}
            <div className="pt-6 mt-8 sm:mt-10 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
              {/* Left Info */}
              <div className="text-xs sm:text-sm text-slate-400 font-normal">
                <span>{location}</span>
                <span className="mx-2 text-slate-600">·</span>
                <span>{email}</span>
              </div>

              {/* Right Download CV Pill */}
              <a
                href="/api/profile/download-cv"
                download
                className="download-cv-btn inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#121824] hover:bg-[#1a2336] text-white text-xs sm:text-sm font-medium border border-white/10 hover:border-white/25 transition-all shadow-sm active:scale-95 group"
              >
                <Download className="w-3.5 h-3.5 text-slate-300 group-hover:text-white transition-colors" />
                <span>Download CV</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
