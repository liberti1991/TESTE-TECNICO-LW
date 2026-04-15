'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api, { API_PREFIX, Veiculo, RespostaPaginada } from '@/lib/api';
import { estaAutenticado } from '@/lib/auth';
import Header from '@/components/Header';
import VeiculoCard from '@/components/VeiculoCard';

export default function HomePage() {
  const router = useRouter();
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');

  // FEATURE FALTANDO: Os estados de paginação abaixo existem mas não há componente
  // de paginação implementado. A API retorna { data, total, page, limit }
  // mas o frontend ignora `total` e não oferece navegação entre páginas.
  const [paginaAtual] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const LIMITE = 5;

  useEffect(() => {
    if (!estaAutenticado()) {
      router.push('/login');
      return;
    }
    carregarVeiculos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginaAtual]);

  async function carregarVeiculos() {
    setCarregando(true);
    try {
      const { data } = await api.get<RespostaPaginada<Veiculo>>(
        `${API_PREFIX}/veiculos?page=${paginaAtual}&limit=${LIMITE}`
      );
      setVeiculos(data.data);
      setTotalRegistros(data.total);
    } catch {
      setErro('Erro ao carregar veículos. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  const veiculosFiltrados = veiculos.filter(
    (v) =>
      v.placa.toLowerCase().includes(busca.toLowerCase()) ||
      v.proprietario.toLowerCase().includes(busca.toLowerCase()) ||
      v.modelo.toLowerCase().includes(busca.toLowerCase())
  );

  const totalPaginas = Math.ceil(totalRegistros / LIMITE);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Veículos</h2>
            <p className="text-sm text-gray-500 mt-0.5">{totalRegistros} veículos cadastrados</p>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por placa, proprietário ou modelo..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
            {erro}
          </div>
        )}

        {carregando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: LIMITE }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse h-28" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {veiculosFiltrados.map((v) => (
                <VeiculoCard key={v.id} veiculo={v} />
              ))}
            </div>

            {veiculosFiltrados.length === 0 && !carregando && (
              <p className="text-center text-gray-500 py-10">Nenhum veículo encontrado.</p>
            )}

            {/* FEATURE FALTANDO: Implementar componente de paginação aqui.
                Use as variáveis `paginaAtual`, `totalPaginas` e `setPaginaAtual`
                para renderizar os controles de navegação. */}
            <div className="mt-6 flex justify-center">
              <p className="text-xs text-gray-400">
                Página {paginaAtual} de {totalPaginas} — paginação não implementada
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
