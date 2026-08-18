'use client';

import React from 'react';
import { useUIStore } from '@/stores/ui.store';
import { UserRole } from '@/types/database.types';
import { ShieldAlert } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children, fallback }) => {
  const { activeRole } = useUIStore();

  if (!allowedRoles.includes(activeRole)) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-red-900/40 bg-red-950/20 text-center">
        <ShieldAlert className="h-10 w-10 text-red-500 mb-3 animate-pulse" />
        <h4 className="font-mono text-base font-bold text-red-400">Access Restricted by RBAC Policy</h4>
        <p className="text-xs font-mono text-slate-400 mt-1">
          Your active role (<strong className="text-slate-200 uppercase">{activeRole}</strong>) lacks permission for this action. Required: {allowedRoles.join(', ')}.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
