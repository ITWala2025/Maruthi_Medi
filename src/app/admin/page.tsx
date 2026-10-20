// src/app/admin/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { mockDb } from '@/lib/mock/db';
import { Order, Batch, Prescription } from '@/lib/mock/types';
import {
  TrendingUp,
  ShoppingBag,
  FileText,
  AlertTriangle,
  Boxes,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Truck,
  MessageSquare,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [batches, setBatches] = useState<Array<Batch & { productName: string }>>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [financials, setFinancials] = useState<{
    totalRevenue: number;
    totalTaxCollected: number;
    totalOrdersCount: number;
  }>({ totalRevenue: 0, totalTaxCollected: 0, totalOrdersCount: 0 });
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const [allOrders, allBatches, allPrescriptions, finReports] = await Promise.all([
      mockDb.getOrders(),
      mockDb.getBatches(),
      mockDb.getPrescriptions(),
      mockDb.getFinancialReports(),
    ]);

    setOrders(allOrders);
    setBatches(allBatches);
    setPrescriptions(allPrescriptions);
    setFinancials(finReports);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const pendingRxCount = prescriptions.filter((p) => p.status === 'pending').length;
  const lowStockCount = batches.filter((b) => b.stockQuantity <= 10).length;

  // Calculate upcoming expirations
  const now = new Date('2026-10-20');
  const criticalExpiries = batches.filter((b) => {
    const exp = new Date(b.expiryDate);
    const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  });

  const handleUpdateStatus = async (orderId: string, newStatus: Order['orderStatus']) => {
    await mockDb.updateOrderStatus(orderId, newStatus);
    loadData();
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-[#C6923B] font-bold">
            PHARMACY OPERATIONS &amp; DISPENSING
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2E]">
            Executive Dashboard
          </h1>
          <p className="text-xs text-[#5E6D66] mt-0.5">
            Real-time dispensing status, FEFO batch inventory, and fulfillment alerts.
          </p>
        </div>

        <button
          onClick={loadData}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto bg-white border border-[#E8E4DC] hover:border-[#0D3B2E] text-[#18221E] px-3.5 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#5E6D66]">
            <span>Today&apos;s Gross Sales</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2E]">
              ₹{financials.totalRevenue.toFixed(2)}
            </div>
            <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
              <span>{financials.totalOrdersCount} orders processed</span>
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#5E6D66]">
            <span>Fulfillment Pipeline</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#18221E]">
              {orders.filter((o) => o.orderStatus !== 'completed' && o.orderStatus !== 'cancelled').length}
            </div>
            <div className="text-[11px] text-[#5E6D66] mt-1">
              Active orders in packing/dispatch
            </div>
          </div>
        </div>

        {/* Prescription Verification Queue */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#5E6D66]">
            <span>Rx Review Queue</span>
            <div className="p-2 bg-rose-50 text-rose-700 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-rose-700">
              {pendingRxCount}
            </div>
            <div className="text-[11px] text-rose-600 mt-1">
              {pendingRxCount > 0 ? 'Requires immediate pharmacist review' : 'All prescriptions verified'}
            </div>
          </div>
        </div>

        {/* Expiry & Low Stock Warning */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#5E6D66]">
            <span>FEFO Expiry Alert</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-700">
              {criticalExpiries.length}
            </div>
            <div className="text-[11px] text-amber-800 mt-1">
              Batches expiring within 30 days
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Live Orders Table & Expiry Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Orders */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E8E4DC] shadow-xs overflow-hidden">
          <div className="p-6 border-b border-[#E8E4DC] flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0D3B2E]">
                Recent Counter &amp; Digital Orders
              </h3>
              <p className="text-xs text-[#5E6D66]">
                Real-time pipeline across Web, WhatsApp and In-store walk-in sales
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#0D3B2E] hover:text-[#C6923B] flex items-center gap-1 font-mono"
            >
              Manage All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FBF9F5] text-[#5E6D66] font-mono text-[11px] border-b border-[#E8E4DC]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DC]">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-[#FBF9F5]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0D3B2E]">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#18221E]">{order.customerName}</div>
                      <div className="text-[11px] text-[#5E6D66]">{order.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] uppercase bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        {order.placedVia}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#18221E]">
                      ₹{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value as Order['orderStatus'])}
                        className="bg-[#FBF9F5] border border-[#E8E4DC] rounded-lg text-xs font-semibold px-2 py-1 focus:ring-1 focus:ring-[#0D3B2E]"
                      >
                        <option value="pending_review">Pending Review</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="packing">Packing</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/track/${order.orderNumber}`}
                        target="_blank"
                        className="text-xs text-[#0D3B2E] hover:underline font-mono"
                      >
                        View Slip →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: FEFO Expiry Radar & Quick Short-cuts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Critical Expiry Watchlist */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8E4DC] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DC]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h4 className="font-serif font-bold text-[#0D3B2E] text-base">
                  FEFO Expiry Radar
                </h4>
              </div>
              <span className="text-[10px] font-mono bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-bold">
                &lt; 30 Days
              </span>
            </div>

            {criticalExpiries.length === 0 ? (
              <p className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded-xl">
                ✓ No batches expiring within the next 30 days.
              </p>
            ) : (
              <div className="space-y-3">
                {criticalExpiries.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center font-bold text-rose-950">
                      <span>{b.productName}</span>
                      <span className="font-mono text-[11px] text-rose-700">{b.stockQuantity} strips</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-rose-800 font-mono">
                      <span>Batch: {b.batchNumber}</span>
                      <span>Exp: {b.expiryDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link
              href="/admin/inventory"
              className="w-full block text-center bg-[#FBF9F5] border border-[#E8E4DC] hover:border-[#0D3B2E] text-xs font-semibold py-2 rounded-xl text-[#0D3B2E] transition-colors"
            >
              Open Full Inventory Manager
            </Link>
          </div>

          {/* Quick Counter Workflows */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8E4DC] shadow-xs space-y-3">
            <h4 className="font-serif font-bold text-[#0D3B2E] text-base mb-2">
              Counter Actions
            </h4>

            <Link
              href="/admin/prescriptions"
              className="flex items-center justify-between p-3 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC] hover:border-[#0D3B2E] transition-colors text-xs font-semibold text-[#18221E]"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C6923B]" />
                <span>Verify Doctor Prescriptions</span>
              </div>
              <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[10px]">
                {pendingRxCount}
              </span>
            </Link>

            <Link
              href="/admin/abandoned-carts"
              className="flex items-center justify-between p-3 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC] hover:border-[#0D3B2E] transition-colors text-xs font-semibold text-[#18221E]"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Send WhatsApp Cart Reminders</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            </Link>

            <Link
              href="/admin/suppliers"
              className="flex items-center justify-between p-3 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC] hover:border-[#0D3B2E] transition-colors text-xs font-semibold text-[#18221E]"
            >
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-blue-600" />
                <span>Inward Stock via GRN</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
