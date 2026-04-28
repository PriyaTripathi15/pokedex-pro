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
        aria-label="Search Pokémon"
        placeholder="Search Pokémon by name..."
        value={query}
        onChange={handleChange}
        className="w-full rounded-lg border border-yellow-400/20 bg-[#111118] px-4 py-3 pl-10 text-yellow-50 placeholder:text-yellow-100/40 transition-colors focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/30"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-300" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
          <circle cx="11" cy="11" r="6" stroke="currentColor" />
        </svg>
      </span>
      {query && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full text-yellow-100/70 hover:text-yellow-300 hover:bg-yellow-500/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>
      )}
    </div>
  );
}