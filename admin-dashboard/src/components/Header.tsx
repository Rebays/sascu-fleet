'use client';
import { Bell, Menu } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [notifications] = useState(3);

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between print:hidden">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 p-2 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Welcome back, Admin
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
          A
        </div>
      </div>
    </header>
  );
}