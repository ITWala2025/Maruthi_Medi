// src/app/chapters/page.tsx
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import CartDrawer from '@/components/public/CartDrawer';
import RollingTicker from '@/components/public/RollingTicker';
import {
  FileCheck,
  Truck,
  HeartHandshake,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Award,
  CheckCircle2,
} from 'lucide-react';

export const metadata = {
  title: 'The Practice & Heritage — Maruthi Medical Koppa Village',
  description:
    'The story, clinical ethics, registered pharmacist counsel, and community healthcare practice of Maruthi Medical in Koppa Village, Jigani Hobli, Bengaluru 560105.',
};

export default function ChaptersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
      <Navbar />
      <RollingTicker />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-16 sm:space-y-24">
        {/* Editorial Masthead */}
        <div className="max-w-4xl space-y-4">
          <span className="text-xs font-mono uppercase text-[#C6923B] font-bold tracking-widest">
            THE CHRONICLES · MARUTHI MEDICAL
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#0D3B2E] tracking-tight leading-[1.15]">
            Not just a chemist. <br className="hidden sm:inline" />
            <span className="italic font-light text-[#C6923B]">A familiar neighbor</span> in Koppa.
          </h1>
          <p className="text-base sm:text-lg text-[#5E6D66] leading-relaxed max-w-2xl font-sans pt-2">
            Established in Shop no.7, Koppa Village, Maruthi Medical was founded on a simple conviction: healthcare in rural and suburban Bengaluru should never compromise on clinical rigor, authentic provenance, or warm, unhurried personal counsel.
          </p>
        </div>

        {/* =========================================================================
            CHAPTER 01: THE HERITAGE & ORIGINS
        ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center border-t border-[#E8E4DC] pt-12">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#0D3B2E] text-white flex items-center justify-center font-mono font-bold text-sm">
                01
              </span>
              <span className="text-xs font-mono tracking-widest uppercase text-[#C6923B] font-bold">
                CHAPTER ONE · THE PRACTICE &amp; ETHICS
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0D3B2E] leading-snug">
              Quiet reassurance across generations of Koppa families.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#5E6D66] leading-relaxed">
              <p>
                Before tech parks and industrial estates reached Jigani and Hulimangala, our small counter began serving local farmers, village elders, and growing families. Over the years, the roads paved over and Bengaluru grew outward, but the core human need remained unchanged: when someone is unwell at 9:30 PM, they don’t want an algorithm — they want an experienced pharmacist who knows them by name.
              </p>
              <p>
                Every medicine on our shelves is audited for batch integrity, stored under strict manufacturer temperature limits, and dispensed only with comprehensive patient guidance on proper dosages and meal timings.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white rounded-2xl border border-[#E8E4DC]">
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#0D3B2E]">100%</div>
                <div className="text-xs text-[#5E6D66] mt-0.5">Authentic Company Stock</div>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-[#E8E4DC]">
                <div className="text-xl sm:text-2xl font-serif font-bold text-[#0D3B2E]">Daily</div>
                <div className="text-xs text-[#5E6D66] mt-0.5">Open until 10:00 PM</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=900&auto=format&fit=crop&q=85"
                alt="Maruthi Medical Apothecary Counter"
                className="w-full aspect-4/3 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07221A]/85 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#C6923B] font-bold">
                  PLATE 01 · THE APOTHECARY COUNTER
                </span>
                <div className="font-serif font-bold text-xl mt-1">Shop no.7, Koppa Village</div>
                <p className="text-xs text-white/80 mt-0.5">Where medicines are dispensed with dignity and care.</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            CHAPTER 02: THE FOUR PILLARS OF DISPENSING
        ========================================================================= */}
        <section className="border-t border-[#E8E4DC] pt-12 space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#0D3B2E] text-white flex items-center justify-center font-mono font-bold text-sm">
                02
              </span>
              <span className="text-xs font-mono tracking-widest uppercase text-[#C6923B] font-bold">
                CHAPTER TWO · CLINICAL STANDARDS
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0D3B2E]">
              Our Four Pillars of Community Pharmacy
            </h2>
            <p className="text-sm text-[#5E6D66]">
              How we protect every patient who walks up to the counter or orders from their home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E8E4DC] space-y-4 hover:border-[#0D3B2E] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#E8EFE9] text-[#0D3B2E] flex items-center justify-center font-bold">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#0D3B2E]">
                Pharmacist Prescription Review
              </h3>
              <p className="text-xs text-[#5E6D66] leading-relaxed">
                Every doctor’s slip is personally vetted by a registered pharmacist licensed by the Karnataka State Pharmacy Council to eliminate dosage discrepancies.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8E4DC] space-y-4 hover:border-[#0D3B2E] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#E8EFE9] text-[#0D3B2E] flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#0D3B2E]">
                Free Doorstep Knock
              </h3>
              <p className="text-xs text-[#5E6D66] leading-relaxed">
                Zero delivery charges across Koppa Village, Hulimangala, Jigani Industrial Area, and nearby communities in 30 to 60 minutes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8E4DC] space-y-4 hover:border-[#0D3B2E] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#E8EFE9] text-[#0D3B2E] flex items-center justify-center font-bold">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#0D3B2E]">
                Chronic Care Subscriptions
              </h3>
              <p className="text-xs text-[#5E6D66] leading-relaxed">
                Never miss a dose of Telma, Glycomet, or Shelcal. We pre-reserve maintenance strips and notify you via WhatsApp 3 days prior to depletion.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8E4DC] space-y-4 hover:border-[#0D3B2E] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#E8EFE9] text-[#0D3B2E] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#0D3B2E]">
                Statutory Compliance
              </h3>
              <p className="text-xs text-[#5E6D66] leading-relaxed">
                Full adherence to Drugs &amp; Cosmetics Rules 1945. Scheduled substances are stored under lock and audited registers with GST billing.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            CHAPTER 03: TWO WAYS TO ORDER
        ========================================================================= */}
        <section className="border-t border-[#E8E4DC] pt-12 space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#0D3B2E] text-white flex items-center justify-center font-mono font-bold text-sm">
                03
              </span>
              <span className="text-xs font-mono tracking-widest uppercase text-[#C6923B] font-bold">
                CHAPTER THREE · MODERN ORDERING
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0D3B2E]">
              Seamless Access: Digital Web or 1-Tap WhatsApp
            </h2>
            <p className="text-sm text-[#5E6D66]">
              We built an enterprise digital storefront alongside our instant zero-cost WhatsApp channel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl bg-white border border-[#E8E4DC] flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase bg-[#E8EFE9] text-[#0D3B2E] px-3 py-1 rounded-full font-bold">
                  WAY 01 · BROWSER STORE
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#0D3B2E]">
                  Full Catalog &amp; Digital Checkout
                </h3>
                <p className="text-sm text-[#5E6D66] leading-relaxed">
                  Browse our inventory of genuine pharmaceuticals, add medicines to your bag, attach your prescription, choose COD or UPI on delivery, and follow real-time order tracking.
                </p>
              </div>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 bg-[#0D3B2E] hover:bg-[#1F5A46] text-white px-6 py-3.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-md self-start"
              >
                <span>Browse All Medicines</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-8 rounded-3xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                  WAY 02 · ZERO APP OVERHEAD
                </span>
                <h3 className="text-2xl font-serif font-bold text-emerald-950">
                  Direct WhatsApp Prescription Photo
                </h3>
                <p className="text-sm text-emerald-800 leading-relaxed">
                  No app download, no account passwords. Simply take a smartphone photo of your doctor’s prescription slip and send it to our counter number (+91 76762 22727). We confirm stock and dispatch immediately.
                </p>
              </div>
              <a
                href="https://wa.me/917676222727?text=Hello%20Maruthi%20Medical%2C%20I%20am%20sending%20my%20prescription%20photo%20for%20delivery%20in%20Koppa."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1F5A46] hover:bg-[#0D3B2E] text-white px-6 py-3.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-md self-start"
              >
                <MessageSquare className="w-4 h-4 text-emerald-300" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================================
            CHAPTER 04: LICENSES & REGISTRATION
        ========================================================================= */}
        <section className="border-t border-[#E8E4DC] pt-12 pb-8">
          <div className="bg-[#F2EFE9] rounded-3xl p-6 sm:p-10 border border-[#E8E4DC] space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#C6923B] text-white flex items-center justify-center font-mono font-bold text-sm">
                04
              </span>
              <span className="text-xs font-mono tracking-widest uppercase text-[#0D3B2E] font-bold">
                CHAPTER FOUR · STATUTORY CREDENTIALS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#5E6D66]">
              <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] space-y-2">
                <span className="font-mono text-[#0D3B2E] font-bold uppercase text-[11px] block">
                  DRUG LICENSES
                </span>
                <div className="font-mono text-sm font-bold text-[#18221E]">
                  KA-B2-019842<br />
                  KA-B21-019843
                </div>
                <p className="text-[11px] text-[#5E6D66] pt-1">
                  Issued under Drugs &amp; Cosmetics Rules 1945 by Karnataka State Drugs Control Dept.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] space-y-2">
                <span className="font-mono text-[#0D3B2E] font-bold uppercase text-[11px] block">
                  GOODS &amp; SERVICES TAX
                </span>
                <div className="font-mono text-sm font-bold text-[#18221E]">
                  29AAGCM1978E1Z4
                </div>
                <p className="text-[11px] text-[#5E6D66] pt-1">
                  100% Tax-invoiced dispensing compliant with Indian commercial tax regulations.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] space-y-2">
                <span className="font-mono text-[#0D3B2E] font-bold uppercase text-[11px] block">
                  PHYSICAL APOTHECARY
                </span>
                <div className="text-xs font-bold text-[#18221E]">
                  Shop no.7, #197/7 &amp; 8, Koppa Village
                </div>
                <p className="text-[11px] text-[#5E6D66] pt-1">
                  Hulimangala Post, Jigani Hobli, Taluk Anekal, Bengaluru 560105.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E8E4DC]">
              <div className="text-xs text-[#5E6D66]">
                Have questions about our practice or medicine stock? Speak with the pharmacist on duty.
              </div>
              <Link
                href="/visit"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D3B2E] hover:underline"
              >
                <span>Visit Store &amp; Hours</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
