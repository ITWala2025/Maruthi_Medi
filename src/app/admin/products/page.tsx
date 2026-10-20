// src/app/admin/products/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { mockDb } from '@/lib/mock/db';
import { Product, Category, DrugSchedule, DosageForm } from '@/lib/mock/types';
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // New product form states
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [genericSalt, setGenericSalt] = useState('');
  const [categoryId, setCategoryId] = useState('cat-2');
  const [drugSchedule, setDrugSchedule] = useState<DrugSchedule>('otc');
  const [dosageForm, setDosageForm] = useState<DosageForm>('tablet');
  const [packSize, setPackSize] = useState('Strip of 10 Tablets');
  const [hsnCode, setHsnCode] = useState('3004');
  const [gstPercentage, setGstPercentage] = useState(12);
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);
  const [mrp, setMrp] = useState(100);
  const [salePrice, setSalePrice] = useState(90);
  const [initialStock, setInitialStock] = useState(50);
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('2028-12-31');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80');

  async function loadData() {
    setLoading(true);
    const [allProducts, allCategories] = await Promise.all([
      mockDb.getProducts(),
      mockDb.getCategories(),
    ]);
    setProducts(allProducts);
    setCategories(allCategories);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    await mockDb.addProduct({
      name,
      brandManufacturer: brand,
      genericSalt,
      categoryId,
      drugSchedule,
      dosageForm,
      packSize,
      hsnCode,
      gstPercentage,
      prescriptionRequired,
      mrp,
      salePrice,
      initialStock,
      batchNumber: batchNumber || `BAT-${Date.now().toString().slice(-4)}`,
      expiryDate,
      description,
      safetyStockThreshold: 15,
      isFeatured: false,
      isActive: true,
      imageUrl,
    });

    setIsModalOpen(false);
    loadData();
    // Reset
    setName('');
    setGenericSalt('');
    setBrand('');
  };

  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.genericSalt.toLowerCase().includes(q) ||
      p.brandManufacturer.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-[#C6923B] font-bold">
            FORMULARY &amp; PHARMACEUTICAL MASTER
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2E]">
            Product Catalog Management
          </h1>
          <p className="text-xs text-[#5E6D66] mt-0.5">
            Configure drug schedules (Schedule H / OTC), HSN codes, and pricing formulas.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#0D3B2E] hover:bg-[#1F5A46] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Medicine</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E4DC] shadow-xs">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by brand name, generic salt composition, or manufacturer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl pl-9 pr-3 py-2 text-xs text-[#18221E] focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
          />
          <Search className="w-4 h-4 text-[#5E6D66] absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#E8E4DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF9F5] text-[#5E6D66] font-mono text-[11px] border-b border-[#E8E4DC]">
              <tr>
                <th className="py-3 px-4">Medicine Details</th>
                <th className="py-3 px-4">Brand / Mfr</th>
                <th className="py-3 px-4">Schedule / Rx</th>
                <th className="py-3 px-4">HSN &amp; GST</th>
                <th className="py-3 px-4">Pack Size</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DC]">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#FBF9F5]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#18221E]">{p.name}</div>
                    <div className="text-[10px] text-[#5E6D66] truncate max-w-[220px]">
                      {p.genericSalt}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[#5E6D66]">
                    {p.brandManufacturer}
                  </td>

                  <td className="py-3.5 px-4">
                    {p.prescriptionRequired ? (
                      <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        Rx Required (Sch H)
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Over The Counter
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#5E6D66]">
                    <div>HSN: {p.hsnCode}</div>
                    <div>GST: {p.gstPercentage}%</div>
                  </td>

                  <td className="py-3.5 px-4 text-[#5E6D66]">
                    {p.packSize}
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-[#0D3B2E]">₹{p.salePrice.toFixed(2)}</div>
                    <div className="text-[10px] text-gray-400 line-through">MRP ₹{p.mrp.toFixed(2)}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold">
                    <span className={p.stockQuantity <= 15 ? 'text-amber-700' : 'text-emerald-800'}>
                      {p.stockQuantity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddProduct}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E4DC]">
              <h3 className="font-serif font-bold text-lg text-[#0D3B2E]">
                Add New Pharmaceutical Formulation
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#18221E] mb-1">
                  Medicine Brand Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dolo 650mg Tablet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18221E] mb-1">
                  Brand Manufacturer *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Micro Labs Ltd."
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#18221E] mb-1">
                  Generic Salt / Composition *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paracetamol (650mg)"
                  value={genericSalt}
                  onChange={(e) => setGenericSalt(e.target.value)}
                  className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18221E] mb-1">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18221E] mb-1">
                  Drug Schedule (Regulatory)
                </label>
                <select
                  value={drugSchedule}
                  onChange={(e) => {
                    const sched = e.target.value as DrugSchedule;
                    setDrugSchedule(sched);
                    setPrescriptionRequired(sched.startsWith('schedule_'));
                  }}
                  className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  <option value="otc">Over The Counter (OTC)</option>
                  <option value="schedule_h">Schedule H (Prescription Mandatory)</option>
                  <option value="schedule_h1">Schedule H1 (High Alert Rx)</option>
                  <option value="ayurvedic">Ayurvedic / Herbal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18221E] mb-1">
                  Pack Size Description
                </label>
                <input
                  type="text"
                  placeholder="Strip of 15 Tablets"
                  value={packSize}
                  onChange={(e) => setPackSize(e.target.value)}
                  className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18221E] mb-1">
                  HSN Code &amp; GST Slab
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={hsnCode}
                    onChange={(e) => setHsnCode(e.target.value)}
                    className="w-1/2 bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs font-mono"
                  />
                  <select
                    value={gstPercentage}
                    onChange={(e) => setGstPercentage(parseFloat(e.target.value))}
                    className="w-1/2 bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs font-mono"
                  >
                    <option value={12}>12% GST</option>
                    <option value={18}>18% GST</option>
                    <option value={5}>5% GST</option>
                    <option value={0}>0% Exempt</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18221E] mb-1">
                  MRP (₹) &amp; Sale Price (₹)
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

              <div>
                <label className="block text-xs font-semibold text-[#18221E] mb-1">
                  Initial Batch No &amp; Expiry
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="BAT-24K01"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-1/2 bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs font-mono"
                  />
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-1/2 bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#E8E4DC]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-[#E8E4DC] rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0D3B2E] text-white rounded-xl text-xs font-bold hover:bg-[#1F5A46]"
              >
                Save Medicine to Formulary
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
