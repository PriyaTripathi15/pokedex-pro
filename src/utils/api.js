const API_BASE_URL = import.meta.env.VITE_POKEMON_API_BASE_URL || 'https://pokeapi.co/api/v2';
const API_KEY = import.meta.env.VITE_POKEMON_API_KEY;

const buildHeaders = () => {
  const headers = {};

  if (API_KEY) {
    headers.Authorization = `Bearer ${API_KEY}`;
  }

  return headers;
};

export const fetchPokemonList = async (limit = 20, offset = 0) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`, {
      headers: buildHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch pokemon list');
    return await response.json();
  } catch (error) {
    console.error('Error fetching pokemon list:', error);
    throw error;
  }
};

export const fetchPokemonDetails = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pokemon/${id}`, {
      headers: buildHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch pokemon details');
    return await response.json();
  } catch (error) {
    console.error('Error fetching pokemon details:', error);
    throw error;
  }
};

export const fetchAllTypes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/type`, {
      headers: buildHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch types');
    return await response.json();
  } catch (error) {
    console.error('Error fetching types:', error);
    throw error;
  }
};

export const fetchPokemonByType = async (typeName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/type/${typeName}`, {
      headers: buildHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch pokemon by type');
    const data = await response.json();
    return data.pokemon.map(p => p.pokemon);
  } catch (error) {
    console.error('Error fetching pokemon by type:', error);
    throw error;
  }
};

export const searchPokemon = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pokemon/${query.toLowerCase()}`, {
      headers: buildHeaders(),
    });
    if (!response.ok) throw new Error('Pokemon not found');
    return await response.json();
  } catch (error) {
    console.error('Error searching pokemon:', error);
    throw error;
  }
};