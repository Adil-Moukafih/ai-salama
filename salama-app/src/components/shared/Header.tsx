'use client';

import { useTheme } from './ThemeProvider';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-header border-b border-app h-16">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 bg-hover rounded text-sm text-app-secondary hover:bg-opacity-90 transition-colors">
              <i className="fas fa-clock mr-1.5 text-[rgb(var(--color-primary))]"></i>Live
            </button>
            <button className="px-3 py-1.5 bg-hover rounded text-sm text-app-secondary hover:bg-opacity-90 transition-colors">
              <i className="fas fa-history mr-1.5 text-[rgb(var(--color-secondary))]"></i>24h
            </button>
            <button className="px-3 py-1.5 bg-hover rounded text-sm text-app-secondary hover:bg-opacity-90 transition-colors">
              <i className="fas fa-calendar-alt mr-1.5 text-[rgb(var(--color-success))]"></i>7d
            </button>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-6">
          {/* System Health */}
          <div className="flex items-center">
            <span className="text-sm text-app-secondary">System Health:</span>
            <div className="ml-2 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-[rgb(var(--color-success))]"></span>
              <span className="text-xs font-medium text-[rgb(var(--color-success))]">
                Excellent
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-1">
            <button className="p-2 hover:bg-hover rounded text-app-secondary hover:text-app-primary transition-colors relative">
              <i className="fas fa-bell"></i>
              <span className="absolute top-1 right-1 w-2 h-2 bg-[rgb(var(--color-danger))] rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-hover rounded text-app-secondary hover:text-app-primary transition-colors">
              <i className="fas fa-cog"></i>
            </button>
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-hover rounded text-app-secondary hover:text-app-primary transition-colors"
            >
              <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
            <div className="relative group">
              <button className="p-2 hover:bg-hover rounded text-app-secondary hover:text-app-primary transition-colors">
                <i className="fas fa-search"></i>
              </button>
              <div className="absolute right-0 top-full mt-1 w-64 bg-card rounded border border-app p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-hover border border-app text-app-primary rounded py-1.5 pl-8 pr-4 text-sm focus:outline-none focus:border-[rgb(var(--color-primary))] transition-colors input-glow"
                  />
                  <i className="fas fa-search absolute left-2.5 top-2.5 text-app-tertiary text-sm"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
