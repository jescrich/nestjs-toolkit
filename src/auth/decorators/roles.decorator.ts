import { SetMetadata } from '@nestjs/common';

export const Require = (roles: string[]) => SetMetadata('roles', roles);
