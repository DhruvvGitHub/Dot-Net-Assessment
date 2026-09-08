import React from 'react';
import { RiYoutubeFill } from '@remixicon/react';

export default function SiteFooter() {
  return (
    <footer className="relative z-10 bg-black/35 backdrop-blur-md border-t border-white/10 text-white/60 text-xs py-4 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-medium">
          <span className="text-white/80">© 2026 PMAY · Ministry of Housing & Urban Affairs</span>
          <span className="hidden md:inline opacity-40">|</span>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <span className="hidden md:inline opacity-40">|</span>
          <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
          <span className="hidden md:inline opacity-40">|</span>
          <a href="#" className="hover:text-white transition-colors">Disclaimer</a>
          <span className="hidden md:inline opacity-40">|</span>
          <a href="#" className="hover:text-white transition-colors">Accessibility Statement</a>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-medium text-white/80">Follow Us</span>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://x.com/MoHUA_India"
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.youtube.com/@MoHUAIndia"
            className="text-white/60 hover:text-white transition-colors"
          >
            <RiYoutubeFill size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
