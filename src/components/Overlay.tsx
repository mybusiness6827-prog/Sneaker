'use client';

import React from 'react';
import { motion, AnimatePresence, useScroll, type Variants } from 'framer-motion';

// ─── Animation Variants ──────────────────────────────────────────────────────
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: 'easeOut' as const } },
  exit: { opacity: 0, transition: { duration: 0.4 } },
};
const fadeUp: Variants = {
  hidden: { y: 28, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.85, ease: 'easeInOut' as const } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};
const slideLeft: Variants = {
  hidden: { x: -60, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { duration: 0.9, ease: 'easeInOut' as const } },
  exit: { x: -40, opacity: 0, transition: { duration: 0.35 } },
};
const slideRight: Variants = {
  hidden: { x: 60, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { duration: 0.9, ease: 'easeInOut' as const } },
  exit: { x: 40, opacity: 0, transition: { duration: 0.35 } },
};
const slideInLeft: Variants = {
  hidden: { x: -80, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { duration: 0.9, ease: 'easeInOut' as const } },
  exit: { x: -60, opacity: 0, transition: { duration: 0.4 } },
};
const slideInRight: Variants = {
  hidden: { x: 80, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { duration: 0.9, ease: 'easeInOut' as const } },
  exit: { x: 60, opacity: 0, transition: { duration: 0.4 } },
};
// ─────────────────────────────────────────────────────────────────────────────

const SNAP_POINTS = [0, 1341, 2364];
const THRESHOLD = 250;

