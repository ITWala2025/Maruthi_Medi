// src/components/public/CounterEssentialsCarousel.tsx
'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/lib/mock/types';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface CounterEssentialsCarouselProps {
  products: Product[];
}

export default function CounterEssentialsCarousel({
  products,
}: CounterEssentialsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const userInteractionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Duplicate items to create an infinite loop experience
  const displayProducts = [...products, ...products];

  // Auto-scroll loop moving content from right to left
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrameId: number;
    const speed = 0.75; // Smooth, readable scroll speed (px per frame)

    const step = () => {
      if (el && !isPaused && !isUserInteracting) {
        el.scrollLeft += speed;

        // When halfway through the duplicated list, seamlessly reset back to start
        const maxScroll = el.scrollWidth / 2;
        if (el.scrollLeft >= maxScroll) {
          el.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused, isUserInteracting]);

  // Handle manual interaction pause
  const handleUserInteraction = useCallback(() => {
    setIsUserInteracting(true);
    if (userInteractionTimeoutRef.current) {
      clearTimeout(userInteractionTimeoutRef.current);
    }
    // Resume auto-scroll after 3 seconds of user inactivity
    userInteractionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 3000);
  }, []);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      handleUserInteraction();
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      handleUserInteraction();
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/carousel">
      {/* Manual Scroll Navigation Buttons & Pause Indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs text-[#5E6D66] font-mono">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8EFE9] text-[#0D3B2E] font-semibold text-[11px]">
            <span className={`w-2 h-2 rounded-full ${isPaused || isUserInteracting ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
            {isPaused || isUserInteracting ? 'Paused on interaction' : 'Auto-scrolling live'}
          </span>
          <span className="hidden sm:inline">• Hover or drag to inspect</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Pause / Play Toggle Button */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-full bg-white border border-[#E8E4DC] text-[#5E6D66] hover:text-[#0D3B2E] hover:border-[#0D3B2E] transition-all shadow-xs"
            title={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
            aria-label={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Left Arrow */}
          <button
            onClick={handleScrollLeft}
            className="p-2 rounded-full bg-white border border-[#E8E4DC] text-[#0D3B2E] hover:bg-[#0D3B2E] hover:text-white transition-all shadow-xs"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleScrollRight}
            className="p-2 rounded-full bg-white border border-[#E8E4DC] text-[#0D3B2E] hover:bg-[#0D3B2E] hover:text-white transition-all shadow-xs"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Single-Row Scrolling Container */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleUserInteraction}
        onTouchEnd={() => setTimeout(() => setIsUserInteracting(false), 2000)}
        onWheel={handleUserInteraction}
        className="flex gap-3 sm:gap-6 overflow-x-auto pb-6 sm:pb-8 pt-1 sm:pt-2 px-1 scroll-smooth cursor-grab active:cursor-grabbing select-none"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#C6923B #F2EFE9',
        }}
      >
        {displayProducts.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="w-[170px] sm:w-[280px] shrink-0 h-[310px] sm:h-[420px]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
