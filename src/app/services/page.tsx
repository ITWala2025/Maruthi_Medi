// src/app/services/page.tsx
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import CartDrawer from '@/components/public/CartDrawer';
import RollingTicker from '@/components/public/RollingTicker';
import {
  Truck,
  FileCheck,
  HeartHandshake,
  ShieldCheck,
  Stethoscope,
  Activity,
  Baby,
  Clock,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

const SERVICES_LIST = [
  {
    id: '01',
    icon: Truck,
    title: 'Doorstep Medicine Delivery',
    subtitle: 'Fast, temperature-safeguarded delivery across South Bengaluru rural & industrial zones.',
    desc: 'We provide prompt doorstep delivery of prescription medicines, daily OTC formulations, first-aid, and surgical goods directly to your home or office. Free delivery across Koppa Village, Hulimangala, Jigani Industrial Area, Bommasandra, and Electronic City Phase 1 & 2.',
    badge: 'Same-Day Local Knock',
  },
  {
    id: '02',
    icon: FileCheck,
    title: 'Pharmacist Medication Review',
    subtitle: 'Thorough prescription audits conducted strictly by licensed registered pharmacists.',
    desc: 'Our pharmacist audits your doctor’s prescription to verify active drug composition, flag potential contraindications or dangerous drug-drug interactions, and clearly explain dosage timing (before or after meals, morning vs evening).',
    badge: 'State Council Licensed',
  },
  {
    id: '03',
    icon: HeartHandshake,
    title: 'Chronic Care Maintenance Refills',
    subtitle: 'Never miss a day of blood pressure, cardiac, or diabetic therapy.',
    desc: 'Enroll in our recurring monthly medicine refill program. We keep your recurring maintenance strips (Telma, Glycomet, Shelcal, etc.) pre-reserved in our climate-controlled cabinets and send a gentle WhatsApp refill reminder 3 days before your supply runs out.',
    badge: 'Zero Missed Refills',
  },
  {
    id: '04',
    icon: MessageSquare,
    title: '1-Tap WhatsApp Ordering & Consult',
    subtitle: 'No complex app installs or logins needed — chat with our counter staff directly.',
    desc: 'Snap a clear photo of your doctor’s prescription slip and send it directly to +91 76762 22727. Our pharmacist verifies availability, calculates total costs with applicable store discounts, and coordinates doorstep dispatch.',
    badge: 'Zero API Overhead',
  },
  {
    id: '05',
    icon: Activity,
    title: 'Medical Devices & Diagnostic Instruments',
    subtitle: 'Clinically validated healthcare monitoring instruments for home wellness.',
    desc: 'We stock genuine Omron automatic upper-arm digital BP monitors, Accu-Chek & Contour blood glucose monitors, test strips, infrared thermometers, respiratory nebulizers, and pulse oximeters complete with manufacturer warranties.',
    badge: 'Authentic Warranties',
  },
  {
    id: '06',
    icon: Baby,
    title: 'Mother & Pediatric Care Formulations',
    subtitle: 'Gentle, pH 5.5 dermatological and nutritional care for mother and baby.',
    desc: 'Carefully curated pediatric drops, pediatric oral rehydration solutions (ORS), hypoallergenic baby washes, rash creams, feeding accessories, and maternal supplements stored under optimal humidity and temperature standards.',
    badge: 'Pediatric Grade',
  },
];

const FAQS = [
  {
    q: 'Do I need a prescription to order medicines at Maruthi Medical?',
    a: 'Under the Drugs and Cosmetics Act (1940) and Rules (1945), all Schedule H and H1 medications (such as antibiotics, blood pressure drugs, anti-diabetics, and prescription painkillers) strictly require a valid digital or physical prescription issued by a Registered Medical Practitioner (RMP). Over-the-counter (OTC) items like lozenges, balms, antiseptics, and wellness devices do not require a prescription.',
  },
  {
    q: 'How fast is local delivery in Koppa Village and Jigani?',
    a: 'Orders confirmed before 7:00 PM are typically delivered within 45 to 90 minutes across Koppa Village, Hulimangala, and Jigani Hobli. Emergency strips can be expedited upon phone or WhatsApp request.',
  },
  {
    q: 'What are the accepted payment options?',
    a: 'We accept Cash on Delivery (COD), UPI on Delivery (our delivery rider carries a dynamic QR code supporting Google Pay, PhonePe, Paytm, and BHIM), and advance UPI payment.',
  },
  {
    q: 'Are your medicines stored properly?',
    a: 'Yes. All biologicals, antibiotics, eye drops, and insulin vials are stored in dedicated pharmaceutical refrigeration units maintained strictly between 2°C and 8°C with digital temperature monitoring.',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
      <Navbar />
      <RollingTicker />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-16">
        {/* Header Breadcrumb & Title */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono uppercase text-[#C6923B] font-bold tracking-wider">
            APOTHECARY DISCIPLINES &amp; CLINICAL SERVICES
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#0D3B2E] leading-tight">
            Comprehensive Pharmacy Care for Koppa Village
          </h1>
          <p className="text-sm sm:text-base text-[#5E6D66] leading-relaxed">
            From emergency midnight dispensing to ongoing chronic disease management, explore the clinical and delivery services practiced daily at Maruthi Medical.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_LIST.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E4DC] hover:border-[#0D3B2E]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8EFE9] text-[#0D3B2E] flex items-center justify-center font-bold">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#C6923B] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      {srv.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-[#5E6D66] block mb-1">
                      SERVICE {srv.id}
                    </span>
                    <h3 className="font-serif font-bold text-xl text-[#0D3B2E]">
                      {srv.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#18221E] mt-1">
                      {srv.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-[#5E6D66] leading-relaxed">
                    {srv.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8E4DC]">
                  <a
                    href="https://wa.me/917676222727?text=Hello%20Maruthi%20Medical%2C%20I%20would%20like%20to%20avail%20your%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D3B2E] hover:text-[#C6923B] transition-colors"
                  >
                    <span>Request this service on WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="bg-[#0D3B2E] text-white rounded-3xl p-8 sm:p-12 border border-[#1F5A46] shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs font-mono uppercase text-[#C6923B] font-bold tracking-widest">
              REGISTERED PHARMACIST ON CALL
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Have a doctor&apos;s prescription or dosage question?
            </h2>
            <p className="text-xs sm:text-sm text-white/75 max-w-xl leading-relaxed">
              Send a photo over WhatsApp or browse our online catalog of 100% genuine medicines and wellness products.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link
              href="/catalog"
              className="text-center bg-white text-[#0D3B2E] hover:bg-[#FBF9F5] py-3.5 px-6 rounded-full text-xs font-bold transition-colors shadow-sm"
            >
              Browse Medicine Catalog
            </Link>

            <a
              href="https://wa.me/917676222727?text=Hello%20Maruthi%20Medical%2C%20I%20have%20a%20doctor%20prescription."
              target="_blank"
              rel="noopener noreferrer"
              className="text-center bg-[#1F5A46] text-white hover:bg-[#287258] py-3.5 px-6 rounded-full text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-300" />
              <span>Send Prescription via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="bg-white rounded-3xl border border-[#E8E4DC] p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#C6923B]" />
            <h3 className="font-serif font-bold text-2xl text-[#0D3B2E]">
              Frequently Asked Dispensing Questions
            </h3>
          </div>

          <div className="divide-y divide-[#E8E4DC]">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="py-4 space-y-1.5">
                <h4 className="font-semibold text-sm text-[#18221E] flex items-center gap-2">
                  <span className="text-[#C6923B] font-mono text-xs">Q:</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-[#5E6D66] leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
