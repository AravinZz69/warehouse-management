'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Factory } from 'lucide-react';

export default function NewSupplierPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          contact_person: contactPerson,
          email,
          phone,
          payment_terms: paymentTerms,
        }),
      });
      router.push('/suppliers');
    } catch (err) {
      console.error('Failed to create supplier:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Link href="/suppliers" className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-mono text-xl font-bold uppercase text-slate-100">ADD VENDOR SUPPLIER</h1>
          <p className="text-xs font-mono text-slate-400">Add preferred vendor to procurement directory</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-800 bg-[#0D131F] p-6 shadow-xl text-xs font-mono">
        <div>
          <label className="text-[10px] text-slate-400 uppercase block mb-1">Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-slate-200 focus:border-sky-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-slate-400 uppercase block mb-1">Contact Person</label>
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-slate-200 focus:border-sky-500"
              required
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 uppercase block mb-1">Corporate Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-slate-200 focus:border-sky-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-slate-400 uppercase block mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-slate-200 focus:border-sky-500"
              required
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 uppercase block mb-1">Payment Terms</label>
            <select
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-purple-400 font-bold focus:border-sky-500"
            >
              <option value="Net 15">Net 15</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 45">Net 45</option>
              <option value="Net 60">Net 60</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 py-3 text-xs font-mono font-bold text-white transition shadow-lg mt-4"
        >
          <Save className="h-4 w-4" /> SAVE VENDOR RECORD
        </button>
      </form>
    </div>
  );
}
