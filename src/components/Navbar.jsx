export default function Navbar({ favoriteCount }) {
  return (
    <nav className="sticky top-0 z-40 border-b border-yellow-400/20 bg-[#0d0d12]/90 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl drop-shadow-[0_0_10px_rgba(255,215,0,0.35)]">🔴</div>
          <h1 className="text-2xl font-bold text-yellow-300 tracking-wide">Pokédex Pro</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-300/10 px-4 py-2 text-yellow-200 shadow-[0_0_30px_rgba(255,215,0,0.08)]">
          <span className="text-sm font-semibold text-yellow-200">❤️ Favorites:</span>
          <span className="text-lg font-bold text-yellow-300">{favoriteCount}</span>
        </div>
      </div>
    </nav>
  );
}