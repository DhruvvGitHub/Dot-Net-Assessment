import React from 'react';

export function fieldClass(hasError, withRightPad = false) {
  return `w-full pl-11 ${withRightPad ? 'pr-11' : 'pr-4'} py-3.5 bg-slate-50/80 border ${
    hasError ? 'border-red-400' : 'border-slate-200'
  } rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 focus:bg-white transition-all text-sm`;
}

export default function FormField({
  label,
  error,
  icon: Icon,
  children,
  className = 'mb-4',
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon size={18} />
          </div>
        )}
        {children}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
