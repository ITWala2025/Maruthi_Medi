// src/app/admin/layout.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Boxes,
  Package,
  ShoppingCart,
  Users,
  Building2,
  BarChart3,
  ShieldAlert,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Bell,
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Order Lifecycle', href: '/admin/orders', icon: ShoppingBag, badge: 'Live' },
  { name: 'Prescription Queue', href: '/admin/prescriptions', icon: FileText, badge: 'Rx' },
  { name: 'FEFO Inventory & Batches', href: '/admin/inventory', icon: Boxes },
  { name: 'Product Catalog', href: '/admin/products', icon: Package },
  { name: 'Abandoned Carts', href: '/admin/abandoned-carts', icon: ShoppingCart },
  { name: 'Customer CRM', href: '/admin/customers', icon: Users },
  { name: 'Suppliers & GRN', href: '/admin/suppliers', icon: Building2 },
  { name: 'Financial & GST Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Staff & Roles (RBAC)', href: '/admin/users', icon: ShieldAlert },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#18221E] flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#0D3B2E] text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-lg">MARUTHI</span>
          <span className="text-[10px] font-mono bg-[#1F5A46] text-[#C6923B] px-2 py-0.5 rounded">
            ERP
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-white/80 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Persistent Left Sidebar */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 w-64 bg-[#0D3B2E] text-white flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } h-screen shrink-0`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-[#1F5A46]">
            <a href="/admin" className="block">
              <span className="text-xl font-serif font-bold tracking-tight text-white block">
                MARUTHI <span className="text-[#C6923B] font-light italic">Medical.</span>
              </span>
              <span className="text-[10px] font-mono tracking-wider text-white/60 uppercase block mt-0.5">
                Pharmacy ERP &amp; Dispensary Hub
              </span>
            </a>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-[#C6923B] bg-[#07221A] px-2.5 py-1 rounded-md border border-[#1F5A46]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>DL: KA-B2-019842 / KA-B21-019843</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#1F5A46] text-white font-bold shadow-xs'
                      : 'text-white/75 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#C6923B]' : 'text-white/60'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        item.badge === 'Live'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-[#C6923B]/30 text-[#C6923B]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer & User Profile */}
        <div className="p-4 border-t border-[#1F5A46] bg-[#07221A] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#1F5A46] text-white flex items-center justify-center font-bold text-xs">
                PM
              </div>
              <div>
                <div className="text-[11px] font-bold text-white truncate max-w-[110px]">
                  Prashant M.
                </div>
                <div className="text-[9px] text-[#C6923B] font-mono">
                  Super Admin (Lic)
                </div>
              </div>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-white/60 hover:text-white rounded hover:bg-white/5"
              title="Open Public Storefront"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <a
            href="/"
            className="w-full block text-center bg-white/10 hover:bg-white/15 text-white text-[11px] py-1.5 rounded-lg transition-colors font-mono"
          >
            ← View Public Storefront
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="bg-white border-b border-[#E8E4DC] px-6 py-3.5 hidden md:flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-[#0D3B2E] bg-[#E8EFE9] px-2.5 py-1 rounded-md">
              KOPPA VILLAGE DISPENSARY HUB
            </span>
            <span className="text-xs text-[#5E6D66]">
              Shop no.7, Hulimangala Post, Jigani Hobli, Bengaluru 560105
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 font-mono text-[#5E6D66]">
              <span>Pharmacist License:</span>
              <span className="font-bold text-[#0D3B2E]">KA-PH-019842</span>
            </div>

            <div className="h-4 w-px bg-gray-200" />

            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Counter Active (Open till 10 PM)
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
