// src/app/admin/inventory/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { mockDb } from '@/lib/mock/db';
import { Batch } from '@/lib/mock/types';
import {
  Boxes,
  Search,
  Filter,
  AlertTriangle,
  Plus,
  ArrowUpDown,
  ShieldAlert,
  CheckCircle2,
  X,
} from 'lucide-react';

export default function AdminInventoryPage() {
  const [batches, setBatches] = useState<Array<Batch & { productName: string; genericSalt: string; hsnCode: string }>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'expiring' | 'low_stock'>('all');
  const [selectedBatchForAdjustment, setSelectedBatchForAdjustment] = useState<Batch | null>(null);
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustReason, setAdjustReason] = useState('Audit Physical Reconciliation');
  const [loading, setLoading] = useState(true);

  async function loadBatches() {
    setLoading(true);
    const data = await mockDb.getBatches();
    setBatches(data);
    setLoading(false);
  }

  useEffect(() => {
    loadBatches();
  }, []);

  const now = new Date('2026-10-20');

  const filteredBatches = batches.filter((b) => {
    const exp = new Date(b.expiryDate);
    const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (filterType === 'expiring' && diffDays > 60) return false;
    if (filterType === 'low_stock' && b.stockQuantity > 15) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.productName.toLowerCase().includes(q);
      const matchBatch = b.batchNumber.toLowerCase().includes(q);
      const matchRack = (b.rackLocation || '').toLowerCase().includes(q);
      return matchName || matchBatch || matchRack;
    }

    return true;
  });

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBatchForAdjustment) {
      await mockDb.adjustBatchStock(
        selectedBatchForAdjustment.id,
        adjustQty,
        adjustReason
      );
      setSelectedBatchForAdjustment(null);
      setAdjustQty(0);
      loadBatches();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-[#C6923B] font-bold">
            PHARMACEUTICAL INVENTORY &amp; TRACEABILITY
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2E]">
            FEFO Batch &amp; Expiry Management
          </h1>
          <p className="text-xs text-[#5E6D66] mt-0.5">
            First-Expired, First-Out (FEFO) dispensing order, shelf locations, and audit logs.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E4DC] shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by Medicine Name, Batch Number (e.g. DL65-...), or Rack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl pl-9 pr-3 py-2 text-xs text-[#18221E] focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
          />
          <Search className="w-4 h-4 text-[#5E6D66] absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-1.5 self-start md:self-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
              filterType === 'all'
                ? 'bg-[#0D3B2E] text-white font-bold shadow-xs'
                : 'bg-[#F2EFE9] text-[#5E6D66] hover:text-[#18221E]'
            }`}
          >
            All Batches ({batches.length})
          </button>
          <button
            onClick={() => setFilterType('expiring')}
            className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
              filterType === 'expiring'
                ? 'bg-rose-700 text-white font-bold shadow-xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            Expiring Soon (&lt; 60d)
          </button>
          <button
            onClick={() => setFilterType('low_stock')}
            className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
              filterType === 'low_stock'
                ? 'bg-amber-700 text-white font-bold shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Low Stock (&lt; 15 units)
          </button>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-3xl border border-[#E8E4DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF9F5] text-[#5E6D66] font-mono text-[11px] border-b border-[#E8E4DC]">
              <tr>
                <th className="py-3 px-4">Medicine &amp; Salt</th>
                <th className="py-3 px-4">Batch Number</th>
                <th className="py-3 px-4">Expiry Date (FEFO)</th>
                <th className="py-3 px-4">Shelf / Rack</th>
                <th className="py-3 px-4">Cost vs MRP</th>
                <th className="py-3 px-4">Stock In Hand</th>
                <th className="py-3 px-4 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DC]">
              {filteredBatches.map((batch) => {
                const exp = new Date(batch.expiryDate);
                const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                let badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                let alertText = `${diffDays} days left`;
                if (diffDays <= 30) {
                  badgeStyle = 'bg-rose-100 text-rose-900 border-rose-300 font-bold';
                  alertText = `CRITICAL (${diffDays} days)`;
                } else if (diffDays <= 90) {
                  badgeStyle = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
                  alertText = `Warning (${diffDays} days)`;
                }

                return (
                  <tr key={batch.id} className="hover:bg-[#FBF9F5]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#18221E]">{batch.productName}</div>
                      <div className="text-[10px] text-[#5E6D66] truncate max-w-[200px]">
                        {batch.genericSalt}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-[#0D3B2E]">
                      {batch.batchNumber}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-semibold text-[#18221E]">{batch.expiryDate}</div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border inline-block mt-0.5 ${badgeStyle}`}>
                        {alertText}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#5E6D66]">
                      <span className="bg-gray-100 px-2 py-1 rounded text-[11px]">
                        {batch.rackLocation || 'Counter Shelf'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-[#5E6D66]">Cost: ₹{batch.purchasePrice.toFixed(2)}</div>
                      <div className="font-bold text-[#0D3B2E]">MRP: ₹{batch.mrp.toFixed(2)}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className={`text-sm font-bold ${batch.stockQuantity <= 10 ? 'text-rose-700' : 'text-[#18221E]'}`}>
                        {batch.stockQuantity} units
                      </span>
                      {batch.reservedQuantity > 0 && (
                        <div className="text-[10px] text-gray-400">
                          ({batch.reservedQuantity} reserved)
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedBatchForAdjustment(batch)}
                        className="text-xs text-[#0D3B2E] hover:underline font-mono bg-[#F2EFE9] px-2.5 py-1 rounded-lg"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {selectedBatchForAdjustment && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleAdjustSubmit}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E4DC]">
              <div>
                <h3 className="font-serif font-bold text-base text-[#0D3B2E]">
                  Stock Adjustment (Batch {selectedBatchForAdjustment.batchNumber})
                </h3>
                <p className="text-xs text-[#5E6D66]">
                  Current stock: {selectedBatchForAdjustment.stockQuantity} units
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBatchForAdjustment(null)}
                className="p-1 text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#18221E] mb-1">
                Adjustment Quantity (Negative for loss, Positive for surplus)
              </label>
              <input
                type="number"
                required
                value={adjustQty}
                onChange={(e) => setAdjustQty(parseInt(e.target.value) || 0)}
                className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs font-mono font-bold"
              />
              <p className="text-[10px] text-[#5E6D66] mt-1">
                New Stock Will Be: {Math.max(0, selectedBatchForAdjustment.stockQuantity + adjustQty)} units
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#18221E] mb-1">
                Reason for Adjustment
              </label>
              <select
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs"
              >
                <option value="Audit Physical Reconciliation">Audit Physical Reconciliation</option>
                <option value="Breakage / Damaged Vial or Strip">Breakage / Damaged Vial or Strip</option>
                <option value="Expired Stock Disposal">Expired Stock Disposal</option>
                <option value="Supplier Credit Return">Supplier Credit Return</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E4DC]">
              <button
                type="button"
                onClick={() => setSelectedBatchForAdjustment(null)}
                className="px-4 py-2 border border-[#E8E4DC] rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0D3B2E] text-white rounded-xl text-xs font-semibold hover:bg-[#1F5A46]"
              >
                Apply Adjustment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
