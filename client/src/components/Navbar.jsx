import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const links = [
  { to: '/register', label: 'Register', isActive: (path) => path === '/register' || path === '/' },
  { to: '/status', label: 'Check Status', isActive: (path) => path.startsWith('/status') },
  { to: '/authadmin', label: 'Admin', isActive: (path) => path.startsWith('/authadmin') },
];

export default function Navbar({ variant = 'solid', actions }) {
  const { pathname } = useLocation();
  const overlay = variant === 'overlay';

  return (
    <header className={`relative z-20 ${overlay ? '' : 'sticky top-0'}`}>
      <div
        className={
          overlay
            ? 'bg-white/10 backdrop-blur-xl border-b border-white/15'
            : 'bg-slate-950/95 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.28)]'
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">
            <Link to="/register" className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 rounded-xl bg-white px-2.5 py-1.5 shadow-md ring-1 ring-white/40">
                <img src="/logo_removed.png" alt="PMAY" className="h-8 sm:h-9 object-contain" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl font-semibold tracking-tight text-white">
                    PMAY
                  </span>
                  <span className="hidden sm:inline-flex items-center rounded-full bg-orange-500/20 text-orange-200 border border-orange-400/30 px-2 py-0.5 text-[10px] font-semibold tracking-wide">
                    HOUSING FOR ALL
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-white/65 truncate">
                  Pradhan Mantri Awas Yojana
                </p>
              </div>
            </Link>

            <nav className="flex items-center gap-1 sm:gap-1.5">
              {links.map((link) => {
                const active = link.isActive(pathname);
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      active
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </NavLink>
                );
              })}
              {actions}
            </nav>
          </div>
        </div>
        <div className="h-0.5 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400" />
      </div>
    </header>
  );
}
