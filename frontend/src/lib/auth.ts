import Cookies from 'js-cookie';
import api, { API_PREFIX } from './api';

export async function fazerLogin(email: string, senha: string): Promise<void> {
  const { data } = await api.post<{ token: string }>(`${API_PREFIX}/auth/login`, { email, senha });
  Cookies.set('token', data.token, { expires: 1, sameSite: 'strict' });
}

export function fazerLogout(): void {
  Cookies.remove('token');
}

export function estaAutenticado(): boolean {
  return !!Cookies.get('token');
}
