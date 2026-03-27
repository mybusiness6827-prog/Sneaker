'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';

interface ScrollyCanvasProps {
  frameCount: number;
}

export const ScrollyCanvas: React.FC<ScrollyCanvasProps> = ({ frameCount }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // States for images and loading progress
  const [images, setImages] = useState<(HTMLImageElement | null)[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // Scroll progress from 0 to 1 over the 500vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Map scroll progress to frame index
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

  // Combined Loading Logic: Preload all, but show site at 50 frames
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
          
          // CRITICAL: Once 50 frames are ready, show the page
          if (count === 50) {
            setImages([...tempImages]);
            setIsLoaded(true);
          }
          
          // Once all are ready, update final state
          if (count === frameCount) {
            setImages([...tempImages]);
          }
        };

        img.onerror = () => {
          if (!active) return;
          count++;
          setLoadedCount(count);
          if (count === 50) setIsLoaded(true);
        };
      }
    };

    loadImages();
    return () => { active = false; };
  }, [frameCount]);

  // Render logic
  useEffect(() => {
    // Only start rendering once the 50-frame threshold is met
    if (!isLoaded || images.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    const render = (index: number) => {
      const idx = Math.floor(index);
      const img = images[idx];
      
      // Fallback: if we haven't loaded this specific frame yet (background loading),
      // try to find the nearest loaded frame to avoid flickering
      if (!img) {
        let nearest = -1;
        for (let i = idx; i >= 0; i--) { if (images[i]) { nearest = i; break; } }
        if (nearest === -1) {
          for (let i = idx; i < frameCount; i++) { if (images[i]) { nearest = i; break; } }
        }
        if (nearest !== -1 && images[nearest]) {
          drawImageCover(context, canvas, images[nearest]!);
        }
        return;
      }

      drawImageCover(context, canvas, img);
    };

    const drawImageCover = (ctx: CanvasRenderingContext2D, cvs: HTMLCanvasElement, img: HTMLImageElement) => {
      const cw = cvs.width;
      const ch = cvs.height;
      const iw = img.width;
      const ih = img.height;
      const ir = iw / ih;
      const cr = cw / ch;

      let dw = cw, dh = ch, ox = 0, oy = 0;
      if (ir > cr) {
        dw = ch * ir;
        ox = -(dw - cw) / 2;
      } else {
        dh = cw / ir;
        oy = -(dh - ch) / 2;
      }

      ctx.drawImage(img, ox, oy, dw, dh);
    };

    render(frameIndex.get());
    const unsubscribe = frameIndex.onChange(render);
    return () => unsubscribe();
  }, [isLoaded, images, frameIndex, frameCount]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const context = canvas.getContext('2d');
      if (context) {
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const progress = Math.min((loadedCount / 50) * 100, 100);

  return (
    <div ref={containerRef} className="relative h-[500vh] w-full bg-[#2872A1]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* UNIQUE PROFESSIONAL LOADER */}
        <AnimatePresence>
          {!isLoaded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 flex flex-col items-center justify-center z-[9999] bg-gradient-to-br from-[#2872A1] via-[#1a4a6e] to-[#0A0A0A]"
            >
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              
              {/* Center Ring Element */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="96" cy="96" r="88"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="3"
                  />
                  <motion.circle
                    cx="96" cy="96" r="88"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="552"
                    animate={{ strokeDashoffset: 552 - (552 * progress) / 100 }}
                    transition={{ type: "spring", stiffness: 40, damping: 25 }}
                  />
                </svg>
                
                <div className="flex flex-col items-center">
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-black italic text-white leading-none mb-1 shadow-lg shadow-white/10"
                  >
                    {Math.round(progress)}%
                  </motion.span>
                  <span className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">
                    LACING UP...
                  </span>
                </div>
              </div>

              {/* Bottom Status - Removed Text as requested */}
              <div className="absolute bottom-20 flex flex-col items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="mt-4 flex gap-2">
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [8, 16, 8] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                        className="w-[3px] bg-white/20 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <canvas
          ref={canvasRef}
          className="h-full w-full block"
        />
      </div>
    </div>
  );
};

