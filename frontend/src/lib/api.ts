import axios from 'axios';
import Cookies from 'js-cookie';

export const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || '/api';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url as string | undefined;
    const isLoginRequest = requestUrl?.includes(`${API_PREFIX}/auth/login`);

    if (status === 401 && !isLoginRequest) {
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Tipos espelhando o backend
export interface Veiculo {
  id: number;
  placa: string;
  renavam: string;
  proprietario: string;
  modelo: string;
  ano: number;
  cor: string;
  criadoEm: string;
}

export interface DebitoCalculado {
  id: number;
  veiculoId: number;
  tipo: 'IPVA' | 'MULTA' | 'LICENCIAMENTO' | 'DPVAT';
  descricao: string;
  valor: number;
  percentualMulta: number;
  percentualJuros: number;
  valorMulta: number;
  valorJuros: number;
  valorTotal: number;
  vencimento: string;
  status: 'PENDENTE' | 'PAGO' | 'VENCIDO';
  criadoEm: string;
}

export interface RespostaPaginada<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
