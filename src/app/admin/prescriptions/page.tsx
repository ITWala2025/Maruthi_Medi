// src/app/admin/prescriptions/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { mockDb } from '@/lib/mock/db';
import { Prescription } from '@/lib/mock/types';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  X,
} from 'lucide-react';

export default function AdminPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const data = await mockDb.getPrescriptions();
    setPrescriptions(data);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleVerify = async (rxId: string, status: 'approved' | 'rejected') => {
    await mockDb.verifyPrescription(
      rxId,
      status,
      'Pharmacist K. Venkatesh (KA-PH-019842)'
    );
    loadData();
    setSelectedRx(null);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <span className="text-xs font-mono uppercase text-[#C6923B] font-bold">
          PHARMACY PRACTICE REGULATIONS
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2E]">
          Prescription Verification Queue
        </h1>
        <p className="text-xs text-[#5E6D66] mt-0.5">
          Audit doctor prescriptions for Schedule H &amp; H1 medicines before dispensing.
        </p>
      </div>

      {/* Grid of Prescriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prescriptions.map((rx) => (
          <div
            key={rx.id}
            className="bg-white rounded-3xl border border-[#E8E4DC] overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              {/* Image Preview */}
              <div className="relative aspect-16/10 bg-gray-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={rx.filePath}
                  alt={rx.patientName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold shadow-xs ${
                      rx.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : rx.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {rx.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-[#18221E]">
                      {rx.patientName}
                    </h3>
                    <p className="text-xs text-[#5E6D66]">
                      {rx.doctorName || 'Doctor: To be audited'}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-[#5E6D66]">
                    {new Date(rx.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {rx.notes && (
                  <p className="text-xs text-[#5E6D66] bg-[#FBF9F5] p-2.5 rounded-xl border border-[#E8E4DC]">
                    &ldquo;{rx.notes}&rdquo;
                  </p>
                )}

                {rx.verifiedBy && (
                  <div className="text-[10px] font-mono text-emerald-800 pt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified: {rx.verifiedBy}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 pt-0 border-t border-[#E8E4DC]/60 pt-3 flex items-center gap-2">
              <button
                onClick={() => setSelectedRx(rx)}
                className="flex-1 py-2 text-center bg-[#F2EFE9] hover:bg-[#0D3B2E] hover:text-white text-[#0D3B2E] rounded-xl text-xs font-semibold transition-colors"
              >
                Inspect Document
              </button>

              {rx.status === 'pending' && (
                <button
                  onClick={() => handleVerify(rx.id, 'approved')}
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
                  title="Quick Approve"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Inspect Modal */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E4DC]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#0D3B2E]">
                  Audit Prescription for {selectedRx.patientName}
                </h3>
                <p className="text-xs text-[#5E6D66]">
                  Uploaded on {new Date(selectedRx.createdAt).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setSelectedRx(null)} className="p-1 text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto border border-[#E8E4DC] rounded-xl bg-gray-50 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedRx.filePath}
                alt={selectedRx.patientName}
                className="w-full object-contain mx-auto"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-[#5E6D66]">
                Pharmacist Stamp: KA-PH-019842
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVerify(selectedRx.id, 'rejected')}
                  className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold"
                >
                  Reject Prescription
                </button>
                <button
                  onClick={() => handleVerify(selectedRx.id, 'approved')}
                  className="px-5 py-2 bg-[#0D3B2E] text-white hover:bg-[#1F5A46] rounded-xl text-xs font-bold"
                >
                  Approve &amp; Stamp License
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
