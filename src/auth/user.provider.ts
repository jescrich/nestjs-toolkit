import { FactoryProvider, Scope } from '@nestjs/common';
import User from './user';
import { REQUEST } from '@nestjs/core';

export const UserProvider: FactoryProvider<() => User | undefined> = {
  provide: 'USER',
  useFactory: (req) => () => req?.auth?.user,
  scope: Scope.REQUEST,
  inject: [REQUEST],
};
