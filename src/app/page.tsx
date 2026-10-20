// src/app/page.tsx
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import CartDrawer from '@/components/public/CartDrawer';
import ProductCard from '@/components/public/ProductCard';
import CounterEssentialsCarousel from '@/components/public/CounterEssentialsCarousel';
import CategoriesCarousel from '@/components/public/CategoriesCarousel';
import RollingTicker from '@/components/public/RollingTicker';
import { mockDb } from '@/lib/mock/db';
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  HeartHandshake,
  FileCheck,
  Truck,
  MessageSquare,
  Search,
  Star,
} from 'lucide-react';

export default async function HomePage() {
  const allProducts = await mockDb.getProducts();
  const featuredProducts = await mockDb.getFeaturedProducts();
  const categories = await mockDb.getCategories();

  const hygieneProducts = allProducts.filter(
    (p) => p.categoryId === 'cat-7' || p.categoryId === 'cat-4'
  );
  const babyProducts = allProducts.filter((p) => p.categoryId === 'cat-6');
  const counterProducts = allProducts.filter(
    (p) => p.categoryId === 'cat-2' || p.categoryId === 'cat-3'
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
      <Navbar />
      <CartDrawer />

      <main className="flex-1">
        {/* =========================================================================
            ROLLING MARQUEE TICKER (BELOW HEADER)
        ========================================================================= */}
        <RollingTicker />

        {/* =========================================================================
            HERO SECTION: THE KOPPA VILLAGE APOTHECARY
        ========================================================================= */}
        <section className="relative overflow-hidden pt-12 pb-20 border-b border-[#E8E4DC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Editorial Headline & Actions */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono tracking-widest uppercase bg-[#E8EFE9] text-[#0D3B2E] px-3 py-1 rounded-full font-bold">
                    FIG. 001 · BOTANICAL APOTHECARY
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-[#C6923B] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <Star className="w-3 h-3 fill-current" />
                    4.8 / 5 Rating across Google
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#0D3B2E] font-bold tracking-tight leading-[1.2]">
                  <span className="block">
                    Dispensing medicine, counsel &amp;{' '}
                    <span className="italic font-normal text-[#C6923B]">quiet reassurance</span>
                  </span>
                  <span className="block text-[#0D3B2E] mt-1">
                    in the heart of Koppa Village.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-[#5E6D66] max-w-2xl leading-relaxed font-sans">
                  A neighborhood apothecary established in Koppa, Jigani Hobli. From urgent strips of paracetamol to chronic cardiac therapies and baby wellness — verified by registered pharmacists and delivered to your doorstep.
                </p>

                {/* Quick Order Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/catalog"
                    className="inline-flex items-center gap-2 bg-[#0D3B2E] hover:bg-[#1F5A46] text-white px-6 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all shadow-md active:scale-98"
                  >
                    <span>Browse All Medicines</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href="https://wa.me/917676222727?text=Hello%20Maruthi%20Medical%2C%20I%20would%20like%20to%20order%20medicines%20or%20send%20a%20prescription."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#1F5A46] hover:bg-[#0D3B2E] text-white px-6 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all shadow-md"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-300" />
                    <span>Order via WhatsApp</span>
                  </a>
                </div>

                {/* Key Metrics / Highlights */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-[#E8E4DC]/80 text-[11px] sm:text-xs text-[#5E6D66]">
                  <div>
                    <div className="font-serif font-bold text-base sm:text-lg text-[#0D3B2E]">Until 10 PM</div>
                    <div className="truncate">Doors open daily</div>
                  </div>
                  <div>
                    <div className="font-serif font-bold text-base sm:text-lg text-[#0D3B2E]">Free Delivery</div>
                    <div className="truncate">Koppa &amp; Jigani</div>
                  </div>
                  <div>
                    <div className="font-serif font-bold text-base sm:text-lg text-[#0D3B2E]">100% Genuine</div>
                    <div className="truncate">Batch-verified</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Visual Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=900&auto=format&fit=crop&q=85"
                    alt="Maruthi Medical Apothecary Shelf"
                    className="w-full aspect-4/5 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07221A]/90 via-[#07221A]/30 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#C6923B] font-bold">
                      PLATE 01 · THE DISPENSARY COUNTER
                    </span>
                    <h3 className="font-serif text-2xl font-bold mt-1 text-white">
                      Shop no.7, Koppa Village
                    </h3>
                    <p className="text-xs text-white/80 mt-1">
                      #197/7 &amp; 8, Hulimangala Post, Jigani Hobli, Bengaluru 560105
                    </p>
                    <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-mono text-[#C6923B]">
                      <span>Registered Pharmacist on Duty</span>
                      <span>Open 7 Days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            QUICK CATEGORY PILLS
        ========================================================================= */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-mono uppercase text-[#C6923B] font-bold tracking-wider">
                EXPLORE DISCIPLINES
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#0D3B2E] mt-0.5">
                Popular Healthcare Categories
              </h2>
            </div>
            <Link
              href="/catalog"
              className="text-xs font-semibold text-[#0D3B2E] hover:text-[#C6923B] flex items-center gap-1 font-mono transition-colors"
            >
              View Full Catalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <CategoriesCarousel categories={categories} />
        </section>

        {/* =========================================================================
            FEATURED PRODUCTS SECTION
        ========================================================================= */}
        <section className="py-10 sm:py-14 bg-white border-y border-[#E8E4DC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#C6923B] font-bold tracking-wider">
                  FEATURED SELECTIONS
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2E] mt-1">
                  Pharmacist Featured Products
                </h2>
                <p className="text-xs text-[#5E6D66] mt-1 max-w-xl">
                  Curated clinical remedies, diagnostic instruments, and trusted wellness treatments verified by our Koppa dispensary team.
                </p>
              </div>

              <Link
                href="/catalog"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D3B2E] bg-[#FBF9F5] border border-[#E8E4DC] px-4 py-2 rounded-full hover:bg-[#0D3B2E] hover:text-white transition-all self-start sm:self-auto"
              >
                <span>View All ({allProducts.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <CounterEssentialsCarousel products={featuredProducts} />
          </div>
        </section>

        {/* =========================================================================
            DAILY COUNTER ESSENTIALS SECTION
        ========================================================================= */}
        <section className="py-10 sm:py-14 bg-[#FBF9F5] border-b border-[#E8E4DC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#C6923B] font-bold tracking-wider">
                  DAILY MEDICINE COUNTER
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2E] mt-1">
                  Daily Counter Essentials
                </h2>
                <p className="text-xs text-[#5E6D66] mt-1 max-w-xl">
                  Frequently dispensed fever relief, chronic care daily refills, and fast-acting pain relief gels ready for instant pickup or doorstep knock.
                </p>
              </div>

              <Link
                href="/catalog"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D3B2E] bg-white border border-[#E8E4DC] px-4 py-2 rounded-full hover:bg-[#0D3B2E] hover:text-white transition-all self-start sm:self-auto"
              >
                <span>Browse Full Inventory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <CounterEssentialsCarousel products={counterProducts} />
          </div>
        </section>

        {/* =========================================================================
            HYGIENE & SKIN CARE SECTION
        ========================================================================= */}
        <section className="py-10 sm:py-14 bg-white border-b border-[#E8E4DC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#C6923B] font-bold tracking-wider">
                  DERMATOLOGY &amp; PERSONAL HYGIENE
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2E] mt-1">
                  Hygiene, Antiseptics &amp; Skin Care
                </h2>
                <p className="text-xs text-[#5E6D66] mt-1 max-w-xl">
                  Dermatologist-formulated moisturizers, clinical hospital-grade antiseptics, medicated anti-fungal powders, and daily germ protection.
                </p>
              </div>

              <Link
                href="/catalog?cat=cat-7"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D3B2E] bg-[#FBF9F5] border border-[#E8E4DC] px-4 py-2 rounded-full hover:bg-[#0D3B2E] hover:text-white transition-all self-start sm:self-auto"
              >
                <span>View All Hygiene &amp; Skin Care</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <CounterEssentialsCarousel products={hygieneProducts} />
          </div>
        </section>

        {/* =========================================================================
            MOTHER & BABY CARE SECTION
        ========================================================================= */}
        <section className="py-10 sm:py-14 bg-[#FBF9F5] border-b border-[#E8E4DC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#C6923B] font-bold tracking-wider">
                  PEDIATRIC &amp; MATERNAL CARE
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2E] mt-1">
                  Mother &amp; Baby Essentials
                </h2>
                <p className="text-xs text-[#5E6D66] mt-1 max-w-xl">
                  pH 5.5 hypoallergenic infant washes, gentle herbal baby daily lotions, and pediatrician-approved child health formulations.
                </p>
              </div>

              <Link
                href="/catalog?cat=cat-6"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D3B2E] bg-white border border-[#E8E4DC] px-4 py-2 rounded-full hover:bg-[#0D3B2E] hover:text-white transition-all self-start sm:self-auto"
              >
                <span>View Baby Care</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <CounterEssentialsCarousel products={babyProducts} />
          </div>
        </section>

        {/* =========================================================================
            THE PRACTICE CHRONICLES LINK BANNER
        ========================================================================= */}
        <section className="py-12 bg-white border-b border-[#E8E4DC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#0D3B2E] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl">
              <div className="space-y-3 max-w-2xl z-10">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#C6923B] font-bold">
                  THE KOPPA APOTHECARY CHRONICLES
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                  Discover The Story Behind Maruthi Medical
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                  From traditional village counter counsel to licensed Schedule H dispensing and doorstep deliveries across Jigani — explore our history, clinical values, and statutory credentials.
                </p>
              </div>
              <div className="z-10 shrink-0">
                <Link
                  href="/chapters"
                  className="inline-flex items-center gap-2 bg-[#C6923B] hover:bg-[#DDA239] text-[#07221A] px-6 py-3.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-md active:scale-98"
                >
                  <span>Read The Practice Chapters</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            CHAPTER 03: THE COUNTER & CONTACT
        ========================================================================= */}
        <section id="counter" className="py-16 bg-[#F2EFE9] border-t border-[#E8E4DC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-[#E8E4DC] p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-mono uppercase text-[#C6923B] font-bold tracking-widest">
                  VISIT THE COUNTER
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0D3B2E]">
                  In the heart of Koppa Village.
                </h2>
                <div className="space-y-3 pt-2 text-sm text-[#5E6D66]">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-5 h-5 text-[#C6923B] shrink-0 mt-0.5" />
                    <span>
                      Shop no.7, #197/7 &amp; 8, Koppa Village, Hulimangala Post, Jigani Hobli, Taluk, Anekal, Bengaluru, Karnataka 560105
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Clock className="w-5 h-5 text-[#C6923B] shrink-0" />
                    <span className="font-semibold text-[#18221E]">
                      Open Every Day: 8:00 AM – 10:00 PM
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="w-5 h-5 text-[#C6923B] shrink-0" />
                    <span>
                      Direct Counter Phone: <strong className="text-[#0D3B2E] font-mono">076762 22727</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-3">
                <a
                  href="tel:+917676222727"
                  className="w-full text-center bg-[#0D3B2E] hover:bg-[#1F5A46] text-white py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all shadow-xs"
                >
                  Call Counter (076762 22727)
                </a>

                <a
                  href="https://wa.me/917676222727?text=Hello%20Maruthi%20Medical%2C%20what%20are%20your%20current%20open%20hours%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center border border-[#1F5A46] text-[#0D3B2E] hover:bg-[#1F5A46] hover:text-white py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all"
                >
                  Message on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
