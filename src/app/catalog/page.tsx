// src/app/catalog/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import CartDrawer from '@/components/public/CartDrawer';
import ProductCard from '@/components/public/ProductCard';
import { mockDb } from '@/lib/mock/db';
import { Product, Category } from '@/lib/mock/types';
import { Search, Filter, AlertCircle, Sparkles, MessageSquare } from 'lucide-react';

function CatalogContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [rxFilter, setRxFilter] = useState<'all' | 'rx' | 'otc'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [allProducts, allCategories] = await Promise.all([
        mockDb.getProducts(),
        mockDb.getCategories(),
      ]);
      setProducts(allProducts);
      setCategories(allCategories);

      // Check query params if any
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      const cat = params.get('cat');
      if (q) setSearchQuery(q);
      if (cat) setSelectedCategory(cat);

      setLoading(false);
    }
    loadData();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (!p.isActive) return false;

    // Category filter
    if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
      return false;
    }

    // Rx filter
    if (rxFilter === 'rx' && !p.prescriptionRequired) return false;
    if (rxFilter === 'otc' && p.prescriptionRequired) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSalt = p.genericSalt.toLowerCase().includes(q);
      const matchBrand = p.brandManufacturer.toLowerCase().includes(q);
      return matchName || matchSalt || matchBrand;
    }

    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5]">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <span className="text-xs font-mono uppercase text-[#C6923B] font-bold tracking-wider">
            MARUTHI MEDICAL APOTHECARY CATALOG
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0D3B2E] mt-1">
            Medicines, Health &amp; Daily Necessities
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6D66] mt-1 max-w-2xl">
            Dispensed from our licensed counter in Koppa Village. Batch-verified, stored in climate-monitored cabinets, and handled by registered pharmacists.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-[#E8E4DC] p-4 mb-8 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by brand name (e.g. Dolo, Shelcal, Telma) or generic salt composition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#18221E] focus:outline-none focus:ring-2 focus:ring-[#0D3B2E]"
              />
              <Search className="w-4 h-4 text-[#5E6D66] absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-[#5E6D66] hover:text-[#0D3B2E]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Rx Filter Switcher */}
            <div className="flex items-center gap-1 bg-[#FBF9F5] p-1 rounded-xl border border-[#E8E4DC] self-start md:self-auto">
              <button
                onClick={() => setRxFilter('all')}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  rxFilter === 'all'
                    ? 'bg-[#0D3B2E] text-white shadow-xs'
                    : 'text-[#5E6D66] hover:text-[#0D3B2E]'
                }`}
              >
                All Items
              </button>
              <button
                onClick={() => setRxFilter('otc')}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  rxFilter === 'otc'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-[#5E6D66] hover:text-[#0D3B2E]'
                }`}
              >
                OTC (No Rx)
              </button>
              <button
                onClick={() => setRxFilter('rx')}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  rxFilter === 'rx'
                    ? 'bg-[#7C2D12] text-white shadow-xs'
                    : 'text-[#5E6D66] hover:text-[#7C2D12]'
                }`}
              >
                Rx Only
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <span className="text-xs text-[#5E6D66] font-mono shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>

            <button
              onClick={() => setSelectedCategory('all')}
              className={`text-xs px-3 py-1.5 rounded-full shrink-0 transition-all font-medium ${
                selectedCategory === 'all'
                  ? 'bg-[#0D3B2E] text-white'
                  : 'bg-[#F2EFE9] text-[#5E6D66] hover:text-[#18221E]'
              }`}
            >
              All Categories
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-3 py-1.5 rounded-full shrink-0 transition-all font-medium ${
                  selectedCategory === cat.id
                    ? 'bg-[#0D3B2E] text-white'
                    : 'bg-[#F2EFE9] text-[#5E6D66] hover:text-[#18221E]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Metadata & Grid */}
        <div className="flex items-center justify-between mb-4 text-xs text-[#5E6D66] font-mono">
          <span>Showing {filteredProducts.length} medicines &amp; healthcare products</span>
          <span className="hidden sm:inline">Delivering to Koppa Village, Jigani &amp; Hulimangala</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-80 bg-[#F2EFE9] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E8E4DC] p-12 text-center max-w-lg mx-auto my-8">
            <div className="w-12 h-12 bg-amber-50 text-[#C6923B] rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#18221E] mb-1">
              Medicine Not Found in Online Catalog?
            </h3>
            <p className="text-xs text-[#5E6D66] mb-6 leading-relaxed">
              We stock over 5,000+ medical formulations at our Koppa Village shop. If your prescribed brand isn&apos;t listed above, send a photo directly to our counter phone.
            </p>
            <a
              href={`https://wa.me/917676222727?text=Hello%20Maruthi%20Medical%2C%20do%20you%20have%20stock%20for%20${encodeURIComponent(searchQuery || 'this medicine')}%3F`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0D3B2E] hover:bg-[#1F5A46] text-white px-5 py-2.5 rounded-full text-xs font-semibold"
            >
              <MessageSquare className="w-4 h-4 text-emerald-300" />
              <span>Ask Pharmacist on WhatsApp</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FBF9F5] p-12 text-center text-xs text-[#5E6D66]">Loading catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
