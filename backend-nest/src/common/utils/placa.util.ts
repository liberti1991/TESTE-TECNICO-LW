export const PLACA_REGEX = /^[A-Z]{3}\d[A-Z0-9]\d{2}$/;
export const PLACA_INVALIDA_MESSAGE = 'Placa inválida. Formatos aceitos: ABC1234 ou ABC1D23';

export function normalizarPlaca(placa: string): string {
  return placa.trim().toUpperCase();
}

export function placaValida(placa: string): boolean {
  return PLACA_REGEX.test(normalizarPlaca(placa));
}
