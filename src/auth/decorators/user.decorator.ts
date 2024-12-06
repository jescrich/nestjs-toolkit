import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import User from '../user';

export const CurrentUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const auth = ctx.switchToHttp().getRequest().auth;
  if (!auth) {
    throw new UnauthorizedException('A token was provided but the user is not recognized.');
  }
  return auth?.user as User;
});
