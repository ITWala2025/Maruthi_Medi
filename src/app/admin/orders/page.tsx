// src/app/admin/orders/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { mockDb } from '@/lib/mock/db';
import { Order, OrderStatus } from '@/lib/mock/types';
import { generateOrderStatusNotificationLink } from '@/lib/whatsapp/encoder';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Printer,
  FileText,
  MessageSquare,
  AlertCircle,
  Eye,
  X,
  ExternalLink,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [thermalPrintOrder, setThermalPrintOrder] = useState<Order | null>(null);
  const [a4InvoiceOrder, setA4InvoiceOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    setLoading(true);
    const data = await mockDb.getOrders();
    setOrders(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await mockDb.updateOrderStatus(orderId, newStatus);
    fetchOrders();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'all' && o.orderStatus !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.includes(q);
      return matchNum || matchName || matchPhone;
    }
    return true;
  });

  const handleNotifyWhatsApp = (order: Order) => {
    const link = generateOrderStatusNotificationLink({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      status: order.orderStatus.replace('_', ' ').toUpperCase(),
      eta: order.deliveryType === 'delivery' ? 'Within 45 minutes in Koppa' : 'Ready at counter',
    });
    window.open(link, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-[#C6923B] font-bold">
            FULFILLMENT &amp; LOGISTICS
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2E]">
            End-to-End Order Management
          </h1>
          <p className="text-xs text-[#5E6D66] mt-0.5">
            Prescription verification, batch FEFO allocation, dispatch, and tax invoicing.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by Order ID (#MM-...), Customer Name, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl pl-9 pr-3 py-2 text-xs text-[#18221E] focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
            />
            <Search className="w-4 h-4 text-[#5E6D66] absolute left-3 top-2.5" />
          </div>

          {/* Pipeline Status Filter Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
            {['all', 'pending_review', 'confirmed', 'packing', 'out_for_delivery', 'completed'].map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                    filterStatus === st
                      ? 'bg-[#0D3B2E] text-white shadow-xs font-bold'
                      : 'bg-[#F2EFE9] text-[#5E6D66] hover:text-[#18221E]'
                  }`}
                >
                  {st === 'all' ? 'All Orders' : st.replace('_', ' ').toUpperCase()}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E8E4DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF9F5] text-[#5E6D66] font-mono text-[11px] border-b border-[#E8E4DC]">
              <tr>
                <th className="py-3 px-4">Order Details</th>
                <th className="py-3 px-4">Customer &amp; Area</th>
                <th className="py-3 px-4">Medicines / Rx</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Pipeline Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DC]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#5E6D66]">
                    No orders matching the current filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const hasRx = order.items.some((i) => i.hsnCode === '3004'); // prescription candidates

                  return (
                    <tr key={order.id} className="hover:bg-[#FBF9F5]/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-[#0D3B2E]">{order.orderNumber}</div>
                        <div className="text-[10px] text-[#5E6D66]">
                          {new Date(order.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </div>
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-bold bg-gray-100 text-gray-700 mt-1 inline-block">
                          Via {order.placedVia}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#18221E]">{order.customerName}</div>
                        <div className="text-[11px] text-[#5E6D66] font-mono">{order.customerPhone}</div>
                        <div className="text-[10px] text-[#5E6D66] truncate max-w-[180px]">
                          {order.deliveryType === 'delivery'
                            ? order.deliveryAddress?.landmark || 'Koppa Local'
                            : 'Counter Pickup'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#18221E]">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </div>
                        <div className="text-[10px] text-[#5E6D66] truncate max-w-[200px]">
                          {order.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                        </div>
                        {order.prescriptionUrl && (
                          <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded inline-block mt-0.5 border border-rose-200">
                            Prescription Attached
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-base text-[#0D3B2E]">
                          ₹{order.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-[#5E6D66]">
                          {order.paymentMethod.replace('_', ' ').toUpperCase()} (
                          {order.paymentStatus.toUpperCase()})
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as OrderStatus)
                          }
                          className="bg-[#FBF9F5] border border-[#E8E4DC] rounded-lg text-xs font-semibold px-2 py-1.5 focus:ring-1 focus:ring-[#0D3B2E]"
                        >
                          <option value="pending_review">Pending Review</option>
                          <option value="confirmed">Confirmed (Rx OK)</option>
                          <option value="packing">Packing (Batches Assigned)</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="completed">Completed / Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2">
                        {/* Split-screen modal trigger */}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 bg-[#F2EFE9] text-[#0D3B2E] hover:bg-[#0D3B2E] hover:text-white rounded-lg transition-colors inline-block"
                          title="View Order & Verify Prescription"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* WhatsApp Notify */}
                        <button
                          onClick={() => handleNotifyWhatsApp(order)}
                          className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg transition-colors inline-block"
                          title="Send Status Update on WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>

                        {/* Thermal Print */}
                        <button
                          onClick={() => setThermalPrintOrder(order)}
                          className="p-1.5 bg-amber-50 text-amber-800 hover:bg-amber-600 hover:text-white rounded-lg transition-colors inline-block"
                          title="80mm Thermal Receipt Print"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          SPLIT-SCREEN PRESCRIPTION VERIFICATION & ORDER MODAL
      ========================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E8E4DC] flex items-center justify-between bg-[#FBF9F5]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#C6923B] font-bold">
                  PHARMACIST VERIFICATION WORKSPACE
                </span>
                <h3 className="font-serif text-lg font-bold text-[#0D3B2E]">
                  Order #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-[#5E6D66] hover:text-[#0D3B2E] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Split Screen */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#E8E4DC]">
              {/* Left Column: Prescription Viewer */}
              <div className="md:col-span-6 p-6 space-y-4 bg-gray-50/50">
                <span className="text-xs font-mono uppercase text-[#0D3B2E] font-bold block">
                  DOCTOR&apos;S PRESCRIPTION DOCUMENT
                </span>

                {selectedOrder.prescriptionUrl ? (
                  <div className="border-2 border-[#E8E4DC] rounded-2xl overflow-hidden bg-white shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedOrder.prescriptionUrl}
                      alt="Prescription Document"
                      className="w-full object-contain max-h-96"
                    />
                    <div className="p-3 bg-white border-t border-[#E8E4DC] flex items-center justify-between text-xs">
                      <span className="font-mono text-[#5E6D66]">Status: Verified by Pharmacist</span>
                      <a
                        href={selectedOrder.prescriptionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#0D3B2E] hover:underline flex items-center gap-1 font-semibold"
                      >
                        Open Full <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center bg-white rounded-2xl border border-[#E8E4DC] text-[#5E6D66] space-y-2">
                    <FileText className="w-8 h-8 mx-auto opacity-30" />
                    <p className="text-xs">No digital prescription uploaded for this order.</p>
                    <p className="text-[11px] text-gray-400">Order may contain OTC products only.</p>
                  </div>
                )}

                <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <span>Drugs &amp; Cosmetics Act Mandate</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Verify doctor registration stamp, patient name, and valid clinical date prior to changing status to Confirmed.
                  </p>
                </div>
              </div>

              {/* Right Column: Order Items & Batch Assignment */}
              <div className="md:col-span-6 p-6 space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase text-[#0D3B2E] font-bold block mb-2">
                    CUSTOMER &amp; DELIVERY PROFILE
                  </span>
                  <div className="bg-[#FBF9F5] p-3.5 rounded-xl border border-[#E8E4DC] text-xs space-y-1">
                    <div className="font-bold text-[#18221E]">{selectedOrder.customerName}</div>
                    <div className="font-mono text-[#5E6D66]">{selectedOrder.customerPhone}</div>
                    <div className="text-[#5E6D66]">
                      {selectedOrder.deliveryAddress
                        ? `${selectedOrder.deliveryAddress.addressLine1}, PIN ${selectedOrder.deliveryAddress.pincode}`
                        : 'Store Counter Collection'}
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono uppercase text-[#0D3B2E] font-bold block mb-2">
                    ORDER ITEMS &amp; BATCH DETAILS
                  </span>
                  <div className="divide-y divide-[#E8E4DC] border border-[#E8E4DC] rounded-xl overflow-hidden">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="p-3 bg-white flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-[#18221E]">{item.productName}</div>
                          <div className="text-[10px] text-[#5E6D66] font-mono">
                            Qty: {item.quantity} · HSN: {item.hsnCode} · Batch: {item.batchNumber || 'Auto-Allocated (FEFO)'}
                          </div>
                        </div>
                        <div className="text-right font-mono font-bold text-[#0D3B2E]">
                          ₹{item.totalAmount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Updater Buttons */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-mono uppercase text-[#0D3B2E] font-bold block">
                    UPDATE STATUS
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'confirmed')}
                      className="bg-[#0D3B2E] hover:bg-[#1F5A46] text-white py-2.5 px-3 rounded-xl text-xs font-bold transition-colors"
                    >
                      ✓ Approve Rx &amp; Confirm
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'packing')}
                      className="bg-[#1F5A46] hover:bg-[#0D3B2E] text-white py-2.5 px-3 rounded-xl text-xs font-bold transition-colors"
                    >
                      Package Medicines
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'out_for_delivery')}
                      className="bg-amber-600 hover:bg-amber-700 text-white py-2.5 px-3 rounded-xl text-xs font-bold transition-colors"
                    >
                      Dispatch Rider
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'completed')}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 px-3 rounded-xl text-xs font-bold transition-colors"
                    >
                      Mark Completed (Paid)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          80mm ESC/POS THERMAL RECEIPT PRINT MODAL
      ========================================================================= */}
      {thermalPrintOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-xs font-mono font-bold text-gray-700">80mm Thermal Receipt</span>
              <button onClick={() => setThermalPrintOrder(null)} className="p-1 text-gray-500 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* The Thermal Format */}
            <div className="bg-[#FAF9F6] border border-gray-300 p-4 font-mono text-[11px] leading-tight text-black space-y-2">
              <div className="text-center font-bold text-sm">MARUTHI MEDICAL</div>
              <div className="text-center text-[10px]">
                Shop 7, #197/7 &amp; 8, Koppa Village<br />
                Hulimangala Post, Jigani, Bengaluru 560105<br />
                Phone: 076762 22727<br />
                DL: KA-B2-019842 / KA-B21-019843<br />
                GSTIN: 29AAGCM1978E1Z4
              </div>
              <div className="border-t border-dashed border-black pt-1">
                Bill: {thermalPrintOrder.orderNumber}<br />
                Date: {new Date(thermalPrintOrder.createdAt).toLocaleDateString()}<br />
                Patient: {thermalPrintOrder.customerName} ({thermalPrintOrder.customerPhone})
              </div>
              <div className="border-t border-dashed border-black pt-1">
                {thermalPrintOrder.items.map((item, idx) => (
                  <div key={item.id} className="flex justify-between text-[10px] py-0.5">
                    <span>{idx + 1}. {item.productName.slice(0, 18)} (x{item.quantity})</span>
                    <span>₹{item.totalAmount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-black pt-1 space-y-0.5 text-right font-bold">
                <div>Subtotal: ₹{thermalPrintOrder.subtotal.toFixed(2)}</div>
                <div>GST: Included</div>
                <div>TOTAL: ₹{thermalPrintOrder.totalAmount.toFixed(2)}</div>
              </div>
              <div className="border-t border-dashed border-black pt-1 text-center text-[9px]">
                Registered Pharmacist: K. Venkatesh<br />
                Thank you for choosing Maruthi Medical!
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full bg-[#0D3B2E] text-white py-2 rounded-xl text-xs font-bold"
            >
              Print to Thermal Roll
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
