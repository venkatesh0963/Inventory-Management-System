import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiMenu, FiMoon, FiSun, FiUser } from 'react-icons/fi';

const TopNav = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, darkMode, toggleDarkMode } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-surface dark:bg-dark-surface border-b border-slate-200 dark:border-dark-border shadow-sm">
      <div className="flex items-center">
        <button
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white lg:hidden mr-4"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FiMenu className="w-6 h-6" />
        </button>
        
        {/* Breadcrumb or Title could go here */}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-dark-border">
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400">
            <FiUser />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
