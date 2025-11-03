export interface IUsuario {
  _id: string;
  nombre: string;
  correo: string;
  rut: string;
  rol: 'Usuario' | 'Admin';
  cargo: 'Estudiante' | 'Docente' | 'Bibliotecario';
  situacion: 'Vigente' | 'Atrasado' | 'Bloqueado' | 'Prestamo Activo';
}

export interface ICrearUsuario {
  nombre: string;
  correo: string;
  rut: string;
  rol: 'Usuario' | 'Admin';
  password?: string;
  cargo: 'Estudiante' | 'Docente' | 'Bibliotecario';
}