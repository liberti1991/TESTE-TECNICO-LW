'use client';

import { DebitoCalculado } from '@/lib/api';

interface Props {
  debitos: DebitoCalculado[];
  debitoQuitandoId: number | null;
  onQuitar: (id: number) => Promise<void>;
}

const LABELS_TIPO: Record<string, string> = {
  IPVA: 'IPVA',
  MULTA: 'Multa',
  LICENCIAMENTO: 'Licenciamento',
  DPVAT: 'DPVAT',
};

const CORES_STATUS: Record<string, string> = {
  PENDENTE: 'bg-yellow-100 text-yellow-800',
  PAGO: 'bg-green-100 text-green-800',
  VENCIDO: 'bg-red-100 text-red-800',
};

function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(dataStr: string): string {
  const [ano, mes, dia] = dataStr.split('-').map(Number);
  const data = new Date(ano, mes - 1, dia);
  return data.toLocaleDateString('pt-BR');
}

export default function DebitosList({ debitos, debitoQuitandoId, onQuitar }: Props) {
  if (debitos.length === 0) {
    return <div className="py-10 text-center text-gray-500">Nenhum débito encontrado para este veículo.</div>;
  }

  return (
    <div className="space-y-3">
      {debitos.map((debito) => (
        <div key={debito.id} className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">
                  {LABELS_TIPO[debito.tipo] || debito.tipo}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${CORES_STATUS[debito.status]}`}
                >
                  {debito.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">{debito.descricao}</p>
              <p className="mt-1 text-xs text-gray-400">Vencimento: {formatarData(debito.vencimento)}</p>
            </div>
            <div className="ml-4 text-right">
              <p className="text-base font-bold text-gray-900">{formatarMoeda(debito.valorTotal)}</p>
              {debito.valorMulta > 0 && (
                <p className="text-xs text-red-500">+ {formatarMoeda(debito.valorMulta)} multa</p>
              )}
              {debito.valorJuros > 0 && (
                <p className="text-xs text-orange-500">+ {formatarMoeda(debito.valorJuros)} juros</p>
              )}
              {debito.status !== 'PAGO' && (
                <button
                  type="button"
                  onClick={() => onQuitar(debito.id)}
                  disabled={debitoQuitandoId !== null}
                  className="mt-3 inline-flex min-w-24 items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                  {debitoQuitandoId === debito.id ? (
                    <span className="inline-flex items-center justify-center" aria-label="Carregando">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
                    </span>
                  ) : (
                    'Quitar'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
