'use client';

import DebitosList from '@/components/DebitosList';
import Toast from '@/components/Toast';
import Header from '@/components/Header';
import api, { API_PREFIX, DebitoCalculado, Veiculo } from '@/lib/api';
import { estaAutenticado } from '@/lib/auth';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Feedback {
  tipo: 'sucesso' | 'erro';
  texto: string;
}

interface ErroApi {
  response?: {
    status?: number;
    data?: {
      message?: string | string[];
    };
  };
}

function extrairMensagemErro(err: unknown, fallback: string): string {
  const message = (err as ErroApi)?.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(', ');
  }

  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  return fallback;
}

function montarNomeDebito(debito?: DebitoCalculado): string {
  if (!debito) {
    return 'Débito selecionado';
  }

  return `${debito.tipo} - ${debito.descricao}`;
}

export default function VeiculoPage() {
  const router = useRouter();
  const params = useParams();
  const placa = params.placa as string;

  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [debitos, setDebitos] = useState<DebitoCalculado[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [debitoQuitandoId, setDebitoQuitandoId] = useState<number | null>(null);

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
        const status = (err as ErroApi)?.response?.status;
        setErro(status === 404 ? 'Veículo não encontrado' : 'Erro ao carregar dados');
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [placa, router]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setFeedback(null);
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [feedback]);

  async function quitarDebito(id: number): Promise<void> {
    const debitoSelecionado = debitos.find((debito) => debito.id === id);
    const nomeDebito = montarNomeDebito(debitoSelecionado);

    setDebitoQuitandoId(id);
    setFeedback(null);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 1000)); // Simula atraso para melhor UX

      await api.patch(`${API_PREFIX}/debitos/${id}/quitar`);
      const { data } = await api.get<DebitoCalculado[]>(`${API_PREFIX}/debitos/veiculo/${placa}`);
      setDebitos(data);
      setFeedback({ tipo: 'sucesso', texto: `${nomeDebito} quitado com sucesso.` });
    } catch (err: unknown) {
      setFeedback({
        tipo: 'erro',
        texto: extrairMensagemErro(err, `Não foi possível quitar ${nomeDebito.toLowerCase()}.`),
      });
    } finally {
      setDebitoQuitandoId(null);
    }
  }

  const debitosPendentes = debitos.filter((d) => d.status !== 'PAGO');
  const valorTotal = debitosPendentes.reduce((acc, d) => acc + d.valorTotal, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {feedback && (
        <Toast
          tipo={feedback.tipo}
          titulo={feedback.tipo === 'sucesso' ? 'Débito atualizado' : 'Não foi possível concluir'}
          mensagem={feedback.texto}
          onClose={() => setFeedback(null)}
        />
      )}

      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/" className="mb-4 inline-block text-sm text-blue-600 hover:underline">
          ← Voltar para lista
        </Link>

        {carregando ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-32 rounded-lg border border-gray-200 bg-white" />
            <div className="h-48 rounded-lg border border-gray-200 bg-white" />
          </div>
        ) : erro ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </div>
        ) : veiculo ? (
          <>
            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-mono text-3xl font-bold tracking-widest text-blue-700">
                    {veiculo.placa}
                  </h2>
                  <p className="mt-1 text-lg font-semibold text-gray-800">
                    {veiculo.modelo} — {veiculo.ano}
                  </p>
                  <p className="text-gray-600">{veiculo.proprietario}</p>
                  <p className="mt-1 text-sm text-gray-400">
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

            <h3 className="mb-3 text-lg font-semibold text-gray-700">Débitos</h3>
            <DebitosList
              debitos={debitos}
              debitoQuitandoId={debitoQuitandoId}
              onQuitar={quitarDebito}
            />
          </>
        ) : null}
      </main>
    </div>
  );
}
