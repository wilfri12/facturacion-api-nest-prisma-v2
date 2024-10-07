import { Decimal } from "@prisma/client/runtime/library";

export interface FacturaResponse {
  success: boolean;
  data:    FacturaInterface;
}

export interface FacturaInterface {
  id:               number;
  codigo:           string;
  subtotal:         Decimal;
  total:            Decimal;
  itebisTotal:      Decimal;
  metodoPago:       string;
  usuarioId:        number;
  clienteId:        number | null;
  clienteNombre:    string;
  empresaId:        number;
  estado:           string;
  cajaId:           number;
  moneda:           string;
  createdAt:        Date;
  updatedAt:        Date;
  detallesFacturas: DetallesFactura[];
  Caja:             Caja;
  usuario:          Usuario;
  empresa:          Caja;
}

export interface Caja {
  id:     number;
  nombre: string;
}

export interface DetallesFactura {
  id:       number;
  producto: Producto;
  cantidad: number;
  importe:  Decimal;
}

export interface Producto {
  id:          number;
  nombre:      string;
  precio:      Decimal;
  color:       string;
  descripcion: string;
  marca:       string;
  talla:       string;
  genero:      string;
  codigo:      string;
  categoria:   Categoria;
}

export interface Categoria {
  nombre: string;
}

export interface Usuario {
  id:            number;
  nombreUsuario: string;
}
