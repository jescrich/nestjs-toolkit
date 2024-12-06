import { DynamicModule, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './services/token.service';

@Module({})
export class AuthModule {
  static register(parmas: { secret: string; expiration?: string }): DynamicModule {
    const { secret, expiration } = parmas;

    if (!secret) {
      throw new Error('Unable to register AuthModule. Missing secret.');
    }

    const providers = [
      JwtService,
      {
        provide: TokenService,
        inject: [JwtService],
        useFactory: (jwtService: JwtService) => new TokenService(jwtService, secret, expiration),
      },
      // {
      //   provide: APP_GUARD,
      //   useClass: Auth.AuthGuard,
      // },
      // {
      //   provide: APP_GUARD,
      //   useClass: Auth.RolesGuard,
      // },
    ];
    return {
      module: AuthModule,
      providers,
      exports: [TokenService],
    };
  }
}
