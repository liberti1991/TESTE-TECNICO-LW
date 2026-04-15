'use client';

import { useEffect, useState } from 'react';

export interface ToastData {
  tipo: 'sucesso' | 'erro';
  titulo: string;
  mensagem: string;
}

interface UseToastOptions {
  duracaoMs?: number;
}

interface UseToastResult {
  toast: ToastData | null;
  mostrarToast: (dados: ToastData) => void;
  fecharToast: () => void;
}

export function useToast(options: UseToastOptions = {}): UseToastResult {
  const { duracaoMs = 3500 } = options;
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, duracaoMs);

    return () => window.clearTimeout(timeout);
  }, [duracaoMs, toast]);

  function mostrarToast(dados: ToastData): void {
    setToast(dados);
  }

  function fecharToast(): void {
    setToast(null);
  }

  return { toast, mostrarToast, fecharToast };
}
