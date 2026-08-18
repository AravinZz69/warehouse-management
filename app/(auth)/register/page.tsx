'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('staff');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/login');
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0D131F] p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-1">
        <h1 className="font-mono text-xl font-bold text-slate-100">User Registration</h1>
        <p className="text-xs font-mono text-slate-400">Request ARIA WMS Personnel Role Access</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-200"
            required
          />
        </div>

        <div>
          <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-200"
            required
          />
        </div>

        <div>
          <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Requested Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-200"
          >
            <option value="staff">Floor Staff / Operator</option>
            <option value="inventory_manager">Inventory Manager</option>
            <option value="supervisor">Supervisor</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded bg-sky-600 hover:bg-sky-500 py-2.5 text-xs font-mono font-bold text-white transition"
        >
          Submit Request
        </button>
      </form>

      <div className="text-center text-xs font-mono text-slate-400">
        Already have access? <Link href="/login" className="text-sky-400 hover:underline">Log in</Link>
      </div>
    </div>
  );
}
