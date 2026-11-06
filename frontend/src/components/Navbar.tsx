import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const NavBar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Gestión de Personas y Domicilios
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Sistema Administrativo CRUD</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Botón Dark Mode */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Alternar modo oscuro"
          >
            {isDark ? 'Modo Claro' : 'Modo Oscuro'}
          </button>

          {/* Información de usuario */}
          {user && (
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium hidden sm:inline">
                {user.email}
              </span>
              <button
                onClick={logout}
                className="px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition"
              >
                Salir
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};