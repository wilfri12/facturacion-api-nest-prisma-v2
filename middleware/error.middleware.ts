// middleware/error.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Este middleware maneja errores de manera centralizada
    // Aquí puedes manejar errores si es necesario, o simplemente pasar al siguiente middleware

    // Ejemplo: Manejar un error genérico
    const statusCode = 500; // Código de estado HTTP 500 - Internal Server Error
    const message = 'Something went wrong';
    res.status(statusCode).json({ success: false, error: message });

    // Llama a `next()` para pasar al siguiente middleware en la cadena
    next();
  }
}
