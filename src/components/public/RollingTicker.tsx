// src/components/public/RollingTicker.tsx
'use client';

import React, { useRef, useEffect, useState } from 'react';

const TICKER_ITEMS = [
  'Free Doorstep Delivery in Koppa, Hulimangala & Jigani',
  'Registered Pharmacist Medication Review & Counsel',
  'Order via WhatsApp: 076762 22727',
  'Open Daily Until 10:00 PM (7 Days a Week)',
  'Google Reviews Rated 4.8★',
  'Licensed Schedule H & H1 Dispensing (DL: KA-B2-019842 / KA-B21-019843)',
  'GST Compliant Invoicing: 29AAGCM1978E1Z4',
];

export default function RollingTicker() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let animId: number;
    const speed = 0.8; // Smooth, continuous scrolling speed

    const scroll = () => {
      if (el && !isPaused) {
        el.scrollLeft += speed;
        // When halfway through the duplicated contents, seamlessly loop
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(scroll);
    };

    animId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animId);
  }, [isPaused]);

  return (
    <div
      className="bg-[#0D3B2E] text-white py-2.5 overflow-hidden border-b border-[#1F5A46] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={containerRef}
        className="flex whitespace-nowrap overflow-x-hidden no-scrollbar w-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* First copy */}
        <div className="flex items-center shrink-0">
          {TICKER_ITEMS.map((item, idx) => (
            <span key={`t1-${idx}`} className="inline-flex items-center text-xs font-mono tracking-widest uppercase">
              <span className="mx-4 text-[#C6923B]">✦</span>
              <span>{item}</span>
            </span>
          ))}
        </div>

        {/* Second duplicated copy for seamless infinite loop */}
        <div className="flex items-center shrink-0" aria-hidden="true">
          {TICKER_ITEMS.map((item, idx) => (
            <span key={`t2-${idx}`} className="inline-flex items-center text-xs font-mono tracking-widest uppercase">
              <span className="mx-4 text-[#C6923B]">✦</span>
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
