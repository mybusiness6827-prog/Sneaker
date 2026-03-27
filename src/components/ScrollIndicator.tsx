'use client';

import React, { useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

interface ScrollIndicatorProps {
  showIndicator?: boolean;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ showIndicator = true }) => {
  const { scrollY } = useScroll();
  const [pixels, setPixels] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setPixels(Math.round(latest));
  });

  if (!showIndicator) return null;

  return (
    <div className="fixed top-8 right-8 z-[100] pointer-events-none">
      <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-2xl">
        <span className="text-white/70 font-mono text-sm tracking-tighter">
          SCROLL: <span className="text-white font-bold">{pixels}px</span>
        </span>
      </div>
    </div>
  );
};
