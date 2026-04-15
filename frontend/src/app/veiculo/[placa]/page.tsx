'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api, { API_PREFIX, Veiculo, DebitoCalculado } from '@/lib/api';
import { estaAutenticado } from '@/lib/auth';
import Header from '@/components/Header';
import DebitosList from '@/components/DebitosList';
import Link from 'next/link';

export default function VeiculoPage() {
  const router = useRouter();
  const params = useParams();
  const placa = params.placa as string;

  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [debitos, setDebitos] = useState<DebitoCalculado[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!estaAutenticado()) {
      router.push('/login');
      return;
    }

    async function carregar() {
      try {
        const [resVeiculo, resDebitos] = await Promise.all([
          api.get<Veiculo>(`${API_PREFIX}/veiculos/${placa}`),
          api.get<DebitoCalculado[]>(`${API_PREFIX}/debitos/veiculo/${placa}`),
        ]);
        setVeiculo(resVeiculo.data);
        setDebitos(resDebitos.data);
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        setErro(status === 404 ? 'Veículo não encontrado' : 'Erro ao carregar dados');
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [placa, router]);

  const debitosPendentes = debitos.filter((d) => d.status !== 'PAGO');
  const valorTotal = debitosPendentes.reduce((acc, d) => acc + d.valor_total, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
          ← Voltar para lista
        </Link>

        {carregando ? (
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-white rounded-lg border border-gray-200" />
            <div className="h-48 bg-white rounded-lg border border-gray-200" />
          </div>
        ) : erro ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {erro}
          </div>
        ) : veiculo ? (
          <>
            {/* Dados do veículo */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold font-mono tracking-widest text-blue-700">
                    {veiculo.placa}
                  </h2>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {veiculo.modelo} — {veiculo.ano}
                  </p>
                  <p className="text-gray-600">{veiculo.proprietario}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    RENAVAM: {veiculo.renavam} · {veiculo.cor}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total em aberto</p>
                  <p className="text-2xl font-bold text-red-600">
                    {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                  <p className="text-xs text-gray-400">{debitosPendentes.length} débito(s)</p>
                </div>
              </div>
            </div>

            {/* Lista de débitos */}
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Débitos</h3>
            <DebitosList debitos={debitos} />
          </>
        ) : null}
      </main>
    </div>
  );
}
