import React from 'react';

export const Navbar = ({ title, search, setSearch, onOpenAddMember, onToggleMobileNav, onNavigateToHome, onLogout }) => {
  return (
    <header className="h-16 bg-white/95 backdrop-blur border-b border-slate-200/90 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center space-x-2 sm:space-x-3 truncate">
        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={onToggleMobileNav}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all shrink-0"
          aria-label="Open navigation menu"
          title="Open Menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight capitalize truncate">
          {title || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {onNavigateToHome && (
          <button
            type="button"
            onClick={onNavigateToHome}
            className="py-1.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs shadow-xs transition-all flex items-center space-x-1 shrink-0"
            title="Return to Website Home"
          >
            <span>🌐</span>
            <span className="hidden sm:inline">Website Home</span>
          </button>
        )}

        {setSearch && (
          <div className="relative w-36 sm:w-60">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        )}

        <button
          onClick={onOpenAddMember}
          className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs shadow-sm shadow-cyan-500/20 transition-all flex items-center space-x-1 shrink-0 whitespace-nowrap active:scale-95"
        >
          <span>+</span>
          <span className="hidden sm:inline"> Add Member</span>
          <span className="sm:hidden"> Add</span>
        </button>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="py-1.5 px-2.5 sm:px-3 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 active:scale-95 font-bold text-xs shadow-xs transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer"
            title="Sign Out of Account"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        )}
      </div>
    </header>
  );
};
