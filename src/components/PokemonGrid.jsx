import PokemonCard from './PokemonCard';
import Loader from './Loader';

export default function PokemonGrid({ pokemon, loading, onSelect, favorites, onFavoriteClick }) {
  if (loading) return <Loader />;

  if (!pokemon || pokemon.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No Pokémon found. Try a different search or filter.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
      {pokemon.map(p => (
        <PokemonCard
          key={p.id}
          pokemon={p}
          onSelect={() => onSelect(p)}
          isFavorite={favorites.some(fav => fav.id === p.id)}
          onFavoriteClick={() => onFavoriteClick(p)}
        />
      ))}
    </div>
  );
}