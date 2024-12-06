import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AllExceptionsFilter } from './filters';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    HttpModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class NestJsModule {}
