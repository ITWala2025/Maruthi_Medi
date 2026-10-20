// src/app/admin/customers/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { mockDb } from '@/lib/mock/db';
import { Customer } from '@/lib/mock/types';
import {
  Users,
  Search,
  Phone,
  Calendar,
  HeartHandshake,
  FileText,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await mockDb.getCustomers();
      setCustomers(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <span className="text-xs font-mono uppercase text-[#C6923B] font-bold">
          PATIENT CARE &amp; RELATIONSHIP MANAGEMENT
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2E]">
          Customer Directory &amp; Chronic Care
        </h1>
        <p className="text-xs text-[#5E6D66] mt-0.5">
          Patient lifetime order logs, chronic refill schedules, and prescription vaults.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E4DC] shadow-xs">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by patient name or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl pl-9 pr-3 py-2 text-xs text-[#18221E] focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
          />
          <Search className="w-4 h-4 text-[#5E6D66] absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Grid of Customer Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-3xl border border-[#E8E4DC] p-6 shadow-xs space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#0D3B2E]">
                  {customer.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-[#5E6D66] font-mono mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-[#C6923B]" />
                  <span>{customer.phone}</span>
                </div>
              </div>
              <span className="text-xs font-mono bg-[#E8EFE9] text-[#0D3B2E] px-2.5 py-1 rounded-full font-bold">
                {customer.totalOrders} Orders
              </span>
            </div>

            {/* Chronic Care Tag */}
            {customer.chronicCareRefillTag && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2 font-medium">
                <HeartHandshake className="w-4 h-4 text-[#C6923B] shrink-0" />
                <span>Refill Protocol: {customer.chronicCareRefillTag}</span>
              </div>
            )}

            {/* Address */}
            <div className="text-xs text-[#5E6D66] space-y-1">
              <div className="font-bold text-[#18221E] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C6923B]" /> Primary Delivery Location:
              </div>
              {customer.addresses[0] && (
                <p className="pl-5 leading-relaxed">
                  {customer.addresses[0].addressLine1}, {customer.addresses[0].addressLine2}<br />
                  PIN: {customer.addresses[0].pincode}, Bengaluru
                </p>
              )}
            </div>

            {/* Lifetime Spend & Prescriptions */}
            <div className="pt-3 border-t border-[#E8E4DC] flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[#5E6D66]">Lifetime Spend: </span>
                <strong className="text-[#0D3B2E] text-sm">₹{customer.lifetimeSpend.toFixed(2)}</strong>
              </div>

              <div className="text-[#5E6D66]">
                {customer.prescriptions.length} Prescriptions on File
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
