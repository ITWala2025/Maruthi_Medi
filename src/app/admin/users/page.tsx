// src/app/admin/users/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { mockDb } from '@/lib/mock/db';
import { UserProfile, UserRole } from '@/lib/mock/types';
import {
  ShieldAlert,
  Users,
  ShieldCheck,
  Check,
  X,
  Lock,
  KeyRound,
  FileText,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await mockDb.getUsers();
      setUsers(data);
      setLoading(false);
    }
    load();
  }, []);

  const permissionsMatrix = [
    {
      feature: 'Executive Dashboard & Net Margin Financials',
      superAdmin: true,
      admin: true,
      staff: false,
    },
    {
      feature: 'Prescription Verification & License Stamping',
      superAdmin: true,
      admin: true,
      staff: true,
    },
    {
      feature: 'FEFO Inventory, Batch Adjustments & GRN Inwarding',
      superAdmin: true,
      admin: true,
      staff: false,
    },
    {
      feature: 'Order Fulfillment & Thermal Receipt Printing',
      superAdmin: true,
      admin: true,
      staff: true,
    },
    {
      feature: 'Abandoned Cart WhatsApp Recovery',
      superAdmin: true,
      admin: true,
      staff: true,
    },
    {
      feature: 'Supplier Ledgers & Purchase Orders',
      superAdmin: true,
      admin: true,
      staff: false,
    },
    {
      feature: 'User Management & Role Permissions Control',
      superAdmin: true,
      admin: false,
      staff: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <span className="text-xs font-mono uppercase text-[#C6923B] font-bold">
          SECURITY &amp; ACCESS CONTROL
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2E]">
          Staff &amp; User Role Management (RBAC)
        </h1>
        <p className="text-xs text-[#5E6D66] mt-0.5">
          Role-gated security separating Store Owner (Super Admin), Manager (Admin), and Pharmacists (Staff).
        </p>
      </div>

      {/* Users Directory */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-3xl border border-[#E8E4DC] p-6 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-2xl bg-[#0D3B2E] text-white flex items-center justify-center font-bold text-sm">
                  {user.fullName.slice(0, 2).toUpperCase()}
                </div>
                <span
                  className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold ${
                    user.role === 'super_admin'
                      ? 'bg-purple-100 text-purple-900 border border-purple-200'
                      : user.role === 'admin'
                      ? 'bg-blue-100 text-blue-900 border border-blue-200'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                  }`}
                >
                  {user.role.replace('_', ' ')}
                </span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-base text-[#18221E]">
                  {user.fullName}
                </h3>
                <div className="text-xs text-[#5E6D66] font-mono mt-0.5">{user.email}</div>
                <div className="text-xs text-[#5E6D66] font-mono">{user.phone}</div>
              </div>

              {user.pharmacistLicenseNo && (
                <div className="p-2.5 bg-[#FBF9F5] rounded-xl border border-[#E8E4DC] text-xs font-mono text-[#0D3B2E] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>KSPC License: {user.pharmacistLicenseNo}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#E8E4DC] text-[11px] text-[#5E6D66] font-mono">
              Last Login: {new Date(user.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-3xl border border-[#E8E4DC] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#E8E4DC]">
          <h3 className="font-serif font-bold text-lg text-[#0D3B2E]">
            Role-Based Access Control (RBAC) Matrix
          </h3>
          <p className="text-xs text-[#5E6D66]">
            Strict segregation of duties enforced across customer records, purchase rates, and statutory reports.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF9F5] text-[#5E6D66] font-mono text-[11px] border-b border-[#E8E4DC]">
              <tr>
                <th className="py-3 px-6">System Module &amp; Permission</th>
                <th className="py-3 px-6 text-center">Super Admin (Owner)</th>
                <th className="py-3 px-6 text-center">Admin (Store Manager)</th>
                <th className="py-3 px-6 text-center">Staff (Pharmacist)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DC]">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#FBF9F5]/60 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-[#18221E]">
                    {item.feature}
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    {item.superAdmin ? (
                      <span className="inline-flex p-1 bg-emerald-100 text-emerald-800 rounded-full">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 bg-gray-100 text-gray-400 rounded-full">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    {item.admin ? (
                      <span className="inline-flex p-1 bg-emerald-100 text-emerald-800 rounded-full">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 bg-gray-100 text-gray-400 rounded-full">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    {item.staff ? (
                      <span className="inline-flex p-1 bg-emerald-100 text-emerald-800 rounded-full">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 bg-gray-100 text-gray-400 rounded-full">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
