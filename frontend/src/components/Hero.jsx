import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Terminal as TerminalIcon } from 'lucide-react';

export default function Hero({ profile, skills = [], projects = [] }) {
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'system', text: "Welcome to AbdElaziz's Interactive Terminal." },
    { type: 'system', text: 'Type "help" to see available commands (skills, projects, about, contact, clear).' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const terminalBodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = inputValue.trim().toLowerCase();
      const newHistory = [...terminalHistory, { type: 'input', text: inputValue }];

      switch (cmd) {
        case '':
          break;
        case 'help':
          newHistory.push({
            type: 'output',
            text: [
              'Available commands:',
              '  - about    : Learn more about AbdElaziz.',
              '  - skills   : Print out core technical stack.',
              '  - projects : List featured project titles.',
              '  - contact  : Get email and social contact links.',
              '  - clear    : Clear terminal screen.',
              '  - admin    : Open Admin Panel dashboard.'
            ].join('\n')
          });
          break;
        case 'about':
          newHistory.push({
            type: 'output',
            text: `${profile?.name || 'AbdElaziz Elsadany'} is a ${profile?.title || 'Senior Full-Stack Developer'} based in ${profile?.location || 'Cairo, Egypt'}. ${profile?.bioText1 || ''}`
          });
          break;
        case 'skills':
          if (skills.length === 0) {
            newHistory.push({ type: 'output', text: 'JavaScript, TypeScript, React, Next.js, Node.js, Express, MongoDB, Tailwind CSS, Docker, Git' });
          } else {
            const str = skills.map((c) => `${c.category}: ${c.skills?.map((s) => s.name).join(', ')}`).join('\n');
            newHistory.push({ type: 'output', text: str });
          }
          break;
        case 'projects':
          if (projects.length === 0) {
            newHistory.push({ type: 'output', text: 'Featured: Tilawa Live, Headless E-Commerce, Kanban Board' });
          } else {
            const str = projects.map((p, i) => `${i + 1}. ${p.title} (${p.tags?.join(', ')})`).join('\n');
            newHistory.push({ type: 'output', text: str });
          }
          break;
        case 'contact':
          newHistory.push({
            type: 'output',
            text: `Email: ${profile?.email || 'zizoelsadany5@gmail.com'}\nGitHub: ${profile?.githubUrl || 'https://github.com/zizoelsadany'}\nLinkedIn: ${profile?.linkedinUrl || 'https://linkedin.com/in/abd-elaziz-elsadany'}`
          });
          break;
        case 'clear':
          setTerminalHistory([]);
          setInputValue('');
          return;
        case 'admin':
          newHistory.push({ type: 'output', text: 'Opening Admin Panel (/admin.html)...' });
          setTimeout(() => {
            window.open('/admin.html', '_blank');
          }, 600);
          break;
        default:
          newHistory.push({
            type: 'error',
            text: `sh: command not found: "${cmd}". Type "help" for a list of commands.`
          });
      }

      setTerminalHistory(newHistory);
      setInputValue('');
    }
  };

  const name = profile?.name || 'AbdElaziz Elsadany';
  const title = profile?.title || 'Senior Full-Stack Developer';
  const desc = profile?.description || 'I build premium, high-performance web applications with a focus on animation, responsive UI architecture, and robust database logic.';

  return (
    <section id="home" className="relative min-h-screen pt-36 pb-20 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Dynamic Animated Floating Code Shapes (Large & Active Blue/Cyan) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Shape 1: </> */}
        <motion.div
          animate={{
            y: [0, -35, 0],
            rotate: [0, 14, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[16%] left-[6%] font-mono font-black text-7xl sm:text-9xl md:text-[11rem] text-cyan-500/20 drop-shadow-[0_0_25px_rgba(6,182,212,0.3)]"
        >
          &lt;/&gt;
        </motion.div>

        {/* Shape 2: { } */}
        <motion.div
          animate={{
            y: [0, -45, 0],
            rotate: [0, -18, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="absolute top-[22%] right-[5%] font-mono font-black text-8xl sm:text-9xl md:text-[13rem] text-sky-400/20 drop-shadow-[0_0_30px_rgba(56,189,248,0.3)]"
        >
          {'{ }'}
        </motion.div>

        {/* Shape 3: # */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            rotate: [0, 16, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5,
          }}
          className="absolute bottom-[22%] left-[8%] font-mono font-black text-7xl sm:text-8xl md:text-[10rem] text-blue-500/20 drop-shadow-[0_0_20px_rgba(59,130,246,0.25)]"
        >
          #
        </motion.div>

        {/* Shape 4: λ */}
        <motion.div
          animate={{
            y: [0, -40, 0],
            rotate: [0, -12, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute bottom-[28%] right-[7%] font-mono font-black text-8xl sm:text-9xl md:text-[11rem] text-cyan-400/20 drop-shadow-[0_0_25px_rgba(6,182,212,0.3)]"
        >
          &lambda;
        </motion.div>
      </div>

      {/* Ambient background glows (All Blue/Cyan, Zero Red) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-gradient-to-tr from-cyan-500/20 via-sky-500/15 to-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center z-10">
        
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hero-available-badge inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-sm backdrop-blur-md mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)] animate-pulse" />
          <span>Available for Work</span>
        </motion.div>

        {/* Hero Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white font-['Outfit'] max-w-4xl"
        >
          {name}
        </motion.h1>

        {/* Gradient Role Subtitle - Electric Blue & Cyan */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-cyan-400 to-sky-400 bg-clip-text text-transparent font-['Outfit']"
        >
          {title}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed"
        >
          {desc}
        </motion.p>

        {/* Action Buttons - Exactly matching user screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm sm:text-base hover:bg-slate-200 transition-all active:scale-95 shadow-lg shadow-white/5"
          >
            Contact Me
          </a>

          <a
            href="#projects"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#0a0e17] text-white font-semibold text-sm sm:text-base border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all active:scale-95"
          >
            View My Projects
          </a>
        </motion.div>

        {/* Interactive Terminal Sandbox */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-14 w-full max-w-3xl rounded-2xl bg-[#090f1d]/90 border border-cyan-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden text-left backdrop-blur-xl"
        >
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0a1224] border-b border-cyan-500/15">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-500/80" />
              <span className="w-3 h-3 rounded-full bg-sky-400/80" />
              <span className="w-3 h-3 rounded-full bg-blue-500/80" />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300">
              <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>guest@elsadany.dev:~</span>
            </div>
            <div className="w-12" />
          </div>

          {/* Terminal Body */}
          <div
            ref={terminalBodyRef}
            onClick={() => inputRef.current?.focus()}
            className="p-5 font-mono text-xs sm:text-sm h-64 overflow-y-auto space-y-2 cursor-text"
          >
            {terminalHistory.map((item, idx) => (
              <div key={idx}>
                {item.type === 'system' && (
                  <p className="text-slate-400">{item.text}</p>
                )}
                {item.type === 'input' && (
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="text-cyan-400 font-semibold">guest@elsadany.dev:~$</span>
                    <span>{item.text}</span>
                  </div>
                )}
                {item.type === 'output' && (
                  <pre className="text-slate-300 whitespace-pre-wrap font-mono mt-1 pl-4 border-l-2 border-cyan-500/50">
                    {item.text}
                  </pre>
                )}
                {item.type === 'error' && (
                  <p className="text-rose-400 pl-4">{item.text}</p>
                )}
              </div>
            ))}

            {/* Input Line */}
            <div className="flex items-center gap-2 text-slate-200 pt-1">
              <span className="text-cyan-400 font-semibold shrink-0">guest@elsadany.dev:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleCommand}
                placeholder="type 'help'..."
                className="w-full bg-transparent border-none outline-none text-slate-100 font-mono text-xs sm:text-sm placeholder:text-slate-600"
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
