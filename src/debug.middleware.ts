import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DebugMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('==============================');
    console.log('HEADERS DA REQUISIÇÃO:');
    console.log(req.headers); // Aqui você verá todos os headers
    console.log('==============================');
    next();
  }
}
