// src/app/admin/suppliers/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { mockDb } from '@/lib/mock/db';
import { Supplier, GoodsReceiptNote, Product } from '@/lib/mock/types';
import {
  Building2,
  Plus,
  Boxes,
  FileCheck,
  CheckCircle2,
  Calendar,
  X,
  ShieldCheck,
} from 'lucide-react';

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [grnList, setGrnList] = useState<GoodsReceiptNote[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isGrnModalOpen, setIsGrnModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // GRN Form states
  const [selectedSupplierId, setSelectedSupplierId] = useState('sup-1');
  const [supplierInvoiceNo, setSupplierInvoiceNo] = useState('');
  const [supplierInvoiceDate, setSupplierInvoiceDate] = useState('2026-10-20');
  const [productId, setProductId] = useState('prod-1');
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('2028-12-31');
  const [receivedQty, setReceivedQty] = useState(100);
  const [freeQty, setFreeQty] = useState(0);
  const [purchaseRate, setPurchaseRate] = useState(25);
  const [mrp, setMrp] = useState(34);
  const [salePrice, setSalePrice] = useState(32);

  async function loadData() {
    setLoading(true);
    const [allSuppliers, allGrns, allProducts] = await Promise.all([
      mockDb.getSuppliers(),
      mockDb.getGoodsReceiptNotes(),
      mockDb.getProducts(),
    ]);
    setSuppliers(allSuppliers);
    setGrnList(allGrns);
    setProducts(allProducts);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleGrnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await mockDb.createGoodsReceiptNote({
      supplierId: selectedSupplierId,
      supplierInvoiceNo: supplierInvoiceNo || `INV-${Date.now().toString().slice(-5)}`,
      supplierInvoiceDate,
      items: [
        {
          productId,
          batchNumber: batchNumber || `BAT-GRN-${Date.now().toString().slice(-4)}`,
          expiryDate,
          receivedQuantity: receivedQty,
          freeQuantity: freeQty,
          purchaseRate,
          mrp,
          salePrice,
          gstPercentage: 12,
        },
      ],
    });

    setIsGrnModalOpen(false);
    loadData();
    setSupplierInvoiceNo('');
    setBatchNumber('');
  };

  return (
    <div className="space-y-8">
      {/* Title & GRN Inward Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-[#C6923B] font-bold">
            PROCUREMENT &amp; WHOLESALE INWARDING
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2E]">
            Suppliers &amp; Goods Receipt Notes (GRN)
          </h1>
          <p className="text-xs text-[#5E6D66] mt-0.5">
            Distributor directory, purchase invoice audits, and batch stock inwarding.
          </p>
        </div>

        <button
          onClick={() => setIsGrnModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#0D3B2E] hover:bg-[#1F5A46] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Inward New Stock (GRN)</span>
        </button>
      </div>

      {/* Verified Suppliers Directory */}
      <div className="bg-white rounded-3xl border border-[#E8E4DC] p-6 shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#0D3B2E]">
          Authorized Pharmaceutical Distributors
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map((sup) => (
            <div
              key={sup.id}
              className="p-4 bg-[#FBF9F5] rounded-2xl border border-[#E8E4DC] space-y-2 text-xs"
            >
              <div className="flex justify-between items-start">
                <div className="font-bold text-sm text-[#18221E]">{sup.name}</div>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                  Active Vendor
                </span>
              </div>
              <div className="text-[#5E6D66]">{sup.companyName}</div>
              <div className="font-mono text-[11px] text-[#5E6D66] space-y-0.5">
                <div>GSTIN: {sup.gstin}</div>
                <div>DL: {sup.drugLicenseNumbers}</div>
                <div>Terms: {sup.paymentTermsDays} Days Credit</div>
                <div>Phone: {sup.phone}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Goods Receipt Notes */}
      <div className="bg-white rounded-3xl border border-[#E8E4DC] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#E8E4DC]">
          <h3 className="font-serif font-bold text-lg text-[#0D3B2E]">
            Recent Goods Receipt Notes (GRN Inwarding Log)
          </h3>
          <p className="text-xs text-[#5E6D66]">
            Inventory automatically synchronized into FEFO batch registry upon receipt.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF9F5] text-[#5E6D66] font-mono text-[11px] border-b border-[#E8E4DC]">
              <tr>
                <th className="py-3 px-4">GRN Number</th>
                <th className="py-3 px-4">Supplier / Distributor</th>
                <th className="py-3 px-4">Invoice No &amp; Date</th>
                <th className="py-3 px-4">Taxable Value</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Received By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DC]">
              {grnList.map((grn) => (
                <tr key={grn.id} className="hover:bg-[#FBF9F5]/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0D3B2E]">
                    {grn.grnNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#18221E]">
                    {grn.supplierName}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#5E6D66]">
                    <div>{grn.supplierInvoiceNo}</div>
                    <div className="text-[10px]">{grn.supplierInvoiceDate}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    ₹{grn.totalTaxable.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0D3B2E]">
                    ₹{grn.grandTotal.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-[#5E6D66]">
                    {grn.receivedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GRN Inwarding Modal */}
      {isGrnModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleGrnSubmit}
            className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E4DC]">
              <h3 className="font-serif font-bold text-lg text-[#0D3B2E]">
                Goods Receipt Note (GRN) Inwarding
              </h3>
              <button
                type="button"
                onClick={() => setIsGrnModalOpen(false)}
                className="p-1 text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#18221E] mb-1">
                  Distributor / Supplier *
                </label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18221E] mb-1">
                  Supplier Invoice No *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. INV-88190"
                  value={supplierInvoiceNo}
                  onChange={(e) => setSupplierInvoiceNo(e.target.value)}
                  className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#18221E] mb-1">
                  Medicine To Inward *
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.brandManufacturer})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18221E] mb-1">
                  New Batch Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DL65-25B01"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18221E] mb-1">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18221E] mb-1">
                  Received Qty + Free Qty
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={receivedQty}
                    onChange={(e) => setReceivedQty(parseInt(e.target.value) || 0)}
                    placeholder="Received"
                    className="w-1/2 bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                  <input
                    type="number"
                    value={freeQty}
                    onChange={(e) => setFreeQty(parseInt(e.target.value) || 0)}
                    placeholder="Free"
                    className="w-1/2 bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18221E] mb-1">
                  Purchase Rate (Excl GST)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={purchaseRate}
                  onChange={(e) => setPurchaseRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18221E] mb-1">
                  MRP &amp; Selling Price
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.5"
                    value={mrp}
                    onChange={(e) => setMrp(parseFloat(e.target.value) || 0)}
                    placeholder="MRP"
                    className="w-1/2 bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs font-mono"
                  />
                  <input
                    type="number"
                    step="0.5"
                    value={salePrice}
                    onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                    placeholder="Sale"
                    className="w-1/2 bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl text-[11px] text-emerald-800 font-mono">
              ✓ Submitting this GRN will automatically increment FEFO batch inventory for this product.
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E4DC]">
              <button
                type="button"
                onClick={() => setIsGrnModalOpen(false)}
                className="px-4 py-2 border border-[#E8E4DC] rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0D3B2E] text-white rounded-xl text-xs font-bold hover:bg-[#1F5A46]"
              >
                Inward Batch Stock
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
