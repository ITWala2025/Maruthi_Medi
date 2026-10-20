// src/app/catalog/[slug]/page.tsx
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import CartDrawer from '@/components/public/CartDrawer';
import { mockDb } from '@/lib/mock/db';
import { Product } from '@/lib/mock/types';
import { useCartStore } from '@/lib/stores/useCartStore';
import {
  ShoppingBag,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowLeft,
} from 'lucide-react';

function ProductDetailInner() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function load() {
      if (slug) {
        const p = await mockDb.getProductBySlug(slug);
        setProduct(p);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex-1 max-w-7xl mx-auto px-4 py-16 w-full animate-pulse space-y-8">
        <div className="h-6 w-32 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="h-96 bg-gray-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-[#0D3B2E] mb-2">
          Medicine Not Found
        </h2>
        <p className="text-sm text-[#5E6D66] mb-6">
          The requested formulation may have been moved or renamed.
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 bg-[#0D3B2E] text-white px-5 py-2.5 rounded-full text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Catalog
        </Link>
      </div>
    );
  }

  const handleWhatsAppOrder = () => {
    const text =
      `🌿 *ORDER INQUIRY — MARUTHI MEDICAL*\n` +
      `Product: *${product.name}*\n` +
      `Quantity: ${qty}\n` +
      `Pack Size: ${product.packSize}\n` +
      `Estimated Price: ₹${(product.salePrice * qty).toFixed(2)}\n` +
      (product.prescriptionRequired ? `⚠️ _Doctor Prescription Required_\n` : '') +
      `\nPlease confirm availability and delivery time for Koppa Village.`;

    const url = `https://wa.me/917676222727?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5E6D66] hover:text-[#0D3B2E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>

      {/* Product Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-[#E8E4DC] shadow-xs">
        {/* Left: Product Image */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square bg-[#F2EFE9] rounded-2xl overflow-hidden border border-[#E8E4DC] relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-4 left-4">
              {product.prescriptionRequired ? (
                <span className="inline-flex items-center gap-1.5 bg-[#FEE2E2] text-[#7C2D12] text-xs font-bold px-3 py-1 rounded-full border border-rose-300 shadow-xs">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Prescription Required (Schedule H)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-[#D1FAE5] text-[#065F46] text-xs font-bold px-3 py-1 rounded-full border border-emerald-300 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Over The Counter (OTC)
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-[#5E6D66] font-mono">
            <div className="flex items-center gap-2 p-2.5 bg-[#FBF9F5] rounded-xl border border-[#E8E4DC]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Genuine Medicine</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-[#FBF9F5] rounded-xl border border-[#E8E4DC]">
              <Truck className="w-4 h-4 text-[#C6923B] shrink-0" />
              <span>Same-Day Koppa Delivery</span>
            </div>
          </div>
        </div>

        {/* Right: Technical Specs & Purchasing Actions */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-[#5E6D66] font-mono mb-1">
              <span>{product.brandManufacturer}</span>
              <span>HSN Code: {product.hsnCode}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2E]">
              {product.name}
            </h1>

            <div className="mt-2 p-3 bg-[#FBF9F5] rounded-xl border border-[#E8E4DC]">
              <span className="text-[11px] font-mono uppercase text-[#C6923B] font-bold block mb-0.5">
                ACTIVE GENERIC SALT / COMPOSITION
              </span>
              <p className="text-sm font-medium text-[#18221E]">
                {product.genericSalt}
              </p>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="p-4 bg-[#F2EFE9]/60 rounded-2xl border border-[#E8E4DC] flex items-baseline justify-between">
            <div>
              <span className="text-xs text-[#5E6D66] block">Counter Price (Incl. GST)</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-serif font-bold text-[#0D3B2E]">
                  ₹{product.salePrice.toFixed(2)}
                </span>
                {product.mrp > product.salePrice && (
                  <span className="text-sm text-[#5E6D66] line-through">
                    MRP ₹{product.mrp.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono text-emerald-800 bg-emerald-100 px-2 py-1 rounded-md font-bold">
                {product.packSize}
              </span>
              <div className="text-[10px] text-[#5E6D66] font-mono mt-1">
                GST Rate: {product.gstPercentage}%
              </div>
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-[#18221E]">Quantity:</span>
              <div className="flex items-center border border-[#E8E4DC] rounded-xl bg-[#FBF9F5] px-2 py-1">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-1 text-[#5E6D66] hover:text-[#0D3B2E] font-bold"
                >
                  -
                </button>
                <span className="px-3 text-sm font-mono font-bold">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="p-1 text-[#5E6D66] hover:text-[#0D3B2E] font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => addItem(product, qty)}
                className="flex items-center justify-center gap-2 bg-[#0D3B2E] hover:bg-[#1F5A46] text-white py-3.5 px-4 rounded-xl text-xs font-bold tracking-wide transition-all shadow-md active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Medicine Bag
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="flex items-center justify-center gap-2 bg-[#1F5A46] hover:bg-[#0D3B2E] text-white py-3.5 px-4 rounded-xl text-xs font-bold tracking-wide transition-all shadow-md"
              >
                <MessageSquare className="w-4 h-4 text-emerald-300" />
                Order on WhatsApp (1-Tap)
              </button>
            </div>
          </div>

          {/* Clinical & Pharmacological Info */}
          <div className="border-t border-[#E8E4DC] pt-6 space-y-4">
            <div>
              <h4 className="text-xs font-mono uppercase text-[#0D3B2E] font-bold tracking-wider mb-1">
                Description &amp; Medical Indication
              </h4>
              <p className="text-xs text-[#5E6D66] leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.sideEffects && (
              <div>
                <h4 className="text-xs font-mono uppercase text-amber-800 font-bold tracking-wider mb-1">
                  Known Side Effects &amp; Precautions
                </h4>
                <p className="text-xs text-[#5E6D66] leading-relaxed">
                  {product.sideEffects}
                </p>
              </div>
            )}

            {product.storageInstructions && (
              <div>
                <h4 className="text-xs font-mono uppercase text-[#0D3B2E] font-bold tracking-wider mb-1">
                  Storage Instructions
                </h4>
                <p className="text-xs text-[#5E6D66] leading-relaxed">
                  {product.storageInstructions}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ProductDetailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
      <Navbar />
      <CartDrawer />
      <Suspense fallback={<div className="p-12 text-center text-xs text-[#5E6D66]">Loading formulation...</div>}>
        <ProductDetailInner />
      </Suspense>
      <Footer />
    </div>
  );
}
