import { Module } from '@nestjs/common';
import { ProductoModule } from './producto/producto.module';
import { CategoriaModule } from './categoria/categoria.module';
import { UsuarioModule } from './usuario/usuario.module';
import { EmpresaModule } from './empresa/empresa.module';
import { FacturaModule } from './factura/factura.module';
import { DetalleFacturaModule } from './detalle-factura/detalle-factura.module';

@Module({
  imports: [ProductoModule, CategoriaModule, UsuarioModule, EmpresaModule, FacturaModule, DetalleFacturaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
