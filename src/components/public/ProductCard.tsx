// src/components/public/ProductCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Product } from '@/lib/mock/types';
import { useCartStore } from '@/lib/stores/useCartStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const discountPercent = Math.round(
    ((product.mrp - product.salePrice) / product.mrp) * 100
  );

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const text =
      `🌿 *ORDER INQUIRY — MARUTHI MEDICAL*\n` +
      `Product: *${product.name}*\n` +
      `Pack Size: ${product.packSize}\n` +
      `Price: ₹${product.salePrice.toFixed(2)} (MRP ₹${product.mrp.toFixed(2)})\n` +
      (product.prescriptionRequired ? `⚠️ _Requires Doctor Prescription_\n` : '') +
      `\nPlease check stock and confirm delivery to Koppa Village.`;

    const url = `https://wa.me/917676222727?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl border border-[#E8E4DC] overflow-hidden flex flex-col justify-between h-[310px] sm:h-[420px] hover:shadow-lg transition-all duration-300 hover:border-[#0D3B2E]/40">
      <div>
        {/* Image & Badge Header */}
        <div className="relative h-32 sm:h-44 w-full bg-[#F2EFE9] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {/* Rx or OTC Status Badge */}
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1">
            {product.prescriptionRequired ? (
              <span className="inline-flex items-center gap-1 bg-[#FEE2E2] text-[#7C2D12] text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border border-[#FCA5A5]/60 shadow-xs">
                <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span className="hidden sm:inline">Prescription</span> (Rx)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-[#D1FAE5] text-[#065F46] text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border border-[#6EE7B7]/60 shadow-xs">
                <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                OTC
              </span>
            )}

            {discountPercent > 0 && (
              <span className="bg-[#C6923B] text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md w-fit">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-2.5 sm:p-4 space-y-1 sm:space-y-1.5">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[#5E6D66] font-mono">
            <span className="truncate max-w-[80px] sm:max-w-[130px]">{product.brandManufacturer}</span>
            <span className="truncate max-w-[70px] sm:max-w-[110px] text-right">{product.packSize}</span>
          </div>

          <h3 className="font-semibold text-xs sm:text-base text-[#18221E] group-hover:text-[#0D3B2E] transition-colors line-clamp-1 h-4 sm:h-6">
            <Link href={`/catalog/${product.slug}`}>
              {product.name}
            </Link>
          </h3>

          {/* Description removed on mobile for compact card and right-to-left scroll */}
          <p className="hidden sm:block text-xs text-[#5E6D66] line-clamp-2 leading-relaxed h-8">
            {product.genericSalt}
          </p>
        </div>
      </div>

      {/* Footer Pricing & Actions */}
      <div className="p-2.5 sm:p-4 pt-0 sm:pt-0 space-y-2 sm:space-y-3">
        <div className="flex items-baseline gap-1.5 sm:gap-2 pt-1.5 sm:pt-2 border-t border-[#E8E4DC]/60">
          <span className="text-sm sm:text-lg font-bold text-[#0D3B2E] font-sans">
            ₹{product.salePrice.toFixed(2)}
          </span>
          {product.mrp > product.salePrice && (
            <span className="text-[10px] sm:text-xs text-[#5E6D66] line-through">
              ₹{product.mrp.toFixed(2)}
            </span>
          )}
          <span className="ml-auto text-[9px] sm:text-[11px] font-mono text-emerald-700 bg-emerald-50 px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded">
            In Stock
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          <button
            onClick={() => addItem(product)}
            className="flex items-center justify-center gap-1 sm:gap-1.5 bg-[#0D3B2E] hover:bg-[#1F5A46] text-white py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold tracking-wide transition-colors active:scale-98"
          >
            <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Add</span>
          </button>

          <button
            onClick={handleWhatsAppOrder}
            className="flex items-center justify-center gap-1 sm:gap-1.5 border border-[#1F5A46] text-[#0D3B2E] hover:bg-[#0D3B2E] hover:text-white py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold tracking-wide transition-colors"
          >
            <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 group-hover:text-white" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
