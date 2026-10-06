import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Zap, Lightbulb, Briefcase, Mail, Rocket, Menu, X, Sun, Moon } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: User },
  { id: 'services', label: 'Services', icon: Zap },
  { id: 'skills', label: 'Skills', icon: Lightbulb },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'contact', label: 'Contact', icon: Mail },
];

export default function Navbar({ profile, theme = 'dark', onToggleTheme }) {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hideNav, setHideNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Hide Navbar smoothly when reaching or inside Projects section
      const projectsEl = document.getElementById('projects');
      if (projectsEl) {
        const rect = projectsEl.getBoundingClientRect();
        const inProjects = rect.top <= 80 && rect.bottom >= 120;
        setHideNav(inProjects);
        if (inProjects) {
          setMobileOpen(false);
        }
      } else {
        setHideNav(false);
      }

      const sections = ['home', 'about', 'services', 'skills', 'projects', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 250) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      // Sticky sections (about, projects) align at 0 to pin immediately at start
      // Non-sticky sections (services, skills, contact) offset for navbar pill
      const navOffset = (id === 'about' || id === 'projects') ? 0 : 75;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const logoFirst = profile?.logoFirstName || 'AbdElaziz';
  const logoLast = profile?.logoLastName || 'Elsadany';
  const logoSub = profile?.logoSubtitle || 'PORTFOLIO';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 sm:pt-5 px-2.5 sm:px-4 pointer-events-none transition-all duration-500 ease-in-out max-w-[100vw] ${
      hideNav
        ? '-translate-y-36 opacity-0 pointer-events-none'
        : 'translate-y-0 opacity-100'
    }`}>
      <nav
        className={`pointer-events-auto w-full transition-all duration-500 flex items-center justify-between ${
          scrolled
            ? 'max-w-[1050px] bg-[#0a0f1d]/90 backdrop-blur-2xl border border-cyan-500/20 shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(6,182,212,0.12)] rounded-full px-3.5 sm:px-6 py-2 sm:py-2.5'
            : 'max-w-6xl bg-transparent px-2 sm:px-4 py-2'
        }`}
      >
        {/* Brand Logo - Electric Cyan & Sky Blue */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('home');
          }}
          className="flex flex-col group pl-1 sm:pl-2"
        >
          <div className="flex items-center gap-1 sm:gap-1.5 font-bold text-lg sm:text-2xl tracking-tight leading-none font-['Outfit']">
            <span className="text-white group-hover:text-cyan-200 transition-colors">
              {logoFirst}
            </span>
            <span className="text-cyan-400 drop-shadow-[0_0_14px_rgba(6,182,212,0.6)]">
              {logoLast}
            </span>
          </div>
          <span
            className={`text-[9px] font-mono tracking-[0.28em] text-cyan-500/80 uppercase font-bold mt-1 transition-all duration-300 ${
              scrolled ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-4'
            }`}
          >
            {logoSub}
          </span>
        </a>

        {/* Center Nav Menu - Blue/Cyan Glass Pill */}
        <div
          className={`hidden md:flex items-center gap-1 transition-all duration-400 ${
            scrolled
              ? 'bg-transparent border-transparent p-0'
              : 'bg-[#0a0f1d]/80 border border-cyan-500/20 backdrop-blur-xl rounded-full px-3 py-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.5)]'
          }`}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-cyan-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-cyan-500/20 border border-cyan-400/40 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.35)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Section: Theme Toggle Switch + Action Button */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Pill Switch (Developer Aesthetic with Micro-Icons) */}
          <button
            onClick={onToggleTheme}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 p-0.5 flex items-center cursor-pointer border ${
              theme === 'light'
                ? 'bg-slate-100 border-cyan-500/30 shadow-[0_2px_8px_rgba(6,182,212,0.15)]'
                : 'bg-[#0f1422] border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
            }`}
            aria-label="Toggle dark/light theme"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {/* Background Track Icons */}
            <div className="absolute inset-0 px-2 flex items-center justify-between pointer-events-none">
              <Moon className={`w-3 h-3 transition-opacity ${theme === 'dark' ? 'text-cyan-400 opacity-80' : 'opacity-20 text-slate-400'}`} />
              <Sun className={`w-3 h-3 transition-opacity ${theme === 'light' ? 'text-amber-500 opacity-90' : 'opacity-20 text-slate-500'}`} />
            </div>

            {/* Glowing Active Slider Knob */}
            <motion.div
              className={`w-5.5 h-5.5 rounded-full flex items-center justify-center transition-all shadow-md z-10 ${
                theme === 'light'
                  ? 'bg-gradient-to-tr from-amber-400 to-amber-500 text-white shadow-[0_0_12px_rgba(245,158,11,0.7)]'
                  : 'bg-gradient-to-tr from-[#ccff00] to-[#b3e600] text-slate-950 shadow-[0_0_14px_rgba(204,255,0,0.85)]'
              }`}
              animate={{ x: theme === 'light' ? 26 : 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            >
              {theme === 'light' ? (
                <Sun className="w-3 h-3 text-white" />
              ) : (
                <Moon className="w-3 h-3 text-slate-950" />
              )}
            </motion.div>
          </button>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('contact');
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-slate-950 font-['Plus_Jakarta_Sans'] hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_22px_rgba(6,182,212,0.45)]"
          >
            <span>Hire Me</span>
            <Rocket className="w-3.5 h-3.5 text-slate-950" />
          </a>
        </div>

        {/* Mobile Actions: Toggle + Hamburger */}
        <div className="md:hidden flex items-center gap-2.5">
          <button
            onClick={onToggleTheme}
            className={`relative w-13 h-6.5 rounded-full transition-all duration-300 p-0.5 flex items-center cursor-pointer border ${
              theme === 'light'
                ? 'bg-slate-100 border-cyan-500/30'
                : 'bg-[#0f1422] border-cyan-500/30'
            }`}
            aria-label="Toggle dark/light theme"
          >
            <motion.div
              className={`w-5 h-5 rounded-full flex items-center justify-center shadow-md ${
                theme === 'light'
                  ? 'bg-gradient-to-tr from-amber-400 to-amber-500 text-white shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                  : 'bg-gradient-to-tr from-[#ccff00] to-[#b3e600] text-slate-950 shadow-[0_0_8px_rgba(204,255,0,0.85)]'
              }`}
              animate={{ x: theme === 'light' ? 22 : 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            >
              {theme === 'light' ? (
                <Sun className="w-2.5 h-2.5 text-white" />
              ) : (
                <Moon className="w-2.5 h-2.5 text-slate-950" />
              )}
            </motion.div>
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-full text-slate-300 hover:text-cyan-300 bg-slate-900/80 border border-cyan-500/20"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pointer-events-auto md:hidden fixed top-20 left-4 right-4 bg-[#0a0f1d]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50"
          >
            <div className="flex flex-col space-y-3">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'text-slate-300 hover:bg-white/5 hover:text-cyan-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('contact');
                }}
                className="mt-2 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-slate-950 font-bold text-sm tracking-wide shadow-lg uppercase"
              >
                <span>Hire Me</span>
                <Rocket className="w-4 h-4 text-slate-950" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
