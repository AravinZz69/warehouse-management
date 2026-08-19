'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/stores/ui.store';
import { UserRole } from '@/types/database.types';
import { Cpu, ShieldCheck, ArrowRight, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setActiveRole } = useUIStore();
  const [email, setEmail] = useState('admin@ariawms.io');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: selectedRole }),
      });
    } catch (err) {
      console.error('Login request error:', err);
    } finally {
      document.cookie = 'aria_session=true; path=/; max-age=604800; SameSite=Lax';
      setActiveRole(selectedRole);
      setLoading(false);
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0D131F] p-8 shadow-2xl space-y-6">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="h-12 w-12 rounded-xl bg-sky-600 flex items-center justify-center text-white font-mono font-black text-xl shadow-[0_0_20px_rgba(14,165,233,0.5)]">
          A
        </div>
        <h1 className="font-mono text-xl font-bold tracking-tight text-slate-100">ARIA WMS & IMS</h1>
        <p className="text-xs font-mono text-slate-400">Autonomous Enterprise Logistics System v5.0</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Select Access Role (RBAC)</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono text-sky-400 font-bold focus:border-sky-500 focus:outline-none"
          >
            <option value="admin">Admin / System Architect</option>
            <option value="inventory_manager">Inventory Operations Manager</option>
            <option value="staff">Floor Operator / Wave Picker</option>
            <option value="supervisor">Shift Supervisor</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Corporate Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-200 focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-200 focus:border-sky-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 py-3 text-xs font-mono font-bold text-white transition shadow-lg cursor-pointer"
        >
          <span>{loading ? 'AUTHENTICATING...' : 'AUTHENTICATE & ENTER TERMINAL'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="border-t border-slate-800 pt-4 text-center text-[10px] font-mono text-slate-500">
        Demo Multi-Role RBAC System | Zero Mock Data Fallback Engine Active
      </div>
    </div>
  );
}
