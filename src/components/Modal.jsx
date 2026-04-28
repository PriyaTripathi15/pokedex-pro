import Loader from './Loader';

export default function Modal({ pokemon, onClose, loading, isFavorite, onFavoriteClick }) {
  if (!pokemon) return null;

  const imageUrl = pokemon.image || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-yellow-400/20 bg-[#0f0f15] shadow-[0_24px_80px_rgba(0,0,0,0.7)]" onClick={e => e.stopPropagation()}>
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-yellow-400/15 bg-gradient-to-r from-red-600 to-[#1b1b24] p-4">
              <h2 className="text-2xl font-bold capitalize text-yellow-100">{pokemon.name}</h2>
              <button
                onClick={onClose}
                className="text-2xl font-bold text-yellow-100/80 hover:text-yellow-300"
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
                  className="mx-auto h-40 w-40 object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.45)]"
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
                className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-colors mt-4 ${
                  isFavorite
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-yellow-300 text-[#0b0b10] hover:bg-yellow-200'
                }`}
              >
                {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}