import React from 'react';

export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="w-full lg:w-[440px] xl:w-[460px] flex flex-col justify-center">
      <div className="rounded-3xl bg-white/90 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.35)] p-8 md:p-9 text-slate-800 border border-white/60">
        <div className="flex items-center justify-center mb-7">
          <img
            src="/logo_removed.png"
            alt="PMAY"
            className="h-12 object-contain mr-3"
          />
          <div>
            <h2 className="text-lg font-semibold text-slate-900 leading-tight">PMAY Portal</h2>
            <p className="text-[10px] text-slate-500 font-semibold tracking-[0.14em] mt-0.5">
              GOVERNMENT OF INDIA
            </p>
          </div>
        </div>

        {title && (
          <h3 className="text-2xl font-semibold text-slate-900 mb-1 text-center">{title}</h3>
        )}
        {subtitle && (
          <p className="text-sm text-slate-500 mb-7 text-center">{subtitle}</p>
        )}

        {children}
      </div>
    </div>
  );
}
