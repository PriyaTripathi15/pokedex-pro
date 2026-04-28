export default function PokemonCard({ pokemon, onSelect, isFavorite, onFavoriteClick }) {
  const imageUrl = pokemon.image || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return (
    <div className="group cursor-pointer h-full flex flex-col">
      <div
        onClick={onSelect}
        className="min-h-72 flex flex-1 flex-col items-center justify-center rounded-2xl border border-yellow-400/15 bg-gradient-to-br from-[#171721] via-[#111118] to-[#0b0b10] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.45)] transition-all hover:-translate-y-1 hover:border-yellow-300/40 hover:shadow-[0_18px_45px_rgba(0,0,0,0.6)]"
      >
        <img
          src={imageUrl}
          alt={pokemon.name}
          className="w-24 h-24 object-contain mb-2 drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)] transition-transform group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/96?text=Pokemon';
          }}
        />
        <h3 className="text-center font-semibold text-yellow-100 capitalize text-base mb-2 line-clamp-1">
          {pokemon.name}
        </h3>
        <div className="flex gap-1 flex-wrap justify-center min-h-8">
          {pokemon.types && pokemon.types.length > 0 ? (
            pokemon.types.map(type => (
              <span key={type} className="text-xs bg-red-500/90 text-white px-2 py-1 rounded-full capitalize whitespace-nowrap shadow-sm">
                {type}
              </span>
            ))
          ) : (
            <span className="text-xs bg-white/10 text-yellow-100 px-2 py-1 rounded-full">No Type</span>
          )}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteClick();
        }}
        className={`w-full mt-2 py-3 px-4 rounded-lg font-bold transition-colors text-sm inline-flex items-center justify-center gap-2 ${
          isFavorite
            ? 'bg-red-500 text-white hover:bg-red-600 shadow-[0_10px_25px_rgba(220,20,60,0.25)]'
            : 'border border-yellow-400/25 bg-white/5 text-yellow-100 hover:bg-yellow-300 hover:text-[#0b0b10] shadow-[0_10px_25px_rgba(0,0,0,0.25)]'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.53L12 21.35z" />
        </svg>
        <span>{isFavorite ? 'Favorite' : 'Add to Favorite'}</span>
      </button>
    </div>
  );
}