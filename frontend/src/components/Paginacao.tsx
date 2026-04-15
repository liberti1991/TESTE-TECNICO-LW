'use client';

interface Props {
  paginaAtual: number;
  totalPaginas: number;
  onMudar: (pagina: number) => void;
}

export default function Paginacao({ paginaAtual, totalPaginas, onMudar }: Props) {
  if (totalPaginas <= 1) {
    return null;
  }

  const paginas = Array.from({ length: totalPaginas }, (_, index) => index + 1);

  return (
    <nav className="mt-6 flex flex-wrap items-center justify-center gap-2" aria-label="Paginação de veículos">
      <button
        type="button"
        onClick={() => onMudar(paginaAtual - 1)}
        disabled={paginaAtual === 1}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-blue-400 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Anterior
      </button>

      {paginas.map((pagina) => {
        const ativa = pagina === paginaAtual;

        return (
          <button
            key={pagina}
            type="button"
            onClick={() => onMudar(pagina)}
            aria-current={ativa ? 'page' : undefined}
            className={
              ativa
                ? 'rounded-lg border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-semibold text-white'
                : 'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-blue-400 hover:text-blue-600'
            }
          >
            {pagina}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onMudar(paginaAtual + 1)}
        disabled={paginaAtual === totalPaginas}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-blue-400 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Próxima
      </button>
    </nav>
  );
}
