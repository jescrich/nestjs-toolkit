import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import User from '../user';

export const CurrentTenant = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const tenant = ctx.switchToHttp().getRequest().headers['x-tenant'];
  if (!tenant) {
    throw new BadRequestException('x-tenant header not found');
  }
  return { urn: tenant };
});
