"use client";
import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(true);

  // Smooth springs for the follower
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    // Check if the device has a fine pointer (mouse)
    const mql = window.matchMedia("(pointer: fine)");
    setIsFinePointer(mql.matches);
    
    const mqlListener = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    mql.addEventListener("change", mqlListener);
    
    setMounted(true);
    
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX - 20); // Center offset
      cursorY.set(e.clientY - 20);
      if (!isVisible) setIsVisible(true);
    };

    const mouseLeave = () => setIsVisible(false);
    const mouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseleave", mouseLeave);
    document.addEventListener("mouseenter", mouseEnter);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseleave", mouseLeave);
      document.removeEventListener("mouseenter", mouseEnter);
      mql.removeEventListener("change", mqlListener);
    };
  }, [cursorX, cursorY, isVisible]);

  useEffect(() => {
    // Only setup hover effects if it's a mouse device
    if (!isFinePointer) return;
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isFinePointer]);

  // Don't render until mounted to avoid hydration errors.
  // Also don't render on touch devices.
  if (!mounted || !isFinePointer) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[var(--color-sage-dark)] rounded-full pointer-events-none z-[9999]"
        style={{
          x: mousePosition.x - 4, // Center offset for 8px width
          y: mousePosition.y - 4,
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0 }}
      />
      
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-[var(--color-sage)] rounded-full pointer-events-none z-[9998]"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isVisible ? 1 : 0,
          backgroundColor: isHovering ? "rgba(138, 158, 126, 0.1)" : "rgba(247, 243, 237, 0)"
        }}
        transition={{ duration: 0.3 }}
      />
    </>
  );
}
