import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
  private readonly saltOrRounds = 10;

  // Función para encriptar una contraseña
  async encryptPassword(plainPassword: string): Promise<string> {
    const hash = await bcrypt.hash(plainPassword, this.saltOrRounds);
    return hash;
  }

  // Función para verificar una contraseña comparándola con su hash
  async verifyPassword(plainPassword: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(plainPassword, hash);
    return isMatch;
  }
}
