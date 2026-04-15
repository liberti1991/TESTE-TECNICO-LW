'use client';

import { useMemo, useState } from 'react';

interface UsePaginacaoOptions {
  limiteInicial?: number;
}

interface UsePaginacaoResult {
  paginaAtual: number;
  limite: number;
  totalRegistros: number;
  totalPaginas: number;
  setTotalRegistros: (total: number) => void;
  mudarPagina: (pagina: number) => void;
  proximaPagina: () => void;
  paginaAnterior: () => void;
}

export function usePaginacao(
  options: UsePaginacaoOptions = {},
): UsePaginacaoResult {
  const { limiteInicial = 4 } = options;
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);

  const totalPaginas = useMemo(
    () => Math.max(1, Math.ceil(totalRegistros / limiteInicial)),
    [limiteInicial, totalRegistros],
  );

  function mudarPagina(pagina: number): void {
    if (pagina < 1 || pagina > totalPaginas || pagina === paginaAtual) {
      return;
    }

    setPaginaAtual(pagina);
  }

  function proximaPagina(): void {
    mudarPagina(paginaAtual + 1);
  }

  function paginaAnterior(): void {
    mudarPagina(paginaAtual - 1);
  }

  return {
    paginaAtual,
    limite: limiteInicial,
    totalRegistros,
    totalPaginas,
    setTotalRegistros,
    mudarPagina,
    proximaPagina,
    paginaAnterior,
  };
}
