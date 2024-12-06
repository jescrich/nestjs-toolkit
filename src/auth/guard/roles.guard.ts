import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import User from '../user';
import * as _ from 'lodash';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    if (!request.auth || !request.auth.user) return false;
    const user = request.auth.user as User;

    const profilesPrivileges = _(user.profiles).flatMap('roles').value();
    const userPrivileges = user.roles ?? [];

    const privileges = [...profilesPrivileges, ...userPrivileges];

    for (const rol in roles) {
      if (privileges.findIndex((p) => p === roles[rol]) > -1) return true;
    }

    return false;
  }
}
