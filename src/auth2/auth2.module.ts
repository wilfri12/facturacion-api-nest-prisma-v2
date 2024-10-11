import { Module } from '@nestjs/common';
import { Auth2Service } from './auth2.service';
import { Auth2Controller } from './auth2.controller';

@Module({
  controllers: [Auth2Controller],
  providers: [Auth2Service],
})
export class Auth2Module {}
