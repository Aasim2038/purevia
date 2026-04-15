"use client";
import React, { useState } from 'react';
import { AnimatePresence, motion, PanInfo } from 'framer-motion';

type ProductGalleryProps = {
  product: {
    name: string;
    images: string[];
    videoUrl?: string | null;
  };
};

export default function ProductGallery({ product }: ProductGalleryProps) {
  const imageList = Array.isArray(product.images) ? product.images : [];
  const mediaItems: Array<{ type: 'image' | 'video'; src: string; thumb: string; key: string }> = [
    ...imageList.map((src, idx) => ({ type: 'image' as const, src, thumb: src, key: `image-${idx}-${src}` })),
    ...(product.videoUrl ? [{ type: 'video' as const, src: product.videoUrl, thumb: product.videoUrl, key: `video-${product.videoUrl}` }] : []),
  ];
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const hasVideo = Boolean(product.videoUrl);
  const activeMedia = mediaItems[activeIdx];

  const moveToIndex = (nextIdx: number) => {
    if (mediaItems.length === 0) return;
    const wrapped = (nextIdx + mediaItems.length) % mediaItems.length;
    setDirection(nextIdx > activeIdx ? 1 : -1);
    setActiveIdx(wrapped);
  };

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipePower = Math.abs(info.offset.x) * info.velocity.x;
    if (swipePower < -5000 || info.offset.x < -60) {
      moveToIndex(activeIdx + 1);
    } else if (swipePower > 5000 || info.offset.x > 60) {
      moveToIndex(activeIdx - 1);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="relative aspect-square w-full rounded-[20px] overflow-hidden bg-[var(--color-cream)] border border-[rgba(138,158,126,0.2)]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {activeMedia ? (
            <motion.div
              key={activeMedia.key}
              custom={direction}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, x: direction >= 0 ? 36 : -36, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction >= 0 ? -36 : 36, scale: 0.98 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              {activeMedia.type === 'video' ? (
                <video
                  src={activeMedia.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={activeMedia.src}
                  alt={`${product.name} ${activeIdx + 1}`}
                  fill
                  className="absolute inset-0 w-full h-full object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="fallback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center font-serif text-[clamp(2rem,4vw,3rem)] text-[var(--color-sage-dark)] font-light"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              {product.name}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex gap-4 overflow-x-auto snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2">
        {imageList.map((img, idx) => (
          <button
            key={`${img}-${idx}`}
            onClick={() => moveToIndex(idx)}
            className={`relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-[12px] overflow-hidden transition-all duration-300 border-2 ${activeMedia?.type === 'image' && activeIdx === idx ? 'border-[var(--color-sage)] scale-105 shadow-[0_4px_15px_rgba(138,158,126,0.15)]' : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'}`}
          >
            <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="absolute inset-0 w-full h-full object-cover" />
          </button>
        ))}
        {hasVideo && (
          <button
            onClick={() => moveToIndex(imageList.length)}
            className={`relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-[12px] overflow-hidden transition-all duration-300 border-2 ${activeMedia?.type === 'video' ? 'border-[var(--color-sage)] scale-105 shadow-[0_4px_15px_rgba(138,158,126,0.15)]' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'}`}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-sage-dark)] text-white text-[0.7rem] tracking-[0.08em] uppercase">
              Video
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
