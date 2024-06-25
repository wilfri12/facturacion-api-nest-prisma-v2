import { Module } from '@nestjs/common';
import { CategoriaModule } from './categoria/categoria.module';
import { UsuarioModule } from './usuario/usuario.module';
import { EmpresaModule } from './empresa/empresa.module';
import { FacturaModule } from './factura/factura.module';
import { DetalleFacturaModule } from './detalle-factura/detalle-factura.module';
import { ContactoModule } from './contacto/contacto.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { ClienteModule } from './cliente/cliente.module';
import { DetalleOrdenCompraModule } from './detalle-orden-compra/detalle-orden-compra.module';
import { OrdenCompraModule } from './orden-compra/orden-compra.module';
import { ProduccionModule } from './produccion/produccion.module';
import { ProductoModule } from './producto/producto.module';
import { MateriaPrimaModule } from './materia-prima/materia-prima.module';
import { DetalleProduccionModule } from './detalle-produccion/detalle-produccion.module';
import { DetalleMateriaPrimaModule } from './detalle-materia-prima/detalle-materia-prima.module';

@Module({
  imports: [ProductoModule, CategoriaModule, UsuarioModule, EmpresaModule, FacturaModule, DetalleFacturaModule, ContactoModule, ProveedorModule, ClienteModule, DetalleOrdenCompraModule, OrdenCompraModule, ProduccionModule, MateriaPrimaModule, DetalleProduccionModule, DetalleMateriaPrimaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
