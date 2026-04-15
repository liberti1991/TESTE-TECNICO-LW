'use client';

import Header from '@/components/Header';
import Paginacao from '@/components/Paginacao';
import Toast from '@/components/Toast';
import VeiculoCard from '@/components/VeiculoCard';
import { usePaginacao } from '@/hooks/usePaginacao';
import { useToast } from '@/hooks/useToast';
import api, { API_PREFIX, RespostaPaginada, Veiculo } from '@/lib/api';
import { estaAutenticado } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const { toast, mostrarToast, fecharToast } = useToast();
  const {
    paginaAtual,
    limite,
    totalRegistros,
    totalPaginas,
    setTotalRegistros,
    mudarPagina,
  } = usePaginacao();

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
    setErro('');
    fecharToast();

    try {
      const { data } = await api.get<RespostaPaginada<Veiculo>>(
        `${API_PREFIX}/veiculos?page=${paginaAtual}&limit=${limite}`,
      );
      setVeiculos(data.data);
      setTotalRegistros(data.total);
    } catch {
      setErro('Erro ao carregar veículos. Tente novamente.');
      setVeiculos([]);
      setTotalRegistros(0);
      mostrarToast({
        tipo: 'erro',
        titulo: 'Não foi possível carregar',
        mensagem: 'Erro ao carregar veículos. Tente novamente.',
      });
    } finally {
      setCarregando(false);
    }
  }

  const veiculosFiltrados = veiculos.filter(
    (v) =>
      v.placa.toLowerCase().includes(busca.toLowerCase()) ||
      v.proprietario.toLowerCase().includes(busca.toLowerCase()) ||
      v.modelo.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {toast && (
        <Toast
          tipo={toast.tipo}
          titulo={toast.titulo}
          mensagem={toast.mensagem}
        />
      )}

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Veículos</h2>
            <p className="mt-0.5 text-sm text-gray-500">{totalRegistros} veículos cadastrados</p>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por placa, proprietário ou modelo..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {carregando ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: limite }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-lg border border-gray-200 bg-white p-4" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {veiculosFiltrados.map((v) => (
                <VeiculoCard key={v.id} veiculo={v} />
              ))}
            </div>

            {veiculosFiltrados.length === 0 && !erro && (
              <p className="py-10 text-center text-gray-500">Nenhum veículo encontrado.</p>
            )}

            {erro && (
              <p className="py-10 text-center text-gray-500">Não foi possível carregar os veículos no momento.</p>
            )}

            {!erro && (
              <div className="mt-6 space-y-2">
                <Paginacao
                  paginaAtual={paginaAtual}
                  totalPaginas={totalPaginas}
                  onMudar={mudarPagina}
                />
                <p className="text-center text-xs text-gray-400">
                  Página {paginaAtual} de {totalPaginas}
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
