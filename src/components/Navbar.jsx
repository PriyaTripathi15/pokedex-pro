export default function Navbar({ favoriteCount, user, onSignOut }) {
  return (
    <nav className="sticky top-0 z-40 border-b border-yellow-400/20 bg-[#0d0d12]/90 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl drop-shadow-[0_0_10px_rgba(255,215,0,0.35)]">🔴</div>
          <h1 className="text-2xl font-bold text-yellow-300 tracking-wide">Pokedex Lite</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-300/10 px-4 py-2 text-yellow-200 shadow-[0_0_30px_rgba(255,215,0,0.08)]">
            <span className="inline-flex items-center justify-center text-yellow-300" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.53L12 21.35z" />
              </svg>
            </span>
            <span className="text-sm font-semibold text-yellow-200">Favorites:</span>
            <span className="text-lg font-bold text-yellow-300">{favoriteCount}</span>
          </div>

          {user ? (
            <div className="flex items-center gap-3 rounded-full border border-yellow-400/20 bg-white/5 px-3 py-2 text-yellow-100 shadow-[0_12px_30px_rgba(0,0,0,0.2)]">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${user.accent} text-sm font-bold text-[#0b0b10]`}>
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold">{user.name}</div>
                <div className="text-xs text-yellow-100/60 capitalize">{user.provider} login</div>
              </div>
              <button
                onClick={onSignOut}
                className="rounded-full border border-yellow-400/20 bg-white/5 px-3 py-1 text-xs font-semibold text-yellow-100 transition-all hover:-translate-y-0.5 hover:bg-yellow-300 hover:text-[#0b0b10]"
              >
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}