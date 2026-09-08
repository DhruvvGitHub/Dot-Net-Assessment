import React from 'react';
import {
  RiHomeHeartLine,
  RiShieldCheckLine,
  RiCommunityLine,
} from '@remixicon/react';

const highlights = [
  { icon: RiHomeHeartLine, label: 'Affordable Homes' },
  { icon: RiShieldCheckLine, label: 'Secure Process' },
  { icon: RiCommunityLine, label: 'Inclusive Growth' },
];

export default function BrandHero() {
  return (
    <div className="flex-1 flex flex-col justify-center lg:pr-16 xl:pr-24 mb-12 lg:mb-0">
      <div className="mb-10 inline-flex items-center self-start rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 px-5 py-3.5 shadow-lg">
        <img
          src="/logo_removed.png"
          alt="PMAY Logo"
          className="h-16 md:h-20 object-contain"
        />
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-semibold tracking-tight leading-[1.15] mb-6 text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">
        Pradhan Mantri Awas Yojana
        <span className="block mt-1 font-light text-white/90">Housing for All</span>
      </h1>

      <div className="h-1 w-20 bg-gradient-to-r from-orange-400 to-emerald-400 mb-8 rounded-full" />

      <p className="text-base md:text-lg text-white/85 mb-12 max-w-xl leading-relaxed [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
        PMAY enables affordable housing through credit-linked subsidy and beneficiary support for urban and rural households across India.
      </p>

      <div className="flex items-center gap-4 sm:gap-8 mb-14">
        {highlights.map(({ icon: Icon, label }, i) => (
          <React.Fragment key={label}>
            {i > 0 && <div className="h-10 w-px bg-white/25 hidden sm:block" />}
            <div className="flex flex-col items-center">
              <div className="bg-white/15 backdrop-blur-md p-3 rounded-2xl mb-2.5 text-white border border-white/20 shadow-lg">
                <Icon size={22} />
              </div>
              <span className="text-xs sm:text-sm font-medium text-white/90 tracking-wide text-center">
                {label}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="mt-auto max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4 flex items-center gap-4 shadow-xl">
        <div className="shrink-0 text-orange-300">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
            <path d="M9 21V12h6v9" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Ministry of Housing & Urban Affairs</p>
          <p className="text-xs text-white/70 mt-0.5">Government of India · Building homes, empowering lives</p>
        </div>
      </div>
    </div>
  );
}
