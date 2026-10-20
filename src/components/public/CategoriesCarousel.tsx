// src/components/public/CategoriesCarousel.tsx
'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Category } from '@/lib/mock/types';
import {
  Sparkles,
  HeartPulse,
  Thermometer,
  Baby,
  Stethoscope,
  ShieldCheck,
  Pill,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from 'lucide-react';

interface CategoriesCarouselProps {
  categories: Category[];
}

function getCategoryIcon(id: string) {
  switch (id) {
    case 'cat-1':
      return Pill;
    case 'cat-2':
      return Thermometer;
    case 'cat-3':
      return HeartPulse;
    case 'cat-4':
      return ShieldCheck;
    case 'cat-5':
      return Stethoscope;
    case 'cat-6':
      return Baby;
    case 'cat-7':
    default:
      return Sparkles;
  }
}

export default function CategoriesCarousel({ categories }: CategoriesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const userInteractionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Duplicate items 3 times for a seamless, seamless infinite right-to-left loop
  const displayCategories = [...categories, ...categories, ...categories];

  // Auto-scroll loop moving content from right to left
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrameId: number;
    const speed = 0.7; // Smooth, readable scroll speed (px per frame)

    const step = () => {
      if (el && !isPaused && !isUserInteracting) {
        el.scrollLeft += speed;

        // When scrolled one full set of categories, reset smoothly
        const oneSetWidth = el.scrollWidth / 3;
        if (el.scrollLeft >= oneSetWidth) {
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
      scrollRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      handleUserInteraction();
      scrollRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/cat-carousel">
      {/* Controls & Status Bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs text-[#5E6D66] font-mono">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E8EFE9] text-[#0D3B2E] font-semibold text-[10px] sm:text-[11px]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPaused || isUserInteracting ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'
              }`}
            />
            {isPaused || isUserInteracting ? 'Paused on touch' : 'Auto-scrolling live'}
          </span>
          <span className="hidden sm:inline">• 1-Row Right-to-Left Scroll</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 rounded-full bg-white border border-[#E8E4DC] text-[#5E6D66] hover:text-[#0D3B2E] hover:border-[#0D3B2E] transition-all shadow-xs"
            title={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
            aria-label={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
          >
            {isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3" />}
          </button>

          <button
            onClick={handleScrollLeft}
            className="p-1.5 rounded-full bg-white border border-[#E8E4DC] text-[#0D3B2E] hover:bg-[#0D3B2E] hover:text-white transition-all shadow-xs"
            aria-label="Scroll Categories Left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleScrollRight}
            className="p-1.5 rounded-full bg-white border border-[#E8E4DC] text-[#0D3B2E] hover:bg-[#0D3B2E] hover:text-white transition-all shadow-xs"
            aria-label="Scroll Categories Right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Single Continuous Row Scrolling Container */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleUserInteraction}
        onTouchEnd={() => setTimeout(() => setIsUserInteracting(false), 2000)}
        onWheel={handleUserInteraction}
        className="flex flex-nowrap gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth cursor-grab active:cursor-grabbing select-none"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#C6923B #F2EFE9',
        }}
      >
        {displayCategories.map((cat, index) => {
          const Icon = getCategoryIcon(cat.id);
          return (
            <Link
              key={`${cat.id}-${index}`}
              href={`/catalog?cat=${cat.id}`}
              className="w-[160px] sm:w-[200px] shrink-0 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E8E4DC] hover:border-[#0D3B2E] hover:shadow-md transition-all group flex flex-col justify-between h-[120px] sm:h-[135px]"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#E8EFE9] text-[#0D3B2E] group-hover:bg-[#0D3B2E] group-hover:text-white flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono font-bold text-[#C6923B] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  View →
                </span>
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#18221E] group-hover:text-[#0D3B2E] transition-colors line-clamp-1">
                  {cat.name}
                </h4>
                <p className="text-[10px] text-[#5E6D66] mt-0.5 line-clamp-1">
                  {cat.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
