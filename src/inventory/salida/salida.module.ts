import { Module } from '@nestjs/common';
import { SalidaService } from './salida.service';
import { SalidaController } from './salida.controller';

@Module({
  controllers: [SalidaController],
  providers: [SalidaService],
})
export class SalidaModule {}
