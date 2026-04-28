import { useState, useEffect } from 'react';

export default function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pokemonFavorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

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