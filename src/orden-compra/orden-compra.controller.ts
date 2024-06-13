import { Controller } from '@nestjs/common';
import { OrdenCompraService } from './orden-compra.service';

@Controller('orden-compra')
export class OrdenCompraController {
  constructor(private readonly ordenCompraService: OrdenCompraService) {}
}
