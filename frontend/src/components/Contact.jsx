import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, AlertTriangle, Mail, Sparkles } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import confetti from 'canvas-confetti';

export default function Contact({ profile }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const email = profile?.email || 'zizoelsadany5@gmail.com';
  const github = profile?.githubUrl || 'https://github.com/zizoelsadany';
  const linkedin = profile?.linkedinUrl || 'https://linkedin.com/in/abd-elaziz-elsadany';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus({ loading: true, success: false, error: null });

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      let data = {};
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      }

      if (res.ok && data.success) {
        setStatus({ loading: false, success: true, error: null });
        setFormData({ name: '', email: '', message: '' });
        
        // Trigger celebratory confetti in cyan/blue
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#38bdf8', '#3b82f6', '#ffffff']
        });

        setTimeout(() => {
          setStatus((prev) => ({ ...prev, success: false }));
        }, 6000);
      } else {
        setStatus({ loading: false, success: false, error: data.message || 'Failed to send message.' });
      }
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, success: false, error: 'Network error. Please try again.' });
    }
  };

  return (
    <section id="contact" className="relative py-28 sm:py-36 bg-[#080b11] overflow-hidden">
      {/* Background ambient glow (Blue & Cyan) */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs font-mono font-semibold tracking-[0.25em] uppercase text-cyan-400 mb-2 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Get In Touch</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit'] leading-tight">
              Let's create something extraordinary together.
            </h2>

            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              Have a project in mind, an engineering problem to solve, or looking to collaborate? Drop me a message and I'll get back to you within 24 hours.
            </p>

            <div className="pt-4 space-y-3">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0d111d] border border-cyan-500/20 hover:border-cyan-400 text-slate-300 hover:text-white transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block font-mono">Direct Email</span>
                  <span className="text-sm font-semibold">{email}</span>
                </div>
              </a>

              <div className="flex gap-3 pt-2">
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0d111d] border border-cyan-500/20 hover:border-cyan-400 text-slate-300 hover:text-white text-xs font-semibold transition-all"
                >
                  <GithubIcon className="w-4 h-4 text-cyan-400" />
                  <span>GitHub</span>
                </a>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0d111d] border border-cyan-500/20 hover:border-cyan-400 text-slate-300 hover:text-white text-xs font-semibold transition-all"
                >
                  <LinkedinIcon className="w-4 h-4 text-sky-400" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0d111d] border border-cyan-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl">
              <h3 className="text-2xl font-bold text-white font-['Outfit'] mb-2">
                Send a Message
              </h3>
              <p className="text-sm text-slate-400 mb-8">
                Fill out the details below and I'll reply to your email promptly.
              </p>

              {status.success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 flex items-center gap-3 text-sm"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-cyan-400" />
                  <span>Message delivered successfully! Thank you for reaching out.</span>
                </motion.div>
              )}

              {status.error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3 text-sm"
                >
                  <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
                  <span>{status.error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold uppercase font-mono tracking-wider text-slate-400 mb-2">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#090d16] border border-cyan-500/20 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold uppercase font-mono tracking-wider text-slate-400 mb-2">
                    Your Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="e.g. sarah@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#090d16] border border-cyan-500/20 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold uppercase font-mono tracking-wider text-slate-400 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    placeholder="Tell me about your project, timeline, or idea..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#090d16] border border-cyan-500/20 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status.loading}
                  className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:brightness-110 active:scale-[0.99] text-slate-950 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.45)] disabled:opacity-50"
                >
                  {status.loading ? (
                    <span>Sending message...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4 text-slate-950" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
