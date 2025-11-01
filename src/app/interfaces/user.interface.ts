export interface User {
  _id?: string;
  nombreCompleto: string;
  email: string;
  edad?: number;
  activo?: boolean;
  fechaCreacion?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}