'use client';

interface Props {
  tipo: 'sucesso' | 'erro';
  titulo: string;
  mensagem: string;
  onClose: () => void;
}

export default function Toast({ tipo, titulo, mensagem, onClose }: Props) {
  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 w-full max-w-sm px-4 sm:px-0">
      <div
        className={
          tipo === 'sucesso'
            ? 'pointer-events-auto rounded-xl border border-green-200 bg-white p-4 shadow-lg shadow-green-100/70'
            : 'pointer-events-auto rounded-xl border border-red-200 bg-white p-4 shadow-lg shadow-red-100/70'
        }
      >
        <div className="flex items-start gap-3">
          <div
            className={
              tipo === 'sucesso'
                ? 'mt-1 h-2.5 w-2.5 rounded-full bg-green-500'
                : 'mt-1 h-2.5 w-2.5 rounded-full bg-red-500'
            }
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">{titulo}</p>
            <p className="mt-1 text-sm text-gray-600">{mensagem}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="pointer-events-auto text-xs font-medium text-gray-400 transition hover:text-gray-600"
            aria-label="Fechar notificação"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
