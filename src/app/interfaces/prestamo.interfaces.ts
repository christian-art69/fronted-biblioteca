import { ILibro } from './libro.interfaces';
import { IUsuario } from './usuario.interfaces';

export interface IPrestamo {
  _id: string;
  usuario: IUsuario;
  libro: ILibro;
  fechaPrestamo: string | Date;
  fechaDevolucion?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ICrearPrestamo {
  usuario: string;
  libro: string;
  fechaPrestamo: string | Date | null;
  fechaDevolucion?: string | Date | null;
}