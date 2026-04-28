import Loader from './Loader';

export default function Modal({ pokemon, onClose, loading, isFavorite, onFavoriteClick }) {
  if (!pokemon) return null;

  const imageUrl = pokemon.image || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-yellow-400/20 bg-[#0f0f15] shadow-[0_24px_80px_rgba(0,0,0,0.7)] animate-slideIn" onClick={e => e.stopPropagation()}>
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-yellow-400/15 bg-gradient-to-r from-red-600 to-[#1b1b24] p-4">
              <h2 className="text-2xl font-bold capitalize text-yellow-100">{pokemon.name}</h2>
              <button
                onClick={onClose}
                className="text-2xl font-bold text-yellow-100/80 transition-colors hover:text-yellow-300"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Image */}
              <div className="text-center mb-6">
                <img
                  src={imageUrl}
                  alt={pokemon.name}
                  className="mx-auto h-40 w-40 object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/160?text=Pokemon';
                  }}
                />
              </div>

              {/* Types */}
              {pokemon.types && (
                <div className="mb-4">
                  <h3 className="mb-2 font-semibold text-yellow-100">Types:</h3>
                  <div className="flex gap-2 flex-wrap">
                    {pokemon.types.map(type => (
                      <span key={type} className="rounded-full bg-red-500 px-3 py-1 text-sm capitalize text-white shadow-sm">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              {pokemon.stats && pokemon.stats.length > 0 && (
                <div className="mb-4">
                  <h3 className="mb-2 font-semibold text-yellow-100">Stats:</h3>
                  <div className="space-y-2">
                    {pokemon.stats.slice(0, 6).map(stat => (
                      <div key={stat.name} className="flex items-center justify-between">
                        <span className="w-20 text-sm capitalize text-yellow-100/70">{stat.name}:</span>
                        <div className="mx-2 h-2 flex-1 rounded-full bg-white/10">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-red-500 to-yellow-300 transition-all"
                            style={{ width: `${Math.min(stat.value / 2, 100)}%` }}
                          />
                        </div>
                        <span className="w-12 text-right text-sm font-semibold text-yellow-100">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Abilities */}
              {pokemon.abilities && pokemon.abilities.length > 0 && (
                <div className="mb-4">
                  <h3 className="mb-2 font-semibold text-yellow-100">Abilities:</h3>
                  <div className="flex flex-wrap gap-2">
                    {pokemon.abilities.map(ability => (
                      <span key={ability} className="rounded-full border border-yellow-400/20 bg-yellow-300/10 px-3 py-1 text-sm capitalize text-yellow-100">
                        {ability}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Favorite Button */}
              <button
                onClick={onFavoriteClick}
                className={`w-full py-3 px-4 rounded-lg font-bold transition-colors mt-4 inline-flex items-center justify-center gap-2 ${
                  isFavorite
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-yellow-300 text-[#0b0b10] hover:bg-yellow-200'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.53L12 21.35z" />
                </svg>
                <span>{isFavorite ? 'Remove from Favorite' : 'Add to Favorite'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}