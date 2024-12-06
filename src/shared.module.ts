import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { Filters } from '.';

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
      useClass: Filters.AllExceptionsFilter,
    },
  ],
  // exports: [ClientService],
})
export class SharedModule {}
