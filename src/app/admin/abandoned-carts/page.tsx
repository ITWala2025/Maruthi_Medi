// src/app/admin/abandoned-carts/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { mockDb } from '@/lib/mock/db';
import { AbandonedCart } from '@/lib/mock/types';
import { generateAbandonedCartRecoveryLink } from '@/lib/whatsapp/encoder';
import {
  ShoppingCart,
  MessageSquare,
  Clock,
  TrendingDown,
  CheckCircle2,
  RefreshCw,
  Phone,
} from 'lucide-react';

export default function AdminAbandonedCartsPage() {
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const data = await mockDb.getAbandonedCarts();
    setCarts(data);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleSendReminder = async (cart: AbandonedCart) => {
    if (!cart.customerPhone) return;

    const link = generateAbandonedCartRecoveryLink({
      customerName: cart.customerName || 'Valued Customer',
      customerPhone: cart.customerPhone,
      cartItemSummary: cart.cartItems.map((i) => `${i.quantity}x ${i.name}`).join(', '),
      cartValue: cart.totalValue,
      recoveryUrl: `https://maruthimedical.in/checkout?recover=${cart.sessionId}`,
    });

    await mockDb.markAbandonedCartReminded(cart.id);
    loadData();
    window.open(link, '_blank');
  };

  const totalLostRevenue = carts.reduce((sum, c) => sum + c.totalValue, 0);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-[#C6923B] font-bold">
            REVENUE RECOVERY &amp; CRM RETENTION
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2E]">
            Abandoned Cart Recovery
          </h1>
          <p className="text-xs text-[#5E6D66] mt-0.5">
            Identify dropped checkouts and re-engage customers via 1-click WhatsApp follow-ups.
          </p>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs">
          <div className="text-xs text-[#5E6D66]">Total Dropped Carts</div>
          <div className="text-2xl font-serif font-bold text-[#18221E] mt-1">
            {carts.length}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs">
          <div className="text-xs text-[#5E6D66]">Potential Lost Value</div>
          <div className="text-2xl font-serif font-bold text-rose-700 mt-1">
            ₹{totalLostRevenue.toFixed(2)}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs">
          <div className="text-xs text-[#5E6D66]">Follow-up Method</div>
          <div className="text-xs font-bold text-emerald-800 mt-2 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Zero-Cost Direct WhatsApp Trigger</span>
          </div>
        </div>
      </div>

      {/* Abandoned Carts Table */}
      <div className="bg-white rounded-3xl border border-[#E8E4DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF9F5] text-[#5E6D66] font-mono text-[11px] border-b border-[#E8E4DC]">
              <tr>
                <th className="py-3 px-4">Customer Contact</th>
                <th className="py-3 px-4">Medicines in Cart</th>
                <th className="py-3 px-4">Cart Value</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4">Follow-up Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DC]">
              {carts.map((cart) => (
                <tr key={cart.id} className="hover:bg-[#FBF9F5]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#18221E]">
                      {cart.customerName || 'Anonymous Guest'}
                    </div>
                    <div className="text-[11px] text-[#5E6D66] font-mono flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-[#C6923B]" />
                      <span>{cart.customerPhone || 'Phone Not Entered'}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      {cart.cartItems.map((item, idx) => (
                        <div key={idx} className="text-[#18221E]">
                          <span className="font-semibold">{item.quantity}x</span> {item.name}{' '}
                          <span className="text-[10px] text-[#5E6D66]">({item.packSize})</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-base text-[#0D3B2E]">
                    ₹{cart.totalValue.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[#5E6D66]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{new Date(cart.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {cart.whatsappReminderSent ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Reminder Sent
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Uncontacted
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleSendReminder(cart)}
                      className="inline-flex items-center gap-1.5 bg-[#1F5A46] hover:bg-[#0D3B2E] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Send WhatsApp Reminder</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
