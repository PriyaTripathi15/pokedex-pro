export default function LoginScreen({
  onGoogleLogin,
  onGithubLogin,
  configured = { google: false, github: false }
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-yellow-50 px-4 ">

      {/* 🔥 ONE COMBINED CARD */}
      <div className="flex w-full max-w-5xl rounded-3xl overflow-hidden border border-yellow-400/20 bg-[#111118]/90 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.6)]">

        {/* LEFT (Image) */}
        <div className="hidden md:flex w-1/2 items-center justify-center border-r border-yellow-400/20 bg-[radial-gradient(circle_at_top,_rgba(220,20,60,0.25),_transparent_60%)] p-10">
          <div className="relative w-full max-w-sm">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
              alt="Pikachu"
              className="w-full drop-shadow-2xl"
            />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-red-500/20 to-transparent" />
          </div>
        </div>

       {/* RIGHT (Form) */}
<div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">

  {/* Logo */}
  <div className="mb-6 flex items-center gap-3 justify-center md:justify-start">
    <span className="h-3 w-3 rounded-full bg-red-400 shadow-[0_0_16px_rgba(248,113,113,0.75)]" />
    <h1 className="text-3xl font-bold text-yellow-200 font-mono">
      Pokedex Lite
    </h1>
  </div>

  {/* 🔥 Gradient Animated Heading */}
  <h2 className="text-2xl font-bold text-center md:text-left 
    bg-gradient-to-r from-yellow-300 via-red-400 to-yellow-200 
    bg-[length:200%_200%] bg-clip-text text-transparent 
    animate-gradient">
    Explore the Pokémon World
  </h2>

  <p className="mt-2 text-sm text-yellow-100/70 text-center md:text-left font-sans">
    Search, filter, and discover Pokémon with a fast and responsive interface.
  </p>

  {/* Features */}
  <div className="mt-4 text-xs text-yellow-100/60 space-y-1 text-center md:text-left">
    <p>• Smart search by name</p>
    <p>• Filter by Pokémon types</p>
    <p>• Save favorites locally</p>
    <p>• Detailed stats & abilities view</p>
  </div>

  {/* Buttons */}
  <div className="mt-7 space-y-3">
    <button
      onClick={onGoogleLogin}
      className="w-full rounded-2xl bg-gradient-to-r from-red-500 to-yellow-400 px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(220,20,60,0.35)]"
    >
      Continue with Google
    </button>

    <button
      onClick={onGithubLogin}
      className="w-full rounded-2xl border border-yellow-400/20 bg-white/5 px-5 py-3 text-sm font-bold text-yellow-100 transition-all hover:-translate-y-0.5 hover:bg-yellow-300 hover:text-[#0b0b10]"
    >
      Continue with GitHub
    </button>
  </div>

  {/* Provider Status */}
  <div className="mt-6 rounded-2xl border border-yellow-400/15 bg-black/20 p-3 text-xs text-yellow-100/70">
    <div className="mb-2 font-semibold text-yellow-100">
      Provider status
    </div>

    <div className="grid gap-2">
      <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
        <span>Google</span>
        <span className={configured.google ? 'text-green-300' : 'text-red-300'}>
          {configured.google ? 'Ready' : 'Set env vars'}
        </span>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
        <span>GitHub</span>
        <span className={configured.github ? 'text-green-300' : 'text-red-300'}>
          {configured.github ? 'Ready' : 'Set env vars'}
        </span>
      </div>
    </div>
  </div>

</div>

      </div>
    </main>
  );
}