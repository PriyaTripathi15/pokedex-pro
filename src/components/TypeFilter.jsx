import { useEffect, useState } from 'react';
import { fetchAllTypes } from '../utils/api';
import Loader from './Loader';

export default function TypeFilter({ onTypeToggle = () => {}, selectedTypes = [] }) {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const data = await fetchAllTypes();
        setTypes(data.results || []);
      } catch (error) {
        console.error('Failed to load types:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTypes();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-sm font-semibold text-yellow-100">Filter by Type:</h3>
        <button
          onClick={() => onTypeToggle(null)}
          className="px-3 py-1.5 rounded-full text-sm font-medium border border-yellow-400/20 bg-white/5 text-yellow-100 transition-colors hover:bg-red-500 hover:text-white"
        >
          Clear type filters
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {types.map(type => {
          const isSelected = selectedTypes.includes(type.name);

          return (
            <button
              key={type.name}
              onClick={() => onTypeToggle(type.name)}
              aria-pressed={isSelected}
              className={`px-3 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 border ${
                isSelected
                  ? 'bg-red-500 text-white border-red-400 shadow-[0_10px_25px_rgba(220,20,60,0.22)] scale-[1.02]'
                  : 'bg-white/5 text-yellow-100 border-yellow-400/15 hover:bg-yellow-300 hover:text-[#0b0b10] hover:border-yellow-300'
              }`}
            >
              {type.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}