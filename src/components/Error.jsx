export default function Error({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-4 text-lg font-semibold text-yellow-300">⚠️ Error</div>
      <p className="mb-6 text-center text-yellow-100/70">{message || 'Something went wrong. Please try again.'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-red-500 px-6 py-2 text-white transition-colors hover:bg-red-600"
        >
          Retry
        </button>
      )}
    </div>
  );
}