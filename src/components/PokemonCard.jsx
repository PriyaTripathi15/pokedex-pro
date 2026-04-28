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
        className={`w-full mt-2 py-3 px-4 rounded-lg font-bold transition-colors text-sm ${
          isFavorite
            ? 'bg-red-500 text-white hover:bg-red-600 shadow-[0_10px_25px_rgba(220,20,60,0.25)]'
            : 'border border-yellow-400/25 bg-white/5 text-yellow-100 hover:bg-yellow-300 hover:text-[#0b0b10] shadow-[0_10px_25px_rgba(0,0,0,0.25)]'
        }`}
      >
        {isFavorite ? '❤️ Favorited' : '🤍 Favorite'}
      </button>
    </div>
  );
}