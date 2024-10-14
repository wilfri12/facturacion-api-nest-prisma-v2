import { Module } from '@nestjs/common';
import { CategoriaModule } from './categoria/categoria.module';
import { UsuarioModule } from './usuario/usuario.module';
import { EmpresaModule } from './empresa/empresa.module';
import { FacturaModule } from './factura/factura.module';
import { DetalleFacturaModule } from './shop/detalle-factura/detalle-factura.module';
import { ContactoModule } from './contacto/contacto.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { ClienteModule } from './cliente/cliente.module';
import { ProductoModule } from './producto/producto.module';
import { DetalleOrdenCompraModule } from './detalle-compra/detalle-compra.module';
import { CompraModule } from './compra/compra.module';
import { SubcategoriaModule } from './subcategoria/subcategoria.module';
import { MovimientoModule } from './movimiento/movimiento.module';
import { LotesModule } from './lotes/lotes.module';
import { CajaModule } from './caja/caja.module';
import { PrinterModule } from './printer/printer.module';
import { AuthModule } from './auth/auth/auth.module';

@Module({
  imports: [ProductoModule, CategoriaModule, UsuarioModule, EmpresaModule, FacturaModule, DetalleFacturaModule, ContactoModule, ProveedorModule, ClienteModule, DetalleOrdenCompraModule, CompraModule, SubcategoriaModule, MovimientoModule, LotesModule, CajaModule, PrinterModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
