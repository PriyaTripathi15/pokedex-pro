import { useState, useEffect } from 'react';

export default function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    if (typeof window === 'undefined') return [];

    try {
      const saved = window.localStorage.getItem('pokemonFavorites');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      window.localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites]);

  const addFavorite = (pokemon) => {
    setFavorites(prev => {
      const exists = prev.some(p => p.id === pokemon.id);
      if (exists) return prev;
      return [...prev, pokemon];
    });
  };

  const removeFavorite = (pokemonId) => {
    setFavorites(prev => prev.filter(p => p.id !== pokemonId));
  };

  const isFavorite = (pokemonId) => {
    return favorites.some(p => p.id === pokemonId);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  };
}