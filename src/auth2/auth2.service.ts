import { Injectable } from '@nestjs/common';
import { CreateAuth2Dto } from './dto/create-auth2.dto';
import { UpdateAuth2Dto } from './dto/update-auth2.dto';

@Injectable()
export class Auth2Service {
  create(createAuth2Dto: CreateAuth2Dto) {
    return 'This action adds a new auth2';
  }

  findAll() {
    return `This action returns all auth2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth2`;
  }

  update(id: number, updateAuth2Dto: UpdateAuth2Dto) {
    return `This action updates a #${id} auth2`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth2`;
  }
}
