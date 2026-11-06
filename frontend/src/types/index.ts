export interface Domicilio {
  id?: number;
  personaId?: number;
  calle: string;
  numeroExterior: string;
  numeroInterior?: string;
  colonia: string;
  codigoPostal: string;
  municipio: string;
  estado: string;
  tipo?: string;
  esPrincipal?: boolean;
}

export interface Persona {
  id?: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  curp: string;
  rfc: string;
  fechaNacimiento: string;
  email: string;
  telefono: string;
  fechaRegistro?: string;
  domicilios?: Domicilio[];
}

export interface Stats {
  totalPersonas: number;
  totalDomicilios: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}