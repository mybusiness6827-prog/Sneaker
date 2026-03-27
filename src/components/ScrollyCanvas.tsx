'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';

interface ScrollyCanvasProps {
  frameCount: number;
  onLoaded?: () => void;
}

export const ScrollyCanvas: React.FC<ScrollyCanvasProps> = ({ frameCount, onLoaded }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ─── STATE ──────────────────────────────────────────────────────────────────
  const [images, setImages] = useState<(HTMLImageElement | null)[]>([]);
  const [isLoadedInternal, setIsLoadedInternal] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  // ─── SCROLL SYNC ──────────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

  // ─── SMOOTH COUNTER LOGIC ──────────────────────────────────────────────────
  // This logic creates a cinematic progress feel (min 3s duration)
  useEffect(() => {
    let active = true;
    const startTime = Date.now();
    const minDuration = 3000; // Increased to 4s for even smoother feel

    const updateDisplay = () => {
      if (!active) return;

      const realProgress = (loadedCount / frameCount) * 100;
      const timeElapsed = Date.now() - startTime;
      const timeProgress = (timeElapsed / minDuration) * 100;

      // Follow the time-based progress, but capped by actual loaded progress
      const target = Math.min(timeProgress, realProgress);

      setDisplayProgress(prev => {
        // Linear-to-smooth transition
        const diff = target - prev;
        const next = prev + diff * 0.08;

        if (next >= 99.8 && realProgress >= 100 && timeProgress >= 100) {
          setIsLoadedInternal(true);
          if (onLoaded) onLoaded();
          return 100;
        }
        return next;
      });

      if (!isLoadedInternal) {
        requestAnimationFrame(updateDisplay);
      }
    };

    requestAnimationFrame(updateDisplay);
    return () => { active = false; };
  }, [loadedCount, frameCount, isLoadedInternal, onLoaded]);

  // ─── LOADING LOGIC (FETCHING IMAGES) ────────────────────────────────────────
  useEffect(() => {
    let active = true;
    const tempImages = new Array(frameCount).fill(null);
    let count = 0;

    const loadImages = () => {
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        const paddedIndex = i.toString().padStart(3, '0');
        img.src = `/sequence/frame_${paddedIndex}_delay-0.05s.webp`;

        img.onload = () => {
          if (!active) return;
          tempImages[i] = img;
          count++;
          setLoadedCount(count);
          if (count === frameCount) setImages([...tempImages]);
        };
        img.onerror = () => {
          if (!active) return;
          count++;
          setLoadedCount(count);
        };
      }
    };

    loadImages();
    return () => { active = false; };
  }, [frameCount]);

  // ─── RENDER ENGINE ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoadedInternal || images.length === 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    const render = (index: number) => {
      const idx = Math.floor(index);
      const img = images[idx];
      if (!img) return;

      const cw = canvas.width, ch = canvas.height;
      const iw = img.width, ih = img.height;
      const ir = iw / ih, cr = cw / ch;

      let dw = cw, dh = ch, ox = 0, oy = 0;
      if (ir > cr) {
        dw = ch * ir;
        ox = -(dw - cw) / 2;
      } else {
        dh = cw / ir;
        oy = -(dh - ch) / 2;
      }
      context.drawImage(img, ox, oy, dw, dh);
    };

    render(frameIndex.get());
    const unsub = frameIndex.onChange(render);
    return () => unsub();
  }, [isLoadedInternal, images, frameIndex]);

  // ─── RESIZE HANDLER ───────────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) { ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className="relative h-[500vh] w-full bg-[#2872A1]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* SIMPLE MINIMALIST LOADER */}
        <AnimatePresence>
          {!isLoadedInternal && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="fixed inset-0 flex flex-col items-center justify-center z-[999999] bg-[#C25B33]"
            >
              <div className="flex flex-col items-center px-6 text-center">
                <motion.span
                  className="text-7xl md:text-8xl font-black italic text-white leading-none tracking-tighter mb-6"
                >
                  {Math.round(displayProgress)}%
                </motion.span>

                <div className="w-48 md:w-64 h-[4px] bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    style={{ width: `${displayProgress}%` }}
                  />
                </div>

                <span className="mt-8 text-[11px] font-bold text-white/50 tracking-[0.3em] uppercase">
                  Elevating your experience
                </span>
              </div>

              <div className="absolute bottom-12 px-8 text-center">
                <p className="text-[10px] font-medium text-white/40 tracking-widest leading-relaxed uppercase">
                  First-time entry may take a moment
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <canvas ref={canvasRef} className="h-full w-full block" />
      </div>
    </div>
  );
};
