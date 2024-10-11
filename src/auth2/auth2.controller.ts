import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Auth2Service } from './auth2.service';
import { CreateAuth2Dto } from './dto/create-auth2.dto';
import { UpdateAuth2Dto } from './dto/update-auth2.dto';

@Controller('auth2')
export class Auth2Controller {
  constructor(private readonly auth2Service: Auth2Service) {}

  @Post()
  create(@Body() createAuth2Dto: CreateAuth2Dto) {
    return this.auth2Service.create(createAuth2Dto);
  }

  @Get()
  findAll() {
    return this.auth2Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auth2Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuth2Dto: UpdateAuth2Dto) {
    return this.auth2Service.update(+id, updateAuth2Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auth2Service.remove(+id);
  }
}
