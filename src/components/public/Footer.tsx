// src/components/public/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Clock, ShieldCheck, FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#07221A] text-[#FBF9F5] pt-16 pb-12 border-t border-[#1F5A46]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Apothecary Story */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-white tracking-tight">
              MARUTHI <span className="font-light italic text-[#C6923B]">Medical.</span>
            </h3>
            <p className="text-sm text-white/70 leading-relaxed font-sans">
              The Koppa Village Apothecary — serving the families, homes, and enterprises of Koppa, Hulimangala, Jigani Hobli, and Anekal Taluk with authentic medicines and thoughtful pharmaceutical counsel.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#C6923B]">
              <ShieldCheck className="w-4 h-4" />
              <span>Drug License: KA-B2-019842 / KA-B21-019843</span>
            </div>
            <div className="text-xs font-mono text-white/50">
              GSTIN: 29AAGCM1978E1Z4
            </div>
          </div>

          {/* Physical Address & Coordinates */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#C6923B] font-mono font-semibold">
              The Counter Address
            </h4>
            <div className="flex items-start gap-2.5 text-sm text-white/80">
              <MapPin className="w-5 h-5 text-[#C6923B] shrink-0 mt-0.5" />
              <address className="not-italic leading-relaxed">
                Shop no.7, #197/7 &amp; 8<br />
                Koppa Village, Hulimangala Post<br />
                Jigani Hobli, Taluk, Anekal<br />
                Bengaluru, Karnataka 560105, India
              </address>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/70 pt-2 font-mono">
              <Clock className="w-4 h-4 text-[#C6923B]" />
              <span>Doors open daily until 10:00 PM</span>
            </div>
          </div>

          {/* Direct Channels */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#C6923B] font-mono font-semibold">
              Reach the Pharmacist
            </h4>
            <div className="space-y-2">
              <a
                href="tel:+917676222727"
                className="flex items-center gap-2 text-sm text-white/90 hover:text-[#C6923B] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#C6923B]" />
                <span className="font-mono">076762 22727</span>
              </a>
              <a
                href="https://wa.me/917676222727?text=Hello%20Maruthi%20Medical%2C%20I%20would%20like%20to%20order%20medicines."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs text-white/70 hover:text-white underline"
              >
                Chat on WhatsApp (+91 76762 22727)
              </a>
            </div>
            <div className="pt-3">
              <span className="inline-block bg-[#1F5A46] text-white text-[11px] px-3 py-1 rounded-full font-mono">
                Serving: Koppa · Jigani · Hulimangala · E-City Phase 1/2
              </span>
            </div>
          </div>

          {/* Quick Links & Pharmacy Portal */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#C6923B] font-mono font-semibold">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-white/75">
              <li>
                <Link href="/catalog" className="hover:text-white transition-colors">
                  Medicine Catalog &amp; Search
                </Link>
              </li>
              <li>
                <Link href="/chapters" className="hover:text-white transition-colors">
                  The Practice (About Maruthi)
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Medication Review &amp; Delivery
                </Link>
              </li>
              <li>
                <Link href="/visit" className="hover:text-white transition-colors">
                  Visit Counter &amp; Driving Directions
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-[#C6923B] hover:underline flex items-center gap-1 font-mono text-xs">
                  <FileText className="w-3.5 h-3.5" /> Pharmacist &amp; Admin ERP
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclaimer & Statutory Notice */}
        <div className="pt-8 text-xs text-white/50 space-y-2 leading-relaxed">
          <p>
            <strong className="text-white/70">Statutory Notice under the Drugs and Cosmetics Act, 1940:</strong> All Schedule H, H1, and X medications require a valid physical or digital prescription issued by a Registered Medical Practitioner (RMP). Dispensing is conducted strictly under the personal supervision of a Registered Pharmacist licensed by the Karnataka State Pharmacy Council.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-white/5 text-white/40 font-mono text-[11px]">
            <div>© 2026 Maruthi Medical. All rights reserved.</div>
            <div>Bengaluru, Karnataka 560105</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
