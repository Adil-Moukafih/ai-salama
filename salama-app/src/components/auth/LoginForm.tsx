'use client';

import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="glass-morph rounded-2xl p-8 w-full max-w-md login-animation" style={{ animationDelay: '0.3s' }}>
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">Welcome Back</h2>
        <p className="text-gray-400">Enter your credentials to access the system</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-gray-300 text-sm font-medium mb-2">
            Username
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">
              <i className="fas fa-user"></i>
            </span>
            <input
              id="username"
              type="text"
              className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg py-2.5 pl-10 pr-4 input-glow transition-shadow focus:outline-none focus:border-blue-500"
              placeholder="Enter your username"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">
              <i className="fas fa-lock"></i>
            </span>
            <input
              id="password"
              type="password"
              className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg py-2.5 pl-10 pr-4 input-glow transition-shadow focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 bg-gray-800 border-gray-700 rounded"
            />
            <span className="ml-2 text-sm text-gray-400">Remember me</span>
          </label>
          <button 
            type="button" 
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Forgot password?
          </button>
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg py-3 px-4 hover:bg-blue-500 transition-colors flex items-center justify-center"
        >
          <i className="fas fa-sign-in-alt mr-2"></i>
          Login
        </button>
      </form>
    </div>
  );
}
