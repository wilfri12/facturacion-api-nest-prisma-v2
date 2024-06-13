import { Controller } from '@nestjs/common';
import { ProduccionService } from './produccion.service';

@Controller('produccion')
export class ProduccionController {
  constructor(private readonly produccionService: ProduccionService) {}
}
