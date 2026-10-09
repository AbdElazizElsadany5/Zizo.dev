import React, { useState, useEffect } from 'react';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechMarquee from './components/TechMarquee';
import About from './components/About';
import Services from './components/Services';
import Skills from './components/Skills';
import ProjectsSection from './components/ProjectsSection';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState(null);
  const [services, setServices] = useState([]);
  const [philosophy, setPhilosophy] = useState([]);
  const [settings, setSettings] = useState({
    smoothScrollAbout: true,
    smoothScrollProjects: true,
    smoothScrollServices: false,
    smoothScrollSkills: false
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('zizo_theme') || 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('zizo_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    // 1. Visitor Analytics Tracking
    try {
      const referrer = document.referrer || 'Direct';
      const urlParams = new URLSearchParams(window.location.search);
      const searchQuery = urlParams.get('q') || urlParams.get('search') || urlParams.get('utm_source') || '';

      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: window.location.pathname,
          referrer,
          searchQuery,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          language: navigator.language || navigator.userLanguage || ''
        })
      }).catch(() => {});
    } catch (e) {}

    // 2. Fetch Animation & Smooth Scroll Settings
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === 'object') {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => console.error('Error fetching settings:', err));

    // Fetch profile
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error('Error fetching profile:', err));

    // Fetch skills
    fetch('/api/skills')
      .then((res) => res.json())
      .then((data) => setSkills(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Error fetching skills:', err));

    // Fetch projects with smooth 200ms display delay
    const startProjects = Date.now();
    fetch(`/api/projects?t=${startProjects}`)
      .then((res) => res.json())
      .then((data) => {
        const elapsed = Date.now() - startProjects;
        const delay = Math.max(0, 200 - elapsed);
        setTimeout(() => {
          setProjects(Array.isArray(data) ? data : []);
        }, delay);
      })
      .catch((err) => {
        console.error('Error fetching projects:', err);
        setProjects([]);
      });

    // Fetch services
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Error fetching services:', err));

    // Fetch philosophy
    fetch('/api/philosophy')
      .then((res) => res.json())
      .then((data) => setPhilosophy(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Error fetching philosophy:', err));
  }, []);

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-clip bg-[#080b11] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* High-end "Z" Logo Loading Screen */}
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-40 z-0" />

      {/* Ambient Radial Lights */}
      <div className="fixed top-0 left-1/4 w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] max-w-full bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-0 sm:right-10 w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] max-w-full bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen w-full max-w-full overflow-x-clip">
        <Navbar profile={profile} theme={theme} onToggleTheme={toggleTheme} />

        <main className="flex-grow w-full max-w-full min-w-0">
          {/* Hero Section with Interactive Terminal */}
          <Hero profile={profile} skills={skills} projects={projects} />

          {/* Programming Languages & Technologies Marquee Banner (Image 1) */}
          <TechMarquee />

          {/* About Me Section (respects smoothScrollAbout setting) */}
          <About profile={profile} smoothScroll={settings.smoothScrollAbout} />

          {/* Services Section (respects smoothScrollServices setting) */}
          <Services services={services} philosophy={philosophy} smoothScroll={settings.smoothScrollServices} />

          {/* Skills Section (respects smoothScrollSkills setting) */}
          <Skills skills={skills} smoothScroll={settings.smoothScrollSkills} />

          {/* Selected Portfolio / Project-by-Project Scroll Showcase (respects smoothScrollProjects setting) */}
          <ProjectsSection projects={projects} smoothScroll={settings.smoothScrollProjects} />

          {/* Contact Section */}
          <Contact profile={profile} />
        </main>

        {/* Footer */}
        <Footer profile={profile} />
      </div>
    </div>
  );
}
