"use client";

import React, { useEffect, useRef } from "react";

type HorizontalScrollerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function HorizontalScroller({ children, className = "" }: HorizontalScrollerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startX = 0;
    let startY = 0;

    const onWheel = (event: WheelEvent) => {
      // Only convert wheel movement to horizontal scroll when input is predominantly horizontal.
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      container.scrollLeft += event.deltaX;
      event.preventDefault();
    };

    const onTouchStart = (event: TouchEvent) => {
      if (!event.touches[0]) return;
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!event.touches[0]) return;
      const currentX = event.touches[0].clientX;
      const currentY = event.touches[0].clientY;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      // Keep vertical page scrolling natural when gesture is mostly vertical.
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;

      container.scrollLeft -= deltaX;
      startX = currentX;
      startY = currentY;
      event.preventDefault();
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {children}
    </div>
  );
}
