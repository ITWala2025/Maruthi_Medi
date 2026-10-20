// src/app/admin/reports/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { mockDb } from '@/lib/mock/db';
import {
  BarChart3,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export default function AdminReportsPage() {
  const [report, setReport] = useState<{
    totalRevenue: number;
    totalTaxCollected: number;
    totalOrdersCount: number;
    gstr1: {
      slab12: { taxableValue: number; cgst: number; sgst: number; totalTax: number };
      slab18: { taxableValue: number; cgst: number; sgst: number; totalTax: number };
    };
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await mockDb.getFinancialReports();
      setReport(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !report) {
    return (
      <div className="p-8 text-center text-xs text-[#5E6D66]">
        Compiling pharmacy tax reports...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-[#C6923B] font-bold">
            STATUTORY TAXATION &amp; REVENUE LEDGER
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2E]">
            Financial &amp; GSTR-1 Tax Reporting
          </h1>
          <p className="text-xs text-[#5E6D66] mt-0.5">
            Store GSTIN: 29AAGCM1978E1Z4 · Form 20B/21B retail pharmacy accounts reconciliation.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 bg-[#0D3B2E] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs hover:bg-[#1F5A46] transition-colors self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print GSTR-1 Summary</span>
        </button>
      </div>

      {/* High-level Revenue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs">
          <div className="text-xs text-[#5E6D66]">Total Revenue (Gross B2C)</div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2E] mt-1">
            ₹{report.totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#5E6D66] mt-1">
            Across {report.totalOrdersCount} completed sales
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs">
          <div className="text-xs text-[#5E6D66]">Total Output GST Collected</div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#C6923B] mt-1">
            ₹{report.totalTaxCollected.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#5E6D66] mt-1">
            Payable to Central &amp; State Govts
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs">
          <div className="text-xs text-[#5E6D66]">Net Taxable Sales</div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#18221E] mt-1">
            ₹{(report.totalRevenue - report.totalTaxCollected).toFixed(2)}
          </div>
          <div className="text-[11px] text-[#5E6D66] mt-1">
            Excluding GST liability
          </div>
        </div>
      </div>

      {/* GSTR-1 Statutory Slab Distribution Table */}
      <div className="bg-white rounded-3xl border border-[#E8E4DC] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#E8E4DC] flex justify-between items-center">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#0D3B2E]">
              GSTR-1 Monthly Return Table (Intra-State Karnataka)
            </h3>
            <p className="text-xs text-[#5E6D66]">
              Dual tax equal splitting (50% CGST + 50% SGST) based on itemized HSN codes.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#0D3B2E] bg-[#E8EFE9] px-2.5 py-1 rounded-md">
            GSTR-1 Form
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#FBF9F5] text-[#5E6D66] text-[11px] border-b border-[#E8E4DC]">
              <tr>
                <th className="py-3 px-4">HSN &amp; Rate Category</th>
                <th className="py-3 px-4">Applicable Rate</th>
                <th className="py-3 px-4 text-right">Taxable Turnover</th>
                <th className="py-3 px-4 text-right">CGST (Central)</th>
                <th className="py-3 px-4 text-right">SGST (State)</th>
                <th className="py-3 px-4 text-right">Total GST</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DC]">
              {/* 12% Slab */}
              <tr className="hover:bg-[#FBF9F5]/60 transition-colors">
                <td className="py-4 px-4 font-sans">
                  <div className="font-bold text-[#18221E]">HSN 3004 — Medicaments &amp; Tablets</div>
                  <div className="text-[10px] text-[#5E6D66] font-mono">Antibiotics, Analgesics, Cardiac formulations</div>
                </td>
                <td className="py-4 px-4">12% (6% + 6%)</td>
                <td className="py-4 px-4 text-right font-bold text-[#18221E]">
                  ₹{report.gstr1.slab12.taxableValue.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-right text-emerald-800">
                  ₹{report.gstr1.slab12.cgst.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-right text-emerald-800">
                  ₹{report.gstr1.slab12.sgst.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-right font-bold text-[#0D3B2E]">
                  ₹{report.gstr1.slab12.totalTax.toFixed(2)}
                </td>
              </tr>

              {/* 18% Slab */}
              <tr className="hover:bg-[#FBF9F5]/60 transition-colors">
                <td className="py-4 px-4 font-sans">
                  <div className="font-bold text-[#18221E]">HSN 9018 / 3307 — Devices &amp; Skin Care</div>
                  <div className="text-[10px] text-[#5E6D66] font-mono">BP Monitors, Nebulizers, Pediatric gentle cleansers</div>
                </td>
                <td className="py-4 px-4">18% (9% + 9%)</td>
                <td className="py-4 px-4 text-right font-bold text-[#18221E]">
                  ₹{report.gstr1.slab18.taxableValue.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-right text-emerald-800">
                  ₹{report.gstr1.slab18.cgst.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-right text-emerald-800">
                  ₹{report.gstr1.slab18.sgst.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-right font-bold text-[#0D3B2E]">
                  ₹{report.gstr1.slab18.totalTax.toFixed(2)}
                </td>
              </tr>

              {/* Grand Total Row */}
              <tr className="bg-[#FBF9F5] font-bold text-sm text-[#0D3B2E]">
                <td colSpan={2} className="py-4 px-4 font-serif">Grand Statutory Total</td>
                <td className="py-4 px-4 text-right">
                  ₹{(report.gstr1.slab12.taxableValue + report.gstr1.slab18.taxableValue).toFixed(2)}
                </td>
                <td className="py-4 px-4 text-right">
                  ₹{(report.gstr1.slab12.cgst + report.gstr1.slab18.cgst).toFixed(2)}
                </td>
                <td className="py-4 px-4 text-right">
                  ₹{(report.gstr1.slab12.sgst + report.gstr1.slab18.sgst).toFixed(2)}
                </td>
                <td className="py-4 px-4 text-right text-base text-[#0D3B2E]">
                  ₹{report.totalTaxCollected.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
