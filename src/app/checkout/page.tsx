// src/app/checkout/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import PrescriptionUploader from '@/components/public/PrescriptionUploader';
import { useCartStore } from '@/lib/stores/useCartStore';
import { mockDb } from '@/lib/mock/db';
import { generateWhatsAppOrderLink } from '@/lib/whatsapp/encoder';
import {
  ShieldCheck,
  Truck,
  MapPin,
  Phone,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  QrCode,
  Banknote,
  FileText,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const hasRx = useCartStore((state) => state.hasPrescriptionItems());
  const prescriptionFile = useCartStore((state) => state.prescriptionFile);

  // Form states
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('560105'); // Default Koppa Village Pincode
  const [customerNotes, setCustomerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi_on_delivery' | 'upi_prepaid'>('upi_on_delivery');
  const [rxOption, setRxOption] = useState<'upload' | 'later'>('upload');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ name?: boolean; phone?: boolean; address?: boolean }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const subtotal = getSubtotal();

  const handlePlaceOrder = async (orderVia: 'web' | 'whatsapp') => {
    setErrorMsg('');
    const errors: { name?: boolean; phone?: boolean; address?: boolean } = {};

    if (!customerName.trim()) errors.name = true;
    if (!customerPhone.trim() || customerPhone.trim().length < 10) errors.phone = true;
    if (deliveryType === 'delivery' && !addressLine1.trim()) errors.address = true;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMsg('Please complete all required fields highlighted below.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (hasRx && rxOption === 'upload' && !prescriptionFile && orderVia === 'web') {
      setErrorMsg('Please attach your prescription photo or select "Send via WhatsApp / show on delivery".');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      const finalPrescriptionNote = prescriptionFile
        ? 'Prescription uploaded with order'
        : rxOption === 'later'
        ? 'Customer will share prescription via WhatsApp or show on delivery'
        : undefined;

      const order = await mockDb.createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryType,
        deliveryAddress: deliveryType === 'delivery' ? {
          recipientName: customerName.trim(),
          phone: customerPhone.trim(),
          addressLine1: addressLine1.trim(),
          addressLine2: addressLine2.trim(),
          landmark: landmark.trim(),
          pincode: pincode.trim(),
          city: 'Bengaluru',
          state: 'Karnataka',
        } : undefined,
        paymentMethod: paymentMethod === 'upi_prepaid' ? 'upi_on_delivery' : paymentMethod,
        placedVia: orderVia,
        customerNotes: customerNotes.trim(),
        prescriptionUrl: finalPrescriptionNote,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      });

      if (orderVia === 'whatsapp') {
        const manifest = {
          orderNumber: order.orderNumber,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          deliveryAddress: deliveryType === 'delivery'
            ? `${addressLine1}, ${addressLine2 ? addressLine2 + ', ' : ''}${landmark ? 'Near ' + landmark + ', ' : ''}PIN: ${pincode}`
            : 'Counter Pickup at Koppa Village Shop (Shop no. 7)',
          items: items.map((i) => ({
            name: i.product.name,
            packSize: i.product.packSize,
            quantity: i.quantity,
            price: i.product.salePrice,
          })),
          subtotal,
          deliveryFee: 0,
          total: subtotal,
          prescriptionUrl: prescriptionFile ? 'Attached with order' : (hasRx ? 'Will share photo on WhatsApp' : undefined),
          customerNotes: customerNotes.trim() || undefined,
        };

        const link = generateWhatsAppOrderLink(manifest);
        clearCart();
        // Direct navigation works smoothly on Android/iOS without popup blocker
        window.location.href = link;
      } else {
        clearCart();
        router.push(`/track/${order.orderNumber}`);
      }
    } catch (err) {
      console.error('Failed to create order:', err);
      setErrorMsg('Unable to place order. Please try again or tap "Send Order directly via WhatsApp".');
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Wait for client-side zustand rehydration to avoid false "bag is empty" flash
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-3 border-[#0D3B2E] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs text-[#5E6D66] font-mono">Loading your medicine bag...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-serif font-bold text-[#0D3B2E] mb-2">
            Your Medicine Bag is Empty
          </h2>
          <p className="text-xs text-[#5E6D66] mb-6">
            Please add items from the catalog before proceeding to checkout.
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 bg-[#0D3B2E] text-white px-5 py-2.5 rounded-full text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Go to Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full">
        <div className="mb-6 sm:mb-8">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5E6D66] hover:text-[#0D3B2E] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2E]">
            Checkout &amp; Dispensing Details
          </h1>
          <p className="text-xs text-[#5E6D66] mt-0.5">
            Doorstep delivery across Koppa Village, Hulimangala, Jigani Hobli &amp; Anekal.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center gap-3 text-xs shadow-xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Form: Details, Address & Prescription */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Option Toggle */}
            <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs">
              <span className="text-[11px] font-mono uppercase text-[#C6923B] font-bold block mb-3">
                01 · DISPENSING METHOD
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                    deliveryType === 'delivery'
                      ? 'border-[#0D3B2E] bg-[#E8EFE9] text-[#0D3B2E] ring-1 ring-[#0D3B2E]'
                      : 'border-[#E8E4DC] text-[#5E6D66] hover:border-gray-400'
                  }`}
                >
                  <Truck className="w-5 h-5" />
                  <span>Doorstep Delivery (Koppa/Jigani)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                    deliveryType === 'pickup'
                      ? 'border-[#0D3B2E] bg-[#E8EFE9] text-[#0D3B2E] ring-1 ring-[#0D3B2E]'
                      : 'border-[#E8E4DC] text-[#5E6D66] hover:border-gray-400'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  <span>Pickup at Koppa Counter (Shop 7)</span>
                </button>
              </div>
            </div>

            {/* Customer Details & Address */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-4">
              <span className="text-[11px] font-mono uppercase text-[#C6923B] font-bold block">
                02 · CONTACT &amp; LOCATION
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#18221E] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: false }));
                    }}
                    className={`w-full bg-[#FBF9F5] border rounded-xl px-3.5 py-2.5 text-sm sm:text-xs text-[#18221E] focus:outline-none focus:ring-2 focus:ring-[#0D3B2E] ${
                      fieldErrors.name ? 'border-rose-400 bg-rose-50/20' : 'border-[#E8E4DC]'
                    }`}
                  />
                  {fieldErrors.name && (
                    <span className="text-[10px] text-rose-600 mt-1 block">Full name is required</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18221E] mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9845011223"
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                      if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: false }));
                    }}
                    className={`w-full bg-[#FBF9F5] border rounded-xl px-3.5 py-2.5 text-sm sm:text-xs text-[#18221E] focus:outline-none focus:ring-2 focus:ring-[#0D3B2E] ${
                      fieldErrors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-[#E8E4DC]'
                    }`}
                  />
                  {fieldErrors.phone && (
                    <span className="text-[10px] text-rose-600 mt-1 block">Valid 10-digit number required</span>
                  )}
                </div>
              </div>

              {deliveryType === 'delivery' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#18221E] mb-1">
                      Street Address &amp; Apartment / House No. *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 302, Green Meadows, Koppa Gate"
                      value={addressLine1}
                      onChange={(e) => {
                        setAddressLine1(e.target.value);
                        if (fieldErrors.address) setFieldErrors((prev) => ({ ...prev, address: false }));
                      }}
                      className={`w-full bg-[#FBF9F5] border rounded-xl px-3.5 py-2.5 text-sm sm:text-xs text-[#18221E] focus:outline-none focus:ring-2 focus:ring-[#0D3B2E] ${
                        fieldErrors.address ? 'border-rose-400 bg-rose-50/20' : 'border-[#E8E4DC]'
                      }`}
                    />
                    {fieldErrors.address && (
                      <span className="text-[10px] text-rose-600 mt-1 block">Delivery street address is required</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#18221E] mb-1">
                        Landmark / Village Locality
                      </label>
                      <input
                        type="text"
                        placeholder="Near Koppa Govt School / Post Office"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3.5 py-2.5 text-sm sm:text-xs text-[#18221E] focus:outline-none focus:ring-2 focus:ring-[#0D3B2E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#18221E] mb-1">
                        Delivery PIN Code *
                      </label>
                      <select
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3.5 py-2.5 text-sm sm:text-xs text-[#18221E] focus:outline-none focus:ring-2 focus:ring-[#0D3B2E]"
                      >
                        <option value="560105">560105 — Koppa / Hulimangala / Jigani</option>
                        <option value="560099">560099 — Bommasandra / Jigani Ind. Area</option>
                        <option value="560100">560100 — Electronic City Phase 1 &amp; 2</option>
                        <option value="562106">562106 — Anekal Town &amp; Surrounds</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#18221E] mb-1">
                  Delivery Instructions / Notes for Pharmacist
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Please deliver after 6 PM, or ring bell twice."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl p-3 text-sm sm:text-xs text-[#18221E] focus:outline-none focus:ring-2 focus:ring-[#0D3B2E]"
                />
              </div>
            </div>

            {/* Prescription Mandatory Box if hasRx */}
            {hasRx && (
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-[#C6923B] font-bold block">
                    03 · PRESCRIPTION COMPLIANCE (SCHEDULE H/H1)
                  </span>
                  <span className="text-[10px] font-mono bg-rose-50 text-rose-800 font-bold px-2 py-0.5 rounded-full border border-rose-200">
                    Mandatory
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setRxOption('upload')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                      rxOption === 'upload'
                        ? 'border-[#0D3B2E] bg-[#E8EFE9] text-[#0D3B2E] font-semibold'
                        : 'border-[#E8E4DC] text-[#5E6D66]'
                    }`}
                  >
                    <FileText className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#18221E]">Attach Document Now</div>
                      <div className="text-[11px] text-[#5E6D66]">Upload file or camera photo</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRxOption('later')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                      rxOption === 'later'
                        ? 'border-[#0D3B2E] bg-[#E8EFE9] text-[#0D3B2E] font-semibold'
                        : 'border-[#E8E4DC] text-[#5E6D66]'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                    <div>
                      <div className="font-bold text-[#18221E]">Share via WhatsApp</div>
                      <div className="text-[11px] text-[#5E6D66]">Send directly in WhatsApp chat</div>
                    </div>
                  </button>
                </div>

                {rxOption === 'upload' ? (
                  <PrescriptionUploader />
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">WhatsApp Verification:</span> When your order is placed, you can attach the photo directly into WhatsApp (+91 76762 22727). Our registered pharmacist will review it before dispatch.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Payment Method Selection */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-3">
              <span className="text-[11px] font-mono uppercase text-[#C6923B] font-bold block">
                {hasRx ? '04' : '03'} · PAYMENT PREFERENCE
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi_on_delivery')}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
                    paymentMethod === 'upi_on_delivery'
                      ? 'border-[#0D3B2E] bg-[#E8EFE9] ring-1 ring-[#0D3B2E]'
                      : 'border-[#E8E4DC] bg-[#FBF9F5]'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-[#0D3B2E] shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#18221E]">Pay UPI on Delivery</div>
                    <div className="text-[10px] text-[#5E6D66]">Scan Rider QR (GPay / PhonePe / Paytm)</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#0D3B2E] bg-[#E8EFE9] ring-1 ring-[#0D3B2E]'
                      : 'border-[#E8E4DC] bg-[#FBF9F5]'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-[#0D3B2E] shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#18221E]">Cash on Delivery (COD)</div>
                    <div className="text-[10px] text-[#5E6D66]">Hand over cash upon receipt</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Summary Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#0D3B2E] pb-3 border-b border-[#E8E4DC]">
                Order Summary ({items.length} items)
              </h3>

              <div className="divide-y divide-[#E8E4DC]/60 max-h-64 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="pr-2">
                      <div className="font-semibold text-[#18221E] flex items-center gap-1.5 flex-wrap">
                        <span>{product.name}</span>
                        {product.prescriptionRequired && (
                          <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1 rounded">
                            Rx
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#5E6D66] font-mono">
                        {quantity} × ₹{product.salePrice.toFixed(2)}
                      </div>
                    </div>
                    <span className="font-bold text-[#0D3B2E] shrink-0">
                      ₹{(product.salePrice * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-[#E8E4DC] space-y-2 text-xs text-[#5E6D66]">
                <div className="flex justify-between">
                  <span>Medicines Subtotal</span>
                  <span className="font-semibold text-[#18221E]">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Local Koppa Delivery</span>
                  <span className="text-emerald-700 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Applicable GST (Included)</span>
                  <span className="font-mono text-[#18221E]">Included in MRP</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#0D3B2E] pt-3 border-t border-[#E8E4DC]">
                  <span>Total Payable</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Error notice directly above buttons if error exists */}
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 space-y-2.5">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handlePlaceOrder('web')}
                  className="w-full bg-[#0D3B2E] hover:bg-[#1F5A46] text-white py-3.5 px-4 rounded-xl text-xs font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 min-h-[46px]"
                >
                  <span>{submitting ? 'Confirming Order...' : 'Place Order on Web'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handlePlaceOrder('whatsapp')}
                  className="w-full bg-[#1F5A46] hover:bg-[#0D3B2E] text-white py-3.5 px-4 rounded-xl text-xs font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 min-h-[46px]"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-300" />
                  <span>Send Order directly via WhatsApp</span>
                </button>
              </div>

              <div className="pt-3 text-[10px] text-[#5E6D66] text-center font-mono">
                Pharmacy Drug License: KA-B2-019842 / KA-B21-019843
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
