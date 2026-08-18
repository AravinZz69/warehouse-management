import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex items-center justify-center p-4">
      {children}
    </div>
  );
}
