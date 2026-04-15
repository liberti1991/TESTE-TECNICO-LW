'use client';

import { DebitoCalculado } from '@/lib/api';

interface Props {
  debitos: DebitoCalculado[];
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
  const data = new Date(dataStr);
  return data.toLocaleDateString('pt-BR');
}

export default function DebitosList({ debitos }: Props) {
  if (debitos.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Nenhum débito encontrado para este veículo.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {debitos.map((debito) => (
        <div
          key={debito.id}
          className="bg-white border border-gray-200 rounded-lg p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-700">
                  {LABELS_TIPO[debito.tipo] || debito.tipo}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${CORES_STATUS[debito.status]}`}
                >
                  {debito.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">{debito.descricao}</p>
              <p className="text-xs text-gray-400 mt-1">
                Vencimento: {formatarData(debito.vencimento)}
              </p>
            </div>
            <div className="text-right ml-4">
              <p className="text-base font-bold text-gray-900">
                {formatarMoeda(debito.valor_total)}
              </p>
              {debito.valor_multa > 0 && (
                <p className="text-xs text-red-500">
                  + {formatarMoeda(debito.valor_multa)} multa
                </p>
              )}
              {debito.valor_juros > 0 && (
                <p className="text-xs text-orange-500">
                  + {formatarMoeda(debito.valor_juros)} juros
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
