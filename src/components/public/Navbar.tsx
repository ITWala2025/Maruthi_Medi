// src/components/public/Navbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Phone, ShieldCheck, Clock, Menu, X, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/stores/useCartStore';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const totalItems = useCartStore((state) => state.getTotalItems());
  const setIsOpen = useCartStore((state) => state.setIsOpen);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalog?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5] border-b border-[#E8E4DC] backdrop-blur-md bg-opacity-95">
      {/* Top Banner Ticker */}
      <div className="bg-[#0D3B2E] text-[#FBF9F5] text-xs py-1.5 sm:py-2 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="flex items-center gap-1 font-medium tracking-wide text-[11px] sm:text-xs">
              <Clock className="w-3.5 h-3.5 text-[#C6923B]" />
              Open Daily Until 10 PM
            </span>
            <span className="hidden md:inline text-white/40">•</span>
            <span className="hidden md:flex items-center gap-1 text-white/90">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Govt. Licensed Pharmacy (DL: KA-B2-019842)
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 ml-auto text-[11px] sm:text-xs">
            <a
              href="tel:+917676222727"
              className="flex items-center gap-1 text-white/90 hover:text-[#C6923B] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#C6923B]" />
              <span className="font-mono font-medium">076762 22727</span>
            </a>
            <span className="text-white/40">•</span>
            <Link
              href="/admin"
              className="text-[11px] sm:text-xs bg-[#1F5A46] hover:bg-[#287258] text-[#FBF9F5] px-2 py-0.5 rounded-full transition-colors font-medium flex items-center gap-0.5"
            >
              Staff <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Brand Identity */}
          <Link href="/" className="flex flex-col group shrink min-w-0">
            <span className="text-xl sm:text-2xl lg:text-3xl font-serif tracking-tight text-[#0D3B2E] font-bold group-hover:text-[#1F5A46] transition-colors truncate">
              MARUTHI <span className="font-light italic text-[#C6923B]">Medical.</span>
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest text-[#5E6D66] uppercase font-mono truncate max-w-[210px] sm:max-w-none">
              Koppa Village Apothecary · Bengaluru
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-6 relative"
          >
            <input
              type="text"
              placeholder="Search by brand (Dolo, Telma) or generic salt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#E8E4DC] rounded-full pl-10 pr-4 py-2 text-sm text-[#18221E] placeholder-[#5E6D66]/70 focus:outline-none focus:ring-2 focus:ring-[#0D3B2E] focus:border-transparent transition-all shadow-xs"
            />
            <Search className="w-4 h-4 text-[#5E6D66] absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bg-[#0D3B2E] text-white text-xs px-3 py-1 rounded-full hover:bg-[#1F5A46]"
              >
                Go
              </button>
            )}
          </form>

          {/* Desktop Links & Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/catalog"
              className="text-sm font-medium text-[#18221E] hover:text-[#0D3B2E] transition-colors"
            >
              All Medicines
            </Link>
            <Link
              href="/chapters"
              className="text-sm font-medium text-[#18221E] hover:text-[#0D3B2E] transition-colors"
            >
              The Practice
            </Link>
            <Link
              href="/services"
              className="text-sm font-medium text-[#18221E] hover:text-[#0D3B2E] transition-colors"
            >
              Services
            </Link>
            <Link
              href="/visit"
              className="text-sm font-medium text-[#18221E] hover:text-[#0D3B2E] transition-colors"
            >
              Visit Shop
            </Link>
          </div>

          {/* Cart & Quick Trigger */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/917676222727?text=Hello%20Maruthi%20Medical%2C%20I%20would%20like%20to%20inquire%20about%20medicines."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 border border-[#0D3B2E] text-[#0D3B2E] hover:bg-[#0D3B2E] hover:text-white px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all"
            >
              <span>Quick WhatsApp</span>
            </a>

            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center justify-center p-2.5 bg-[#0D3B2E] text-white rounded-full hover:bg-[#1F5A46] transition-transform active:scale-95 shadow-sm"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#C6923B] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#0D3B2E] hover:text-[#1F5A46]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search medicines, salts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#E8E4DC] rounded-full pl-9 pr-3 py-1.5 text-xs text-[#18221E] focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
            />
            <Search className="w-3.5 h-3.5 text-[#5E6D66] absolute left-3 top-2.5" />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FBF9F5] border-t border-[#E8E4DC] px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#18221E] border-b border-[#E8E4DC]/60"
          >
            All Medicines & Health Products
          </Link>
          <Link
            href="/chapters"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#18221E] border-b border-[#E8E4DC]/60"
          >
            The Practice &amp; Heritage
          </Link>
          <Link
            href="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#18221E] border-b border-[#E8E4DC]/60"
          >
            Apothecary Services
          </Link>
          <Link
            href="/visit"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#18221E] border-b border-[#E8E4DC]/60"
          >
            Visit Shop & Hours
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            <a
              href="https://wa.me/917676222727?text=Hello%20Maruthi%20Medical%2C%20I%20would%20like%20to%20order%20medicines."
              className="w-full py-2.5 text-center bg-[#0D3B2E] text-white rounded-lg text-sm font-medium"
            >
              Order via WhatsApp
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2 text-center bg-[#F2EFE9] text-[#0D3B2E] rounded-lg text-xs font-semibold"
            >
              Pharmacist & Admin Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
