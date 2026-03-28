'use client';

import React, { useState, useEffect } from 'react';
import { useScroll } from 'framer-motion';
import { ScrollyCanvas } from '@/components/ScrollyCanvas';
import { Overlay } from '@/components/Overlay';
import { ScrollIndicator } from '@/components/ScrollIndicator';
import { ScrollManager } from '@/components/ScrollManager';

const SNAP_POINTS = [0, 1341, 2603];
const THRESHOLD = 250;

export default function Home() {
  const show_indicator = true;
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollY } = useScroll();
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const update = (latest: number) => {
      let closest = 0;
      let minDiff = Infinity;
      SNAP_POINTS.forEach((pos, idx) => {
        const diff = Math.abs(latest - pos);
        if (diff < minDiff) { minDiff = diff; closest = idx; }
      });
      // Section 1 is 0, Section 2 is 1, Section 3 is 2
      setActiveSection(minDiff <= THRESHOLD ? closest : (latest < SNAP_POINTS[1] ? 0 : (latest < SNAP_POINTS[2] ? 1 : 2)));
    };
    const unsub = scrollY.on('change', update);
    return () => unsub();
  }, [scrollY]);

  // Dynamic colors
  const bgColor = (activeSection === 0) ? '#bb593c' : '#6094bc';

  // Debugging info (if show_indicator is true)
  const [currentFrame, setCurrentFrame] = useState(0);
  const [currentScroll, setCurrentScroll] = useState(0);

  useEffect(() => {
    const unsubScroll = scrollY.on('change', (v) => setCurrentScroll(Math.round(v)));
    return () => unsubScroll();
  }, [scrollY]);

  return (
    <main
      className="relative no-scrollbar"
      style={{
        backgroundColor: bgColor,
        transition: 'background-color 1s ease-in-out'
      }}
    >
      <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <ScrollManager />
        <ScrollIndicator
          showIndicator={show_indicator}
          currentFrame={currentFrame}
          currentScroll={currentScroll}
          activeSection={activeSection}
        />
        <Overlay />
      </div>

      <ScrollyCanvas
        frameCount={102}
        onLoaded={() => setIsLoaded(true)}
        onFrameUpdate={(f) => setCurrentFrame(Math.round(f))}
      />

      {/* Spacer for bottom if needed or additional sections */}
      <section className="h-screen flex items-center justify-center relative z-20">
        <div className="bg-white/5 backdrop-blur-3xl p-16 md:p-24 rounded-[3rem] border border-white/10 text-center max-w-4xl mx-4 shadow-[0_32px_120px_-15px_rgba(0,0,0,0.5)]">
          <span className="text-blue-200/40 font-black text-xs tracking-[0.8em] uppercase mb-8 block">Final Destination</span>
          <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-[-0.04em] leading-[0.9]">
            READY TO<br />OWN THE AIR?
          </h3>
          <p className="mt-8 text-blue-100/60 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Join the elite who choose motion over stillness. The AIR JORDAN 1 Series is redefined for the modern legend.
          </p>
          <div className="mt-12 group relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/50 to-indigo-500/50 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
            <button className="relative px-12 py-5 bg-white text-blue-900 font-black rounded-full hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.2em] text-xs">
              Shop Collection
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
