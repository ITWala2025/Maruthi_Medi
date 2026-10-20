// src/app/visit/page.tsx
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import CartDrawer from '@/components/public/CartDrawer';
import RollingTicker from '@/components/public/RollingTicker';
import {
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Star,
  Navigation,
  Car,
  Compass,
  MessageSquare,
  ArrowRight,
  Building,
} from 'lucide-react';

export default function VisitShopPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
      <Navbar />
      <RollingTicker />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {/* Header Breadcrumb & Title */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-[#C6923B] font-bold tracking-wider">
              EST. KOPPA VILLAGE · BENGALURU
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-[#C6923B] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              <Star className="w-3 h-3 fill-current" />
              4.8 ★ Google Rating
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#0D3B2E] leading-tight">
            Visit the Dispensary Counter
          </h1>

          <p className="text-sm sm:text-base text-[#5E6D66] leading-relaxed">
            Welcome to Maruthi Medical. Whether you need an emergency strip of fever medicine late in the evening, a consultation on prescribed regimens, or monthly maintenance refills — our licensed counter is ready to welcome you.
          </p>
        </div>

        {/* Visual Showcase & Primary Counter Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Counter Detail Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E4DC] shadow-xs space-y-6">
              {/* Address Section */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#E8EFE9] text-[#0D3B2E] rounded-2xl shrink-0 mt-1">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-lg text-[#0D3B2E]">
                    Physical Location
                  </h3>
                  <address className="not-italic text-sm text-[#18221E] leading-relaxed font-sans">
                    <strong>Shop no.7, #197/7 &amp; 8</strong><br />
                    Koppa Village, Hulimangala Post<br />
                    Jigani Hobli, Taluk, Anekal<br />
                    Bengaluru, Karnataka 560105, India
                  </address>
                  <p className="text-xs text-[#5E6D66] pt-1">
                    Landmarks: Near Koppa Govt Primary School · Opposite Village Post Office
                  </p>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-4 pt-4 border-t border-[#E8E4DC]">
                <div className="p-3 bg-amber-50 text-[#C6923B] rounded-2xl shrink-0 mt-1">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-serif font-bold text-lg text-[#0D3B2E]">
                    Operating Hours
                  </h3>
                  <div className="flex justify-between items-center text-sm py-1 border-b border-[#E8E4DC]/40">
                    <span className="font-medium text-[#18221E]">Monday – Sunday (All 7 Days)</span>
                    <span className="font-mono font-bold text-[#0D3B2E]">8:00 AM – 10:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1">
                    <span className="font-medium text-[#18221E]">Public Holidays &amp; Festivals</span>
                    <span className="font-mono text-emerald-800 font-semibold">Open Regular Hours</span>
                  </div>
                  <p className="text-xs text-emerald-700 font-mono pt-1">
                    ✓ A Registered Pharmacist is on duty at the counter throughout operating hours.
                  </p>
                </div>
              </div>

              {/* Direct Communications */}
              <div className="flex items-start gap-4 pt-4 border-t border-[#E8E4DC]">
                <div className="p-3 bg-[#E8EFE9] text-[#0D3B2E] rounded-2xl shrink-0 mt-1">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-lg text-[#0D3B2E]">
                    Direct Telephone &amp; WhatsApp
                  </h3>
                  <div className="text-sm font-mono font-bold text-[#0D3B2E]">
                    +91 76762 22727 · 076762 22727
                  </div>
                  <p className="text-xs text-[#5E6D66]">
                    Call for instant medicine stock inquiries or direction assistance.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#E8E4DC]">
                <a
                  href="tel:+917676222727"
                  className="flex items-center justify-center gap-2 bg-[#0D3B2E] hover:bg-[#1F5A46] text-white py-3.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <Phone className="w-4 h-4 text-[#C6923B]" />
                  <span>Call Counter (076762 22727)</span>
                </a>

                <a
                  href="https://wa.me/917676222727?text=Hello%20Maruthi%20Medical%2C%20I%20am%20visiting%20your%20shop%20in%20Koppa%20Village."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#1F5A46] hover:bg-[#0D3B2E] text-white py-3.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-300" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Statutory Registration Badges */}
            <div className="bg-[#F2EFE9] p-5 rounded-2xl border border-[#E8E4DC] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#5E6D66]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span>Drug License: <strong>KA-B2-019842 &amp; KA-B21-019843</strong></span>
              </div>
              <div>
                GSTIN: <strong>29AAGCM1978E1Z4</strong>
              </div>
            </div>
          </div>

          {/* Right: Photography & Neighborhood Navigation Guide */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl overflow-hidden border border-[#E8E4DC] shadow-sm">
              <div className="w-full h-[320px] sm:h-[380px] relative bg-[#F2EFE9]">
                <iframe
                  title="Maruthi Medical Google Maps Location"
                  src="https://maps.google.com/maps?q=Shop+no.7,+%23197/7+%26+8+Koppa+Village+Hulimangala+Post+Jigani+Hobli+Anekal+Bengaluru+560105&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              {/* Driving & Commute Directions */}
              <div className="p-6 space-y-4">
                <h4 className="font-serif font-bold text-[#0D3B2E] text-base flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#C6923B]" />
                  <span>How to Reach the Counter</span>
                </h4>

                <div className="space-y-3 text-xs text-[#5E6D66]">
                  <div className="flex items-start gap-2.5">
                    <Car className="w-4 h-4 text-[#0D3B2E] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#18221E]">From Electronic City Phase 1 &amp; 2:</strong>
                      <p className="mt-0.5">
                        Drive via Hulimangala Main Road toward Koppa Gate (approx 12-15 minutes). Shop is located on the main road at Shop no.7.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Navigation className="w-4 h-4 text-[#0D3B2E] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#18221E]">From Jigani Industrial Area:</strong>
                      <p className="mt-0.5">
                        Take the Jigani–Koppa connector road (approx 8 minutes). Ample two-wheeler and car parking right outside the store entrance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Building className="w-4 h-4 text-[#0D3B2E] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#18221E]">From Anekal Town:</strong>
                      <p className="mt-0.5">
                        Connect via Bannerghatta–Jigani road towards Koppa Village center.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8E4DC]">
                  <a
                    href="https://maps.google.com/?q=Koppa+Village+Hulimangala+Post+Bengaluru+560105"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 border border-[#0D3B2E] text-[#0D3B2E] hover:bg-[#0D3B2E] hover:text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-colors"
                  >
                    <span>Open in Google Maps</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
