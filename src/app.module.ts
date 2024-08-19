import { Module } from '@nestjs/common';
import { CategoriaModule } from './categoria/categoria.module';
import { UsuarioModule } from './usuario/usuario.module';
import { EmpresaModule } from './empresa/empresa.module';
import { FacturaModule } from './factura/factura.module';
import { DetalleFacturaModule } from './detalle-factura/detalle-factura.module';
import { ContactoModule } from './contacto/contacto.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { ClienteModule } from './cliente/cliente.module';
import { ProductoModule } from './producto/producto.module';
import { DetalleOrdenCompraModule } from './detalle-compra/detalle-compra.module';
import { OrdenCompraModule } from './compra/compra.module';
import { SubcategoriaModule } from './subcategoria/subcategoria.module';

@Module({
  imports: [ProductoModule, CategoriaModule, UsuarioModule, EmpresaModule, FacturaModule, DetalleFacturaModule, ContactoModule, ProveedorModule, ClienteModule, DetalleOrdenCompraModule, OrdenCompraModule, SubcategoriaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
