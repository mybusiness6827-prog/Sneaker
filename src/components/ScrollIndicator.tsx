'use client';

import React from 'react';

interface ScrollIndicatorProps {
  showIndicator: boolean;
  currentFrame?: number;
  currentScroll?: number;
  activeSection?: number;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  showIndicator,
  currentFrame = 0,
  currentScroll = 0,
  activeSection = 0
}) => {
  if (!showIndicator) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none select-none">
      {/* HEADER */}
      <div className="bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col gap-3 min-w-[200px] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-1">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Debug Monitor</span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>

        {/* SCROLL DATA */}
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Scroll</span>
          <span className="text-sm font-black text-white italic tracking-tight">{currentScroll}<span className="text-[10px] ml-1 opacity-40 not-italic">px</span></span>
        </div>

        {/* FRAME DATA */}
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Frame</span>
          <span className="text-sm font-black text-[#FF6B35] italic tracking-tight">{Math.round(currentFrame)}</span>
        </div>

        {/* SECTION DATA */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Section</span>
          <div className="flex gap-1.5 items-center">
            {[0, 1, 2].map((s) => (
              <div
                key={s}
                className={`w-3 h-1.5 rounded-full transition-all duration-300 ${activeSection === s ? 'bg-white w-5' : 'bg-white/10'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER ACCENT */}
      <div className="bg-[#FF6B35] h-[2px] w-full rounded-full opacity-50" />
    </div>
  );
};
