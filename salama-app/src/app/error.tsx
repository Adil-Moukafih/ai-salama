'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900">
      <div className="glass-morph rounded-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Something went wrong!</h2>
          <p className="text-gray-400 mb-6">{error.message}</p>
        </div>
        <button
          onClick={reset}
          className="w-full bg-blue-600 text-white rounded-lg py-3 px-4 hover:bg-blue-500 transition-all btn-hover flex items-center justify-center group"
        >
          <i className="fas fa-redo mr-2"></i>
          Try again
        </button>
      </div>
    </div>
  );
}
