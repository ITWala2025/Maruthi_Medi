// src/components/public/PrescriptionUploader.tsx
'use client';

import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, X, AlertTriangle, Camera } from 'lucide-react';
import { useCartStore } from '@/lib/stores/useCartStore';

export default function PrescriptionUploader() {
  const prescriptionFile = useCartStore((state) => state.prescriptionFile);
  const setPrescriptionFile = useCartStore((state) => state.setPrescriptionFile);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPrescriptionFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setFileName(null);
    setPrescriptionFile(null);
  };

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8E4DC] p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-50 text-[#C6923B] rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-[#18221E]">
              Upload Doctor&apos;s Prescription
            </h4>
            <p className="text-xs text-[#5E6D66]">
              Mandatory for Schedule H &amp; H1 medications
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase bg-rose-50 text-rose-800 px-2 py-0.5 rounded-full font-bold border border-rose-200">
          Govt. Mandated
        </span>
      </div>

      {!prescriptionFile ? (
        <label className="border-2 border-dashed border-[#C6923B]/40 hover:border-[#0D3B2E] bg-[#FBF9F5] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex items-center gap-3 mb-2">
            <UploadCloud className="w-8 h-8 text-[#C6923B] group-hover:text-[#0D3B2E] transition-colors" />
            <Camera className="w-6 h-6 text-[#5E6D66] group-hover:text-[#0D3B2E] transition-colors" />
          </div>
          <p className="text-xs font-semibold text-[#18221E] text-center">
            Click to upload photo or take picture from mobile camera
          </p>
          <p className="text-[11px] text-[#5E6D66] mt-1 text-center">
            Supports PNG, JPG, WEBP or PDF (Max 10MB)
          </p>
        </label>
      ) : (
        <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-emerald-900 truncate max-w-[220px]">
                {fileName || 'Prescription Document Attached'}
              </p>
              <p className="text-[10px] text-emerald-700">
                Ready for Pharmacist verification upon submission
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="p-1 text-emerald-800 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Compliance Helper Note */}
      <div className="flex items-start gap-2 mt-3 pt-3 border-t border-[#E8E4DC]/60 text-[11px] text-[#5E6D66]">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
        <span>
          Please ensure doctor&apos;s name, patient name, clinic stamp, and date are clearly readable. Your prescription remains confidential.
        </span>
      </div>
    </div>
  );
}
