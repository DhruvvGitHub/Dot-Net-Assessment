import React from 'react';
import SiteFooter from './SiteFooter';

export default function PageShell({ children, contentClassName = '' }) {
  return (
    <div className="min-h-screen flex flex-col relative font-sans text-white overflow-x-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-900/35 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-950/45 via-transparent to-emerald-950/25" />
      </div>

      <div
        className={`relative z-10 flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 ${contentClassName}`}
      >
        {children}
      </div>

      <SiteFooter />
    </div>
  );
}
