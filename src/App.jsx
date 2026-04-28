import { useState, useEffect } from 'react';
import { fetchPokemonList, fetchPokemonDetails } from './utils/api';
import useFavorites from './hooks/useFavorites';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import TypeFilter from './components/TypeFilter';
import PokemonGrid from './components/PokemonGrid';
import Pagination from './components/Pagination';
import Modal from './components/Modal';
import Error from './components/Error';

export default function App() {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredPokemon.length / itemsPerPage);

  // Initial load
  useEffect(() => {
    loadInitialPokemon();
  }, []);

  useEffect(() => {
    let result = [...pokemon];

    if (selectedTypes.length > 0) {
      result = result.filter(p =>
        selectedTypes.some(type => p.types?.includes(type))
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(p => p.name.toLowerCase().includes(query));
    }

    setFilteredPokemon(result);
    setCurrentPage(1);
  }, [pokemon, searchQuery, selectedTypes]);

  // Load all pokemon
  const loadInitialPokemon = async () => {
    setLoading(true);
    setError(null);
    try {
      const allPokemon = [];
      // Fetch all pokemon (895 total but we'll load first 200 for performance)
      for (let i = 0; i < 10; i++) {
        const data = await fetchPokemonList(20, i * 20);
        allPokemon.push(...data.results);
      }
      
      // Enrich with details
      const enriched = await Promise.all(
        allPokemon.map(async (p) => {
          try {
            const details = await fetchPokemonDetails(p.name);
            return {
              id: details.id,
              name: details.name,
              image: details.sprites?.other?.['official-artwork']?.front_default,
              types: details.types?.map(t => t.type.name) || [],
              stats: details.stats?.map(s => ({
                name: s.stat.name,
                value: s.base_stat
              })) || [],
              abilities: details.abilities?.map(a => a.ability.name) || [],
              height: details.height,
              weight: details.weight,
              hp: details.stats?.[0]?.base_stat || 0
            };
          } catch (err) {
            return {
              id: p.id || Math.random(),
              name: p.name,
              image: null,
              types: [],
              stats: [],
              abilities: []
            };
          }
        })
      );

      setPokemon(enriched);
      setFilteredPokemon(enriched);
    } catch (err) {
      setError('Failed to load Pokemon. Please refresh the page.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handle type filter
  const handleTypeToggle = (typeName) => {
    setSelectedTypes(prev => {
      if (typeName === null) {
        return [];
      }

      return prev.includes(typeName)
        ? prev.filter(type => type !== typeName)
        : [...prev, typeName];
    });
  };

  const removeType = (typeName) => {
    setSelectedTypes(prev => prev.filter(type => type !== typeName));
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSearchQuery('');
  };

  // Load pokemon details
  const loadPokemonDetails = async (poke) => {
    setSelectedPokemon(poke);
    setDetailsLoading(true);
    try {
      const details = await fetchPokemonDetails(poke.id);
      setPokemonDetails({
        ...poke,
        stats: details.stats?.map(s => ({
          name: s.stat.name,
          value: s.base_stat
        })) || [],
        abilities: details.abilities?.map(a => a.ability.name) || [],
        height: details.height,
        weight: details.weight,
        image: details.sprites?.other?.['official-artwork']?.front_default || poke.image
      });
    } catch (err) {
      console.error('Failed to load details:', err);
      setPokemonDetails(poke);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Handle favorite
  const handleFavorite = (poke) => {
    if (isFavorite(poke.id)) {
      removeFavorite(poke.id);
    } else {
      addFavorite(poke);
    }
  };

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPokemon = filteredPokemon.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(220,20,60,0.18),_transparent_36%),linear-gradient(180deg,_#09090e_0%,_#101016_45%,_#18111a_100%)] text-yellow-50">
      <Navbar favoriteCount={favorites.length} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-yellow-100 mb-2">Find Your Favorite Pokémon</h2>
          <p className="text-yellow-100/70">Search, filter, and discover all 150+ Pokémon</p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 rounded-2xl border border-yellow-400/15 bg-white/5 p-6 shadow-[0_16px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="space-y-4">
            <SearchBar value={searchQuery} onSearch={handleSearch} />
            <TypeFilter onTypeToggle={handleTypeToggle} selectedTypes={selectedTypes} />

            {(searchQuery || selectedTypes.length > 0) && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                <span className="text-sm font-semibold text-yellow-100/75 mr-1">Active filters:</span>

                {searchQuery && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500 text-white text-sm font-medium capitalize shadow-[0_8px_20px_rgba(220,20,60,0.2)]">
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery('')} className="text-white/90 hover:text-white" aria-label="Clear search">
                      ×
                    </button>
                  </span>
                )}

                {selectedTypes.map(type => (
                  <span key={type} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-300 text-[#0b0b10] text-sm font-bold capitalize shadow-[0_8px_20px_rgba(255,215,0,0.12)]">
                    {type}
                    <button onClick={() => removeType(type)} className="text-[#0b0b10]/70 hover:text-[#0b0b10]" aria-label={`Remove ${type} filter`}>
                      ×
                    </button>
                  </span>
                ))}

                <button
                  onClick={clearAllFilters}
                  className="ml-auto rounded-full border border-yellow-400/20 bg-white/5 px-3 py-1 text-sm font-medium text-yellow-100 transition-colors hover:bg-yellow-300 hover:text-[#0b0b10]"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && <Error message={error} onRetry={loadInitialPokemon} />}

        {/* Pokemon Grid */}
        <PokemonGrid
          pokemon={currentPokemon}
          loading={loading}
          onSelect={loadPokemonDetails}
          favorites={favorites}
          onFavoriteClick={handleFavorite}
        />

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>

      {/* Detail Modal */}
      <Modal
        pokemon={pokemonDetails}
        onClose={() => {
          setSelectedPokemon(null);
          setPokemonDetails(null);
        }}
        loading={detailsLoading}
        isFavorite={pokemonDetails ? isFavorite(pokemonDetails.id) : false}
        onFavoriteClick={() => pokemonDetails && handleFavorite(pokemonDetails)}
      />
    </div>
  );
}