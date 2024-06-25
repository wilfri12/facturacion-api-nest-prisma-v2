import { Controller } from '@nestjs/common';
import { DetalleMateriaPrimaService } from './detalle-materia-prima.service';

@Controller('detalle-materia-prima')
export class DetalleMateriaPrimaController {
  constructor(private readonly detalleMateriaPrimaService: DetalleMateriaPrimaService) {}
}
