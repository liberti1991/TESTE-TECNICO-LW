import { arredondarMoeda } from './moeda.util';

interface CalcularDebitoParams {
  valor: number;
  percentualMulta: number;
  percentualJuros: number;
}

export interface DebitoCalculadoValores {
  valorBase: number;
  valorMulta: number;
  valorJuros: number;
  valorTotal: number;
}

export function calcularDebito({
  valor,
  percentualMulta,
  percentualJuros,
}: CalcularDebitoParams): DebitoCalculadoValores {
  const valorBase = arredondarMoeda(valor);
  const valorMulta = arredondarMoeda(valorBase * (percentualMulta / 100));
  const valorJuros = arredondarMoeda(valorBase * (percentualJuros / 100));
  const valorTotal = arredondarMoeda(valorBase + valorMulta + valorJuros);

  return {
    valorBase,
    valorMulta,
    valorJuros,
    valorTotal,
  };
}
