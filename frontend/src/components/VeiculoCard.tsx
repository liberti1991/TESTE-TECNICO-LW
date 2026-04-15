'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Veiculo, DebitoCalculado, RespostaPaginada } from '@/lib/api';
import api, { API_PREFIX } from '@/lib/api';

interface Props {
  veiculo: Veiculo;
}

export default function VeiculoCard({ veiculo }: Props) {
  const [totalDebitos, setTotalDebitos] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    setCarregando(true);
    api
      .get<RespostaPaginada<DebitoCalculado>>(`${API_PREFIX}/debitos/veiculo/${veiculo.placa}`)
      .then(({ data }) => {
        const pendentes = (data as unknown as DebitoCalculado[]).filter(
          (d) => d.status === 'PENDENTE' || d.status === 'VENCIDO'
        );
        setTotalDebitos(pendentes.length);
      })
      .catch(() => setTotalDebitos(0))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-lg font-bold font-mono tracking-wider text-blue-700">
            {veiculo.placa}
          </span>
          <p className="text-gray-700 font-medium mt-0.5">{veiculo.modelo} {veiculo.ano}</p>
          <p className="text-sm text-gray-500">{veiculo.proprietario}</p>
          <p className="text-xs text-gray-400 mt-1">{veiculo.cor}</p>
        </div>
        <div className="text-right">
          {carregando ? (
            <span className="text-xs text-gray-400">Carregando...</span>
          ) : (
            <span
              className={`text-sm font-semibold ${
                totalDebitos && totalDebitos > 0 ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {totalDebitos === 0 ? 'Sem débitos' : `${totalDebitos} débito(s)`}
            </span>
          )}
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100">
        <Link
          href={`/veiculo/${veiculo.placa}`}
          className="text-sm text-blue-600 hover:underline"
        >
          Ver détalhes →
        </Link>
      </div>
    </div>
  );
}
