import { PartialType } from '@nestjs/mapped-types';
import { CreateAuth2Dto } from './create-auth2.dto';

export class UpdateAuth2Dto extends PartialType(CreateAuth2Dto) {}
