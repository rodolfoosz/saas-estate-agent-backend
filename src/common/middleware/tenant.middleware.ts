import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request & { tenantSlug?: string }, res: Response, next: NextFunction) {
    const tenantSlug = req.headers['x-tenant-id'];

    if (!tenantSlug || typeof tenantSlug !== 'string') {
      throw new BadRequestException('Tenant não informado');
    }

    req.tenantSlug = tenantSlug;
    next();
  }
}
