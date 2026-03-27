'use client';

import { useEffect, useRef } from 'react';
import { useScroll, useMotionValueEvent, animate } from 'framer-motion';

const SECTIONS = [0, 1341, 2364];
const COOLDOWN = 3000; // Increased cooldown to match slower animation

export const ScrollManager = () => {
  const { scrollY } = useScroll();
  const currentScroll = useRef(0);
  const isLocked = useRef(false);
  const touchStart = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    currentScroll.current = latest;
  });

  const getTargetSection = (direction: 'next' | 'prev') => {
    const current = currentScroll.current;

    let currentIndex = 0;
    let minDiff = Infinity;

    SECTIONS.forEach((pos, index) => {
      const diff = Math.abs(current - pos);
      if (diff < minDiff) {
        minDiff = diff;
        currentIndex = index;
      }
    });

    if (direction === 'next') {
      return SECTIONS[Math.min(currentIndex + 1, SECTIONS.length - 1)];
    } else {
      return SECTIONS[Math.max(currentIndex - 1, 0)];
    }
  };

  const activeAnimation = useRef<any>(null);

  const scrollToSection = (targetPos: number, bypassLock = false) => {
    if (!bypassLock && isLocked.current) return;

    // Stop any ongoing animation to prevent fighting
    if (activeAnimation.current) {
      activeAnimation.current.stop();
    }

    isLocked.current = true;

    // Custom animation for slower, premium transition
    activeAnimation.current = animate(window.scrollY, targetPos, {
      type: "tween",
      duration: 1.5,
      ease: "easeInOut",
      onUpdate: (latest) => {
        window.scrollTo(0, latest);
      },
      onComplete: () => {
        setTimeout(() => {
          isLocked.current = false;
        }, 200); // 200ms buffer after animation ends for scroll wheel
      }
    });
  };


  const handleWheel = (e: WheelEvent) => {
    if (isLocked.current) return;

    // Check if we've scrolled enough to trigger a move
    if (Math.abs(e.deltaY) > 20) {
      const direction = e.deltaY > 0 ? 'next' : 'prev';
      scrollToSection(getTargetSection(direction));
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // Keyboard always works, no delay/lock
    const key = e.key;
    if (key === 'ArrowDown' || key === 'PageDown') {
      e.preventDefault();
      scrollToSection(getTargetSection('next'), true);
    } else if (key === 'ArrowUp' || key === 'PageUp') {
      e.preventDefault();
      scrollToSection(getTargetSection('prev'), true);
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStart.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (isLocked.current) return;
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart.current - touchEnd;

    // Threshold for swipe
    if (Math.abs(diff) > 50) {
      const direction = diff > 0 ? 'next' : 'prev';
      scrollToSection(getTargetSection(direction));
    }
  };

  useEffect(() => {
    let snapTimeout: NodeJS.Timeout;

    const handleAutoSnap = () => {
      clearTimeout(snapTimeout);

      // Don't snap if we're currently animating or locked
      if (isLocked.current) return;

      snapTimeout = setTimeout(() => {
        if (isLocked.current) return;

        const current = currentScroll.current;

        // Find nearest section
        let nearestPos = SECTIONS[0];
        let minDiff = Infinity;

        SECTIONS.forEach((pos) => {
          const diff = Math.abs(current - pos);
          if (diff < minDiff) {
            minDiff = diff;
            nearestPos = pos;
          }
        });

        // If we're more than 2 pixels away from the nearest section, snap to it
        if (Math.abs(current - nearestPos) > 2) {
          scrollToSection(nearestPos, true);
        }
      }, 1000); // 1 second of inactivity before auto-snapping
    };

    window.addEventListener('scroll', handleAutoSnap);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('scroll', handleAutoSnap);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      clearTimeout(snapTimeout);
    };
  }, []);


  return null; // This component handles logic only
};
