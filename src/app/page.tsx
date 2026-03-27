'use client';

import React, { useState } from 'react';
import { ScrollyCanvas } from '@/components/ScrollyCanvas';
import { Overlay } from '@/components/Overlay';
import { ScrollIndicator } from '@/components/ScrollIndicator';
import { ScrollManager } from '@/components/ScrollManager';

export default function Home() {
  const show_indicator = false;
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <main className="relative bg-[#2872A1] no-scrollbar">
      {/* 
          WRAPPER FOR MAIN CONTENT: 
          Hidden (opacity 0) while loading to prevent "bleeding" of section 1 text 
      */}
      <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <ScrollManager />
        <ScrollIndicator showIndicator={show_indicator} />
        <Overlay />
      </div>

      <ScrollyCanvas 
        frameCount={102} 
        onLoaded={() => setIsLoaded(true)}
      />

      {/* Spacer for bottom if needed or additional sections */}
      <section className="h-screen flex items-center justify-center bg-[#2872A1] relative z-20">
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
