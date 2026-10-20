// src/app/track/[orderNumber]/page.tsx
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { mockDb } from '@/lib/mock/db';
import { Order } from '@/lib/mock/types';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Printer,
  ArrowLeft,
  MapPin,
  Phone,
} from 'lucide-react';

function OrderTrackingInner() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (orderNumber) {
        const found = await mockDb.getOrderByNumber(orderNumber);
        setOrder(found);
      }
      setLoading(false);
    }
    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="flex-1 max-w-4xl mx-auto px-4 py-16 w-full animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-32 bg-gray-200 rounded-3xl" />
        <div className="h-64 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-[#0D3B2E] mb-2">
          Order #{orderNumber} Not Found
        </h2>
        <p className="text-xs text-[#5E6D66] mb-6">
          Please check your order number or contact our counter staff on WhatsApp.
        </p>
        <a
          href="https://wa.me/917676222727?text=Hello%20Maruthi%20Medical%2C%20can%20you%20help%20me%20track%20my%20order%3F"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#0D3B2E] text-white px-5 py-2.5 rounded-full text-xs font-semibold"
        >
          <MessageSquare className="w-4 h-4 text-emerald-300" />
          <span>Chat on WhatsApp (076762 22727)</span>
        </a>
      </div>
    );
  }

  const stages = [
    { key: 'placed', label: 'Order Placed', desc: 'Received at counter' },
    { key: 'verified', label: 'Rx Verified', desc: 'Pharmacist audited' },
    { key: 'packing', label: 'Packing & Invoiced', desc: 'Batch allocated' },
    { key: 'out', label: 'Out for Delivery', desc: 'With local rider' },
    { key: 'completed', label: 'Delivered', desc: 'Handed over' },
  ];

  let currentStageIndex = 0;
  if (order.orderStatus === 'confirmed') currentStageIndex = 1;
  else if (order.orderStatus === 'packing') currentStageIndex = 2;
  else if (order.orderStatus === 'out_for_delivery') currentStageIndex = 3;
  else if (order.orderStatus === 'completed') currentStageIndex = 4;

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
      {/* Header Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5E6D66] hover:text-[#0D3B2E] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Store
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2E]">
            Order #{order.orderNumber}
          </h1>
          <p className="text-xs text-[#5E6D66] mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')} at {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 border border-[#E8E4DC] bg-white text-[#18221E] px-3.5 py-2 rounded-xl text-xs font-semibold hover:border-[#0D3B2E] transition-colors"
          >
            <Printer className="w-4 h-4 text-[#5E6D66]" />
            <span>Print Invoice</span>
          </button>

          <a
            href={`https://wa.me/917676222727?text=Hello%20Maruthi%20Medical%2C%20I%20am%20inquiring%20about%20Order%20%23${order.orderNumber}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#1F5A46] text-white px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-[#0D3B2E] transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-emerald-300" />
            <span>WhatsApp Support</span>
          </a>
        </div>
      </div>

      {/* Live Progress Tracker */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E4DC] shadow-xs">
        <div className="flex items-center justify-between mb-8">
          <span className="text-xs font-mono uppercase text-[#C6923B] font-bold">
            LIVE DISPENSING STATUS
          </span>
          <span className="text-xs font-mono font-bold bg-[#E8EFE9] text-[#0D3B2E] px-3 py-1 rounded-full uppercase">
            {order.orderStatus.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative">
          {stages.map((stage, index) => {
            const isPastOrCurrent = index <= currentStageIndex;
            const isCurrent = index === currentStageIndex;

            return (
              <div key={stage.key} className="flex flex-col items-center text-center space-y-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isPastOrCurrent
                      ? 'bg-[#0D3B2E] text-white ring-4 ring-[#E8EFE9]'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isPastOrCurrent ? <CheckCircle2 className="w-5 h-5 text-[#C6923B]" /> : index + 1}
                </div>
                <div>
                  <div
                    className={`text-xs font-bold ${
                      isCurrent ? 'text-[#0D3B2E]' : isPastOrCurrent ? 'text-[#18221E]' : 'text-gray-400'
                    }`}
                  >
                    {stage.label}
                  </div>
                  <div className="text-[10px] text-[#5E6D66] mt-0.5">
                    {stage.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {order.adminNotes && (
          <div className="mt-8 p-3.5 bg-[#FBF9F5] rounded-xl border border-[#E8E4DC] text-xs text-[#5E6D66] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C6923B] shrink-0" />
            <span>
              <strong>Pharmacy Note:</strong> {order.adminNotes}
            </span>
          </div>
        )}
      </div>

      {/* Invoice & Order Items Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E4DC] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E4DC] gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#0D3B2E]">
              Dispensed Medicines &amp; Supplies
            </h3>
            <p className="text-xs text-[#5E6D66]">
              Compliant with Rule 65 of Drugs and Cosmetics Rules, 1945
            </p>
          </div>
          <div className="text-right text-xs font-mono text-[#5E6D66]">
            <div>Store DL: KA-B2-019842 / KA-B21-019843</div>
            <div>Store GSTIN: 29AAGCM1978E1Z4</div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8E4DC] text-[#5E6D66] font-mono text-[11px]">
                <th className="py-2">Item / Description</th>
                <th className="py-2">Batch No</th>
                <th className="py-2">Expiry</th>
                <th className="py-2">HSN</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DC]/60">
              {order.items.map((item) => (
                <tr key={item.id} className="text-[#18221E]">
                  <td className="py-3 font-semibold">
                    {item.productName}
                  </td>
                  <td className="py-3 font-mono text-[#5E6D66]">
                    {item.batchNumber || 'Assigned on Dispatch'}
                  </td>
                  <td className="py-3 font-mono text-[#5E6D66]">
                    {item.expiryDate || 'Verified'}
                  </td>
                  <td className="py-3 font-mono text-[#5E6D66]">{item.hsnCode}</td>
                  <td className="py-3 text-center font-mono font-bold">{item.quantity}</td>
                  <td className="py-3 text-right font-mono">₹{item.unitPrice.toFixed(2)}</td>
                  <td className="py-3 text-right font-mono font-bold text-[#0D3B2E]">
                    ₹{item.totalAmount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Delivery Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E8E4DC]">
          <div className="space-y-2 text-xs text-[#5E6D66]">
            <span className="font-mono uppercase text-[#C6923B] font-bold block">
              DELIVERY DETAILS
            </span>
            <div className="font-semibold text-[#18221E]">{order.customerName} ({order.customerPhone})</div>
            {order.deliveryAddress ? (
              <div className="leading-relaxed">
                {order.deliveryAddress.addressLine1}, {order.deliveryAddress.addressLine2}<br />
                {order.deliveryAddress.landmark && `Near ${order.deliveryAddress.landmark}, `}
                PIN: {order.deliveryAddress.pincode}, Bengaluru
              </div>
            ) : (
              <div>Counter Pickup at Shop no.7, Koppa Village</div>
            )}
            <div className="pt-2 text-[11px] font-mono text-[#0D3B2E]">
              Payment: {order.paymentMethod.replace('_', ' ').toUpperCase()} ({order.paymentStatus.toUpperCase()})
            </div>
          </div>

          <div className="space-y-2 text-xs text-[#5E6D66] md:text-right">
            <div className="flex justify-between md:justify-end md:gap-8">
              <span>Subtotal (Inclusive of GST):</span>
              <span className="font-mono text-[#18221E] font-semibold">₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between md:justify-end md:gap-8">
              <span>Delivery Charge:</span>
              <span className="font-mono text-emerald-700 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between md:justify-end md:gap-8 text-sm font-bold text-[#0D3B2E] pt-2 border-t border-[#E8E4DC]">
              <span>Total Amount:</span>
              <span className="font-mono">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OrderTrackingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
      <Navbar />
      <Suspense fallback={<div className="p-12 text-center text-xs text-[#5E6D66]">Loading order status...</div>}>
        <OrderTrackingInner />
      </Suspense>
      <Footer />
    </div>
  );
}
