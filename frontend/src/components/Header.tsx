'use client';

import { useRouter } from 'next/navigation';
import { fazerLogout } from '@/lib/auth';

export default function Header() {
  const router = useRouter();

  function handleLogout() {
    fazerLogout();
    router.push('/login');
  }

  return (
    <header className="bg-blue-700 text-white shadow">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Consulta Veicular</h1>
        <button
          onClick={handleLogout}
          className="text-sm bg-blue-800 hover:bg-blue-900 px-3 py-1.5 rounded transition"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