export const Overlay = () => {
  const { scrollY } = useScroll();
  const [activeSection, setActiveSection] = React.useState(0);

  React.useEffect(() => {
    const update = (latest: number) => {
      let closest = -1;
      let minDiff = Infinity;
      SNAP_POINTS.forEach((pos, idx) => {
        const diff = Math.abs(latest - pos);
        if (diff < minDiff) { minDiff = diff; closest = idx; }
      });
      setActiveSection(minDiff <= THRESHOLD ? closest : -1);
    };
    update(scrollY.get());
    const unsub = scrollY.on('change', update);
    return () => unsub();
  }, [scrollY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 w-full h-screen overflow-hidden">

      {/* ══════════════════════════════════════════════════════
          SECTION 1 — HERO
          ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeSection === 0 && (
          <motion.div
            key="section1"
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute inset-0 z-20 overflow-hidden"
          >
            {/* Ghost watermark */}
            <motion.div
              variants={fadeIn}
              className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
              style={{ opacity: 0.025 }}
            >
              <span
                className="font-black italic uppercase"
                style={{
                  fontSize: 'clamp(18rem, 38vw, 52rem)',
                  letterSpacing: '-0.07em',
                  lineHeight: 1,
                  WebkitTextStroke: '2px white',
                  color: 'transparent',
                }}
              >
                AJ·1
              </span>
            </motion.div>

            {/* Top accent line */}
            <motion.div
              variants={fadeIn}
              className="absolute top-0 inset-x-0"
              style={{ height: '2px', background: 'linear-gradient(90deg, transparent 0%, #FF6B35 25%, #FFD700 50%, #FF6B35 75%, transparent 100%)' }}
            />

            {/* Bottom accent line */}
            <motion.div
              variants={fadeIn}
              className="absolute bottom-0 inset-x-0 opacity-30"
              style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, #FFD700 50%, transparent 100%)' }}
            />

            {/* Top bar */}
            <div className="absolute top-0 inset-x-0 flex items-center justify-between px-5 md:px-10 pt-5">
              <motion.div variants={slideLeft} className="flex items-center gap-2">
                <div className="w-4 h-[1.5px] rounded-full" style={{ background: '#FF6B35' }} />
                <span className="text-[8px] md:text-[9px] font-black tracking-[0.55em] uppercase" style={{ color: '#FF6B35' }}>
                  Nike · Flight Series
                </span>
              </motion.div>
              <motion.div variants={fadeIn} className="flex flex-col items-center gap-[2px]">
                <span className="text-[7px] font-black tracking-[0.5em] uppercase" style={{ color: 'rgba(255,215,0,0.7)' }}>
                  ARCHIVE
                </span>
                <span
                  className="font-black italic leading-none"
                  style={{
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.8rem)',
                    letterSpacing: '-0.03em',
                    background: 'linear-gradient(135deg, #FFD700, #FF6B35)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  NO. 01
                </span>
              </motion.div>
              <motion.div variants={slideRight} className="flex items-center gap-2">
                <span className="text-[8px] md:text-[9px] font-black tracking-[0.55em] uppercase" style={{ color: '#FFD700' }}>
                  Retro · OG
                </span>
                <div className="w-4 h-[1.5px] rounded-full" style={{ background: '#FFD700' }} />
              </motion.div>
            </div>

            {/* Left column */}
            <motion.div
              variants={stagger}
              className="absolute inset-y-0 left-0 flex flex-col justify-center gap-0 pl-4 md:pl-8 w-[25vw] max-w-[180px]"
            >
              <motion.div
                variants={slideLeft}
                className="absolute left-1 md:left-2 top-[25%] bottom-[25%] w-[1.5px] rounded-full"
                style={{ background: 'linear-gradient(180deg, transparent, #FF6B35 30%, #FFD700 70%, transparent)' }}
              />
              <motion.div variants={slideLeft} className="flex flex-col pl-4">
                <span className="text-[7px] font-black tracking-[0.5em] uppercase mb-3" style={{ color: '#FF6B35' }}>
                  Est. Chicago
                </span>
                <span
                  className="font-black italic uppercase select-none leading-[0.82]"
                  style={{ fontSize: 'clamp(1.6rem, 3.8vw, 3.2rem)', letterSpacing: '-0.05em', WebkitTextStroke: '1px rgba(255,255,255,0.3)', color: 'transparent' }}
                >
                  AIR
                </span>
                <span
                  className="font-black italic uppercase text-white select-none leading-[0.82]"
                  style={{ fontSize: 'clamp(1.6rem, 3.8vw, 3.2rem)', letterSpacing: '-0.05em' }}
                >
                  JORDAN
                </span>
                <span
                  className="font-black italic uppercase select-none leading-[0.82]"
                  style={{
                    fontSize: 'clamp(1.6rem, 3.8vw, 3.2rem)',
                    letterSpacing: '-0.05em',
                    background: 'linear-gradient(125deg, #FFD700 0%, #FF6B35 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  ONE
                </span>
              </motion.div>
              <motion.div
                variants={slideLeft}
                className="pl-4 mt-6 flex flex-col gap-1 border-l-[1.5px]"
                style={{ borderColor: 'rgba(255,107,53,0.4)' }}
              >
                <span className="text-[7px] font-black tracking-[0.4em] uppercase text-white/40">Silhouette</span>
                <span className="text-[9px] font-bold text-white uppercase tracking-widest leading-none mt-1">OG High-Top</span>
              </motion.div>
            </motion.div>

            {/* Right column */}
            <motion.div
              variants={stagger}
              className="absolute inset-y-0 right-0 flex flex-col justify-center items-end gap-0 pr-4 md:pr-8 w-[25vw] max-w-[180px] text-right"
            >
              <motion.div
                variants={slideRight}
                className="absolute right-1 md:right-2 top-[25%] bottom-[25%] w-[1.5px] rounded-full"
                style={{ background: 'linear-gradient(180deg, transparent, #FFD700 30%, #FF6B35 70%, transparent)' }}
              />
              {[
                { label: 'Model', value: 'Retro High OG' },
                { label: 'Leather', value: 'Full-Grain' },
                { label: 'Unit', value: 'Nike Air' },
              ].map((spec, i) => (
                <motion.div
                  key={spec.label}
                  variants={slideRight}
                  className="flex flex-col items-end gap-1 mb-6 last:mb-0 pr-4 border-r-[1.5px]"
                  style={{ borderColor: i % 2 === 0 ? 'rgba(255,215,0,0.3)' : 'rgba(255,107,53,0.3)' }}
                >
                  <span className="text-[7px] font-black tracking-[0.4em] uppercase" style={{ color: i % 2 === 0 ? '#FFD700' : '#FF6B35', opacity: 0.6 }}>
                    {spec.label}
                  </span>
                  <span className="text-[9px] font-bold text-white uppercase tracking-widest leading-none">
                    {spec.value}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Scroll pulse */}
            <motion.div
              variants={fadeUp}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-[6px] pointer-events-auto cursor-pointer"
            >
              <span className="text-[7px] font-black tracking-[0.5em] uppercase" style={{ color: 'rgba(255,215,0,0.4)' }}>
                Explore
              </span>
              <div className="relative w-7 h-7 rounded-full border flex items-center justify-center" style={{ borderColor: 'rgba(255,107,53,0.25)' }}>
                <div className="absolute w-7 h-7 rounded-full animate-ping" style={{ background: 'rgba(255,107,53,0.08)' }} />
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B35)' }} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
          SECTION 2 — UNIVERSITY BLUE COLORWAY
          ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeSection === 1 && (
          <>
            {/* LEFT — Main copy */}
            <motion.div
              key="s2-left"
              variants={slideInLeft}
              initial="hidden"
              animate="show"
              exit="exit"
              className="absolute inset-y-0 left-0 flex flex-col justify-center pl-10 md:pl-20 pr-6 max-w-[45%] md:max-w-[38%] z-20"
            >
              <motion.span
                variants={fadeIn}
                className="text-[9px] font-black tracking-[0.55em] uppercase mb-5 flex items-center gap-2"
                style={{ color: '#7EC8E3' }}
              >
                <span className="inline-block w-6 h-[1.5px] rounded-full" style={{ background: '#7EC8E3' }} />
                02 · The Color
              </motion.span>

              <h2
                className="font-black italic uppercase leading-[0.88] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(2.4rem, 5.8vw, 5.2rem)' }}
              >
                <span className="text-white">MADE FOR</span><br />
                <span style={{ background: 'linear-gradient(125deg, #FFFFFF 0%, #7EC8E3 50%, #4A9FC4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  THOSE WHO
                </span><br />
                <span style={{ WebkitTextStroke: '1.5px rgba(126,200,227,0.5)', color: 'transparent' }}>
                  STAND OUT.
                </span>
              </h2>

              <p className="mt-7 text-[13px] md:text-[14px] text-white/60 leading-relaxed font-medium max-w-[300px]">
                This University Blue is not just a color. It is a statement.
                People will notice. People will stop and look. And that is
                exactly why you need it on your feet.
              </p>

              <p
                className="mt-5 text-[11px] font-black tracking-[0.08em] uppercase max-w-[260px] leading-snug"
                style={{ color: 'rgba(126,200,227,0.8)' }}
              >
                Worn by icons. Wanted by everyone.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <span
                  className="px-4 py-1.5 rounded-full text-[8px] font-black tracking-[0.35em] uppercase"
                  style={{ background: 'rgba(126,200,227,0.12)', color: '#7EC8E3', border: '1px solid rgba(126,200,227,0.25)' }}
                >
                  Limited Pairs Left
                </span>
              </div>

              <div className="mt-6 h-[2px] w-16 rounded-full" style={{ background: 'linear-gradient(90deg, #7EC8E3, rgba(126,200,227,0))' }} />
            </motion.div>

            {/* RIGHT — Color details */}
            <motion.div
              key="s2-right"
              variants={slideInRight}
              initial="hidden"
              animate="show"
              exit="exit"
              className="absolute inset-y-0 right-0 flex flex-col justify-center items-end text-right pr-8 md:pr-14 pl-6 max-w-[28%] z-20 gap-8"
            >
              <motion.div variants={fadeIn} className="flex flex-col items-end gap-3">
                <span className="text-[7px] font-black tracking-[0.5em] uppercase" style={{ color: 'rgba(126,200,227,0.5)' }}>
                  Colors
                </span>
                {[
                  { name: 'University Blue', bg: '#7EC8E3' },
                  { name: 'Clean White', bg: '#FFFFFF' },
                  { name: 'Pitch Black', bg: '#111111' },
                ].map((c) => (
                  <div key={c.name} className="flex items-center gap-2">
                    <span className="text-[8px] font-bold text-white/60 uppercase tracking-widest">{c.name}</span>
                    <div className="w-5 h-5 rounded-full border border-white/20 shadow-md" style={{ background: c.bg }} />
                  </div>
                ))}
              </motion.div>

              <div className="w-full h-[1px] opacity-20" style={{ background: 'linear-gradient(90deg, transparent, #7EC8E3)' }} />

              {[
                { label: 'Fit', value: 'High Top' },
                { label: 'Feel', value: 'Cloud-Like' },
                { label: 'Build', value: 'Premium Leather' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  variants={slideRight}
                  className="flex flex-col items-end gap-[3px] border-r-[1.5px] pr-3"
                  style={{ borderColor: i === 0 ? 'rgba(126,200,227,0.4)' : 'rgba(255,255,255,0.1)' }}
                >
                  <span className="text-[7px] font-black tracking-[0.4em] uppercase" style={{ color: 'rgba(126,200,227,0.5)' }}>
                    {s.label}
                  </span>
                  <span className="text-[9px] font-bold text-white uppercase tracking-widest leading-none">
                    {s.value}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
          SECTION 3 — DELIVERY & TRUST (Redesigned)
          ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeSection === 2 && (
          <motion.div
            key="section3-redesign"
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute inset-0 z-20 pointer-events-none"
          >
            {/* Top Left: Main Headline */}
            <motion.div
              variants={slideInLeft}
              className="absolute top-20 left-10 md:left-20 max-w-sm"
            >
              <span className="text-[10px] font-black tracking-[0.5em] text-[#7EC8E3] uppercase block mb-4">
                Safe & Reliable
              </span>
              <h2
                className="font-black italic uppercase leading-[0.88] text-white tracking-[-0.04em]"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
              >
                FASTEST<br />
                <span style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.2)', color: 'transparent' }}>DOOR TO</span><br />
                DOOR.
              </h2>
              <div className="mt-6 w-12 h-[2px] bg-[#7EC8E3] rounded-full" />
            </motion.div>

            {/* Top Right: Arrival Card */}
            <motion.div
              variants={slideInRight}
              className="absolute top-20 right-10 md:right-20 bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] p-6 rounded-[2rem] flex flex-col items-center gap-2 group hover:scale-105 transition-transform duration-500"
            >
              <div className="text-[8px] font-black text-blue-900/30 uppercase tracking-widest">Speed</div>
              <div className="text-3xl font-black text-blue-950 italic leading-none">2-3</div>
              <div className="text-[10px] font-bold text-blue-800 uppercase tracking-tighter">Business Days</div>
              <div className="mt-2 text-[7px] font-black bg-green-500 text-white px-3 py-1 rounded-full uppercase tracking-widest">Express</div>
            </motion.div>

            {/* Bottom Left: Safety Card */}
            <motion.div
              variants={fadeUp}
              className="absolute bottom-20 left-10 md:left-20 bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] max-w-[240px] shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#7EC8E3] flex items-center justify-center shadow-[0_0_20px_rgba(126,200,227,0.4)]">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[11px] font-black text-white uppercase tracking-widest leading-none">Safe Packaging</span>
              </div>
              <p className="text-[12px] text-white/50 leading-relaxed font-medium">
                Double boxed and insured. We make sure your box arrives without single mark on it.
              </p>
            </motion.div>

            {/* Bottom Right: Tracking Card */}
            <motion.div
              variants={slideInRight}
              className="absolute bottom-20 right-10 md:right-20 flex flex-col items-end"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex items-center gap-5 shadow-2xl">
                <div className="flex flex-col items-end">
                  <span className="text-[7px] font-black text-[#7EC8E3] uppercase tracking-widest mb-1 italic">Realtime Status</span>
                  <span className="text-[13px] font-black text-white uppercase tracking-wider">Live Tracking</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>
              </div>

              <div className="mt-6 flex flex-col items-end gap-2 pr-2">
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.3em]">Hiring Experts</span>
                <span className="text-[11px] font-black text-white uppercase tracking-widest">7 Day Free Return</span>
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
