import React from 'react';

export const Navbar = ({ title, search, setSearch, onOpenAddMember }) => {
  return (
    <header className="h-16 bg-white/95 backdrop-blur border-b border-slate-200/90 px-6 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      <div className="flex items-center space-x-4">
        <h1 className="text-base font-black text-slate-900 tracking-tight capitalize">
          {title || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center space-x-3">
        {setSearch && (
          <div className="relative w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search member or mobile..."
              className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        )}

        <button
          onClick={onOpenAddMember}
          className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold text-xs shadow-sm shadow-cyan-500/20 transition-all flex items-center space-x-1"
        >
          <span>+ Add Member</span>
        </button>
      </div>
    </header>
  );
};
