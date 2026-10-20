// src/components/public/CartDrawer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, MessageSquare, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/lib/stores/useCartStore';
import { generateWhatsAppOrderLink } from '@/lib/whatsapp/encoder';
import PrescriptionUploader from './PrescriptionUploader';

export default function CartDrawer() {
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const setIsOpen = useCartStore((state) => state.setIsOpen);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const hasRx = useCartStore((state) => state.hasPrescriptionItems());
  const prescriptionFile = useCartStore((state) => state.prescriptionFile);

  if (!isOpen) return null;

  const subtotal = getSubtotal();

  const handleWhatsAppCheckout = () => {
    const manifest = {
      customerName: 'Online Guest (Koppa)',
      customerPhone: 'Will provide on WhatsApp',
      deliveryAddress: 'Koppa Village / Jigani Local Area',
      items: items.map((i) => ({
        name: i.product.name,
        packSize: i.product.packSize,
        quantity: i.quantity,
        price: i.product.salePrice,
      })),
      subtotal,
      deliveryFee: 0,
      total: subtotal,
      prescriptionUrl: prescriptionFile ? 'Prescription attached in session' : undefined,
    };

    const link = generateWhatsAppOrderLink(manifest);
    window.open(link, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FBF9F5] shadow-2xl flex flex-col border-l border-[#E8E4DC]">
          {/* Header */}
          <div className="p-6 bg-white border-b border-[#E8E4DC] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#0D3B2E]" />
              <h3 className="font-serif text-lg font-bold text-[#0D3B2E]">
                Your Medicine Bag
              </h3>
              <span className="text-xs bg-[#F2EFE9] text-[#5E6D66] font-mono px-2 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-[#5E6D66] hover:text-[#0D3B2E] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-[#F2EFE9] rounded-full flex items-center justify-center mb-4 text-[#5E6D66]">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#18221E] mb-1">
                  Your bag is empty
                </h4>
                <p className="text-xs text-[#5E6D66] max-w-xs mb-6">
                  Browse our catalog of genuine medicines, daily essentials, and personal care.
                </p>
                <Link
                  href="/catalog"
                  onClick={() => setIsOpen(false)}
                  className="bg-[#0D3B2E] text-white text-xs px-5 py-2.5 rounded-full font-medium hover:bg-[#1F5A46] transition-colors"
                >
                  Explore Catalog
                </Link>
              </div>
            ) : (
              <>
                {/* Prescription Requirement Alert */}
                {hasRx && (
                  <div className="space-y-3">
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2 text-xs text-rose-900">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Prescription Required (Schedule H/H1):</span> Your bag contains prescription-only medicine. Please attach doctor&apos;s prescription below.
                      </div>
                    </div>
                    <PrescriptionUploader />
                  </div>
                )}

                <div className="space-y-3">
                  {items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl p-3 border border-[#E8E4DC] flex gap-3 items-center"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-16 bg-[#F2EFE9] rounded-lg overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-semibold text-[#18221E] truncate">
                            {product.name}
                          </h4>
                          {product.prescriptionRequired && (
                            <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded shrink-0">
                              Rx
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#5E6D66] font-mono truncate">
                          {product.packSize}
                        </p>
                        <div className="text-xs font-bold text-[#0D3B2E] mt-1">
                          ₹{(product.salePrice * quantity).toFixed(2)}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 bg-[#FBF9F5] border border-[#E8E4DC] rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 text-[#5E6D66] hover:text-[#0D3B2E] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold px-1.5">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1 text-[#5E6D66] hover:text-[#0D3B2E] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(product.id)}
                        className="p-1 text-[#5E6D66] hover:text-rose-600 transition-colors ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer Totals & Checkout Options */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#E8E4DC] space-y-4">
              <div className="space-y-1.5 text-xs text-[#5E6D66]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#18221E]">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Local Delivery (Koppa Village)</span>
                  <span className="text-emerald-700 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#0D3B2E] pt-2 border-t border-[#E8E4DC]">
                  <span>Total Amount</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {/* 1-Click WhatsApp Order Button */}
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-[#1F5A46] hover:bg-[#0D3B2E] text-white py-3 px-4 rounded-xl text-xs font-bold tracking-wide transition-all shadow-xs"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-300" />
                  <span>Order Instantly via WhatsApp</span>
                </button>

                {/* Standard Web Checkout Button */}
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 border border-[#0D3B2E] text-[#0D3B2E] hover:bg-[#0D3B2E] hover:text-white py-3 px-4 rounded-xl text-xs font-bold tracking-wide transition-all"
                >
                  <span>Proceed to Web Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <p className="text-[10px] text-center text-[#5E6D66]">
                Delivery available across Koppa, Hulimangala, Jigani &amp; Electronic City.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
