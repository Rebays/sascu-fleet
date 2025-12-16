'use client';
import { Bell, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [notifications] = useState(3);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between print:hidden">
      <div className="flex items-center gap-4">
        <button className="lg:hidden">
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome back, Admin
        </h2>
      </div>

      <div className="flex items-center gap-4">
       
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          A
        </div>
      </div>
    </header>
  );
}