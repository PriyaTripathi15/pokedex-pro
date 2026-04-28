export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  const maxVisible = 5;
  const halfVisible = Math.floor(maxVisible / 2);

  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  if (startPage > 1) pages.push(1);
  if (startPage > 2) pages.push('...');

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages - 1) pages.push('...');
  if (endPage < totalPages) pages.push(totalPages);

  return (
    <div className="flex items-center justify-center gap-2 mt-8 flex-wrap animate-fadeIn">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg border border-yellow-400/20 bg-red-500 px-4 py-2 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35 disabled:hover:translate-y-0"
      >
        ← Previous
      </button>

      {pages.map((page, idx) => (
        <button
          key={idx}
          onClick={() => page !== '...' && onPageChange(page)}
          disabled={page === '...'}
          className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
            page === currentPage
              ? 'bg-yellow-300 text-[#0b0b10] font-bold shadow-[0_8px_20px_rgba(255,215,0,0.2)]'
              : page === '...'
              ? 'cursor-not-allowed bg-white/5 text-white/35'
              : 'border border-yellow-400/15 bg-white/5 text-yellow-100 hover:bg-yellow-300 hover:text-[#0b0b10]'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg border border-yellow-400/20 bg-red-500 px-4 py-2 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35 disabled:hover:translate-y-0"
      >
        Next →
      </button>
    </div>
  );
}