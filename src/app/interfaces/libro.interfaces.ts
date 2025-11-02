export interface ILibro {
  _id: string;
  titulo: string;
  autor: string;
  genero: string;
  ano: number | null;
  cantidad: number;
}

export interface ICrearLibro {
  titulo: string;
  autor: string;
  genero: string;
  ano: number | null;
  cantidad: number;
}