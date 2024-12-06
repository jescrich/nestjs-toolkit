import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

    if (isPublic) {
      return true;
    }

    try {
      const request = context.switchToHttp().getRequest();

      if (request && context.getType() === 'http') {
        const token = this.extractTokenFromHeader(request);

        if (token) {
          const payload = await this.jwtService.decode(token);
          if (!payload) return false;
          request['auth'] = payload;
          return true;
        }
      } else if (context.getType() === 'rpc') {
        return true;
      }

      return false;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
