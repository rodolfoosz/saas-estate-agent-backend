import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const body = { ...req.body };

    if (body.password) body.password = '***';
    if (body.confirmPassword) body.confirmPassword = '***';

    this.logger.log(
      `${method} ${originalUrl} - Body: ${JSON.stringify(body)}`
    );

    next();
  }
}
