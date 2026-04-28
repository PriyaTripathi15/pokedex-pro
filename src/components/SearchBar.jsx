import { useEffect, useState } from 'react';

export default function SearchBar({ value = '', onSearch }) {
  const [query, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search Pokémon by name..."
        value={query}
        onChange={handleChange}
        className="w-full rounded-lg border border-yellow-400/20 bg-[#111118] px-4 py-3 pl-10 text-yellow-50 placeholder:text-yellow-100/40 transition-colors focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/30"
      />
      <span className="absolute left-3 top-3 text-xl text-yellow-300">🔍</span>
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-3 text-yellow-100/50 hover:text-yellow-300"
        >
          ✕
        </button>
      )}
    </div>
  );
}