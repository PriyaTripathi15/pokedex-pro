import { useState, useEffect } from 'react';
import { fetchPokemonList, fetchPokemonDetails } from './utils/api';
import useFavorites from './hooks/useFavorites';
import useAuth from './hooks/useAuth';
import Navbar from './components/Navbar';
import LoginScreen from './components/LoginScreen';
import SearchBar from './components/SearchBar';
import TypeFilter from './components/TypeFilter';
import PokemonGrid from './components/PokemonGrid';
import Pagination from './components/Pagination';
import Modal from './components/Modal';
import Error from './components/Error';

export default function App({ initialAuthUser = null, isSSRMode = false } = {}) {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { user, configured, signIn, signOut } = useAuth(initialAuthUser, {
    enableServerAuth: isSSRMode,
  });

  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredPokemon.length / itemsPerPage);

  const normalizeSearchText = (value) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');

  const getEditDistance = (left, right) => {
    if (left === right) return 0;
    if (!left) return right.length;
    if (!right) return left.length;

    const rows = Array.from({ length: right.length + 1 }, (_, index) => [index]);
    for (let row = 1; row <= right.length; row += 1) {
      rows[row][0] = row;
      for (let column = 1; column <= left.length; column += 1) {
        const substitutionCost = left[column - 1] === right[row - 1] ? 0 : 1;
        rows[row][column] = Math.min(
          rows[row - 1][column] + 1,
          rows[row][column - 1] + 1,
          rows[row - 1][column - 1] + substitutionCost
        );
      }
    }

    return rows[right.length][left.length];
  };

  const isSubsequenceMatch = (query, target) => {
    if (!query) return false;

    let queryIndex = 0;

    for (let targetIndex = 0; targetIndex < target.length && queryIndex < query.length; targetIndex += 1) {
      if (query[queryIndex] === target[targetIndex]) {
        queryIndex += 1;
      }
    }

    return queryIndex === query.length;
  };

  const getPokemonSearchScore = (pokemonName, query) => {
    const normalizedName = normalizeSearchText(pokemonName);
    const normalizedQuery = normalizeSearchText(query);

    if (!normalizedQuery) return 0;
    if (normalizedName === normalizedQuery) return 100;
    if (normalizedName.startsWith(normalizedQuery)) return 90;
    if (normalizedName.includes(normalizedQuery)) return 80;
    if (isSubsequenceMatch(normalizedQuery, normalizedName)) return 70;

    const distance = getEditDistance(normalizedName, normalizedQuery);
    const tolerance = normalizedQuery.length <= 4 ? 1 : normalizedQuery.length <= 7 ? 3 : 4;

    return distance <= tolerance ? 70 - distance : 0;
  };

  const matchesPokemonQuery = (pokemonEntry, query) => {
    const normalizedQuery = normalizeSearchText(query);
    const searchFields = [
      pokemonEntry.name,
      ...(pokemonEntry.types || []),
      ...(pokemonEntry.abilities || []),
    ].map(normalizeSearchText);

    return searchFields.some(field => {
      if (!field || !normalizedQuery) return false;

      if (field === normalizedQuery) return true;
      if (field.startsWith(normalizedQuery)) return true;
      if (field.includes(normalizedQuery)) return true;
      return isSubsequenceMatch(normalizedQuery, field);
    });
  };

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
      const rankedResults = result
        .map(p => ({
          pokemon: p,
          score: matchesPokemonQuery(p, searchQuery)
            ? Math.max(
                getPokemonSearchScore(p.name, searchQuery),
                getPokemonSearchScore(p.types?.join(' ') || '', searchQuery) - 10,
                getPokemonSearchScore(p.abilities?.join(' ') || '', searchQuery) - 20
              )
            : 0,
        }))
        .filter(entry => entry.score > 0)
        .sort((left, right) => right.score - left.score || left.pokemon.id - right.pokemon.id);

      result = rankedResults.map(entry => entry.pokemon);
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

  if (!user) {
    return (
      <LoginScreen
        onGoogleLogin={() => signIn('google')}
        onGithubLogin={() => signIn('github')}
        configured={configured}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(220,20,60,0.18),_transparent_36%),linear-gradient(180deg,_#09090e_0%,_#101016_45%,_#18111a_100%)] text-yellow-50">
      <Navbar favoriteCount={favorites.length} user={user} onSignOut={signOut} />

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
        <div key={`${currentPage}-${filteredPokemon.length}-${searchQuery}-${selectedTypes.join(',')}`} className="animate-fadeIn">
          <PokemonGrid
            pokemon={currentPokemon}
            loading={loading}
            onSelect={loadPokemonDetails}
            favorites={favorites}
            onFavoriteClick={handleFavorite}
          />
        </div>

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