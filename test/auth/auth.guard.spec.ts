import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { IUser } from '@this/auth';
import { AuthGuard } from '../../src/auth/guard/auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let reflector: Reflector;

  let reflectorMock = createMock<Reflector>();
  let jwtServiceMock = createMock<DeepMocked<JwtService>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: Reflector,
          useValue: reflectorMock,
        },
        JwtService,
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should return true if the route is public', async () => {
    const context = {
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;

    expect(await authGuard.canActivate(context)).toBe(true);
  });

  // it('should return false if the token is invalid', async () => {
  //   reflectorMock.get.mockReturnValue(false);

  //   // This token as an invalid ISS
  //   const request = {
  //     headers: {
  //       authorization:
  //         'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb3NlZXNjcmljaEBtYWNyby5jb20uYXIiLCJlbWFpbCI6Impvc2Vlc2NyaWNoQG1hY3JvLmNvbS5hciIsIm5hbWUiOiJKb3NlIEVzY3JpY2giLCJpZCI6ImM0NGNhNWY2LTg4NjEtNDFjMS1hZTdhLWJmNTYwYTUyZDc3OSIsImlzcyI6Imh0dHA6Ly9pbnRyYW5ldC5mb3J0dW5ld2FyZS5jb20iLCJ1c2VyIjp7Il9pZCI6IjY0ZTNiMTk2Y2EzNGI1Yjk0MzdiNzk3ZCIsIm5hbWUiOiJKb3NlIEVzY3JpY2giLCJlbWFpbCI6Impvc2Vlc2NyaWNoQG1hY3JvLmNvbS5hciIsInByaXZpbGVnZXMiOlsiZG9jdW1lbnQuY3JlYXRlIl0sInByb2ZpbGVzIjpbeyJfaWQiOiI2NTAxMTM1YWMxOGM4NDMwYjc5NWZjNjAiLCJzdGF0dXMiOiJBQ1RJVkUiLCJuYW1lIjoiU3VwZXIgQWRtaW5pc3RyYWRvciIsImRlc2NyaXB0aW9uIjoiUGVyZmlsIGRlIFN1cGVyIEFkbWluaXN0cmFkb3IiLCJjaGlsZHJlbiI6W10sInByaXZpbGVnZXMiOlsic2VjdGlvbi5jcmVhdGUiLCJkb2N1bWVudC5jcmVhdGUiLCJhZG1pbi5yZWFkIiwiZG9jdW1lbnRzLndyaXRlIiwiZG9jdW1lbnRzLmNyZWF0ZSIsImRvY3VtZW50cy5sYWJlbHMiLCJkb2N1bWVudHMucHVibGlzaCIsImRvY3VtZW50cy51bnB1Ymxpc2giLCJ1c2Vycy5yZWFkIiwidXNlcnMuY3JlYXRlIiwicHJvZmlsZXMucmVhZCIsInByb2ZpbGVzLmNyZWF0ZSIsInNlY3Rpb25zLnJlYWQiLCJzZWN0aW9ucy5jcmVhdGUiLCJjYXRlZ29yaWVzLnJlYWQiLCJjYXRlZ29yaWVzLmNyZWF0ZSIsInN0cnVjdHVyZXMucmVhZCIsInN0cnVjdHVyZXMuY3JlYXRlIiwiZG9jdW1lbnRzLnJlYWQiLCJydWxlcy5yZWFkIiwicnVsZXMuY3JlYXRlIl0sIl9fdiI6MH0seyJfaWQiOiI2NjE2YTY1YzQ1ZDZhMzFlMGZkODc5YWEiLCJzdGF0dXMiOiJhY3RpdmUiLCJuYW1lIjoiVXN1YXJpbyBJbnRyYW5ldCIsImRlc2NyaXB0aW9uIjoiVXN1YXJpbyBHZW5lcmFsIGRlIGxhIEludHJhbmV0IiwiY2hpbGRyZW4iOltdLCJwcml2aWxlZ2VzIjpbImRvY3VtZW50cy5yZWFkIl0sIl9fdiI6MCwiZGVmYXVsdCI6dHJ1ZX0seyJfaWQiOiI2NjFkODQ4NjcxNGY4ZmM1YjIzYTA2ZjAiLCJzdGF0dXMiOiJhY3RpdmUiLCJuYW1lIjoiTGVlIHRvZG8gZWwgYmFuY28iLCJkZXNjcmlwdGlvbiI6IlBlcmZpbCBwYXJhIGFzaWduYXIgbGVjdHVyYSBhIHVuIGRvY3VlbW50byBwYXJhIHRvZG8gZWwgYmFuY28iLCJjaGlsZHJlbiI6W10sInByaXZpbGVnZXMiOlsiZG9jdW1lbnRzLnJlYWQiXSwiZGVmYXVsdCI6dHJ1ZSwiX192IjowfV0sInN0YXR1cyI6IkFDVElWRSIsInN1ZG8iOnRydWV9LCJpYXQiOjE3MTMyNzg0NDQsImV4cCI6MTcxMzM2NDg0NH0.d5VzAwtilqhys5StSpH8xbNM27bjL92pdVQYYz4BN_2__Kb1YDS37f4jv1JA_NWrf_jOvcaQ64X7c2phe1kavNiZIeBi8YcnHS9VclyX3dCUDPEkK5HaH4t9tMpg8_SSbSCbSXVBa70p-L7xKGQu4U7nxVzPkHXixjpXvDQQrkGx2xD2yd1TcHrlJ_NJwn-P5FsDXlwVzqW09a2i5buviOYkwsk_2lcucA_nfeBPZQ1bMa_7cplYtqmIhJRyji5C6QjzRIcq0VGX4XAHC-NwKXM5mdHyrMhHALw4c1B70fo20RW1Ttt0ZhFs2VxuF7FzwWSjZ5NizeaX6unLsjpRuA',
  //     },
  //     auth: undefined as IUser | undefined,
  //   };

  //   const context = {
  //     switchToHttp: () => ({
  //       getRequest: () => request,
  //     }),
  //     getType: () => 'http',
  //     getHandler: jest.fn(),
  //   } as unknown as ExecutionContext;

  //   await expect(authGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  // });

  it('should return true if the token is valid', async () => {
    reflectorMock.get.mockReturnValue(false);

    const request = {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3LnNvdXphQGpvcmxhbi5jb20iLCJlbWFpbCI6Incuc291emFAam9ybGFuLmNvbSIsImlzcyI6ImFsZXBoZWUtdjMtdG9rZW4tcHJvdmlkZXIiLCJleHAiOjE3MzMwODAxMzcsInVzZXIiOnt9LCJ0ZW5hbnQiOnsidXJuIjoidXJuOnRlbmFudDo4NDY4IiwiZmlzY2FsSWQiOiIwMTU0MjI0MDAwMDg1NyIsIm5hbWUiOiJKT1JMQU4gUy9BIFZFSUNVTE9TIEFVVE9NT1RPUkVTIElNUCBFIENPTSIsImFsaWFzIjoiSm9ybGFuIEdPIiwic3RhdHVzIjoiQWN0aXZlIiwiZW1haWwiOiJ3LnNvdXphQGpvcmxhbi5jb20iLCJjb3VudHJ5Ijp7InVybiI6InVybjpjb3VudHJ5Ojc2IiwibmFtZSI6IkJyYXNpbCJ9LCJyb2xlcyI6WyJTZWxsZXIiXSwibWFya2V0cGxhY2VzIjpbeyJfaWQiOiI2NzQ4YmZjYmEyNDk1MmFlNWRmYjExOWIiLCJ1cm4iOiJ1cm46U2VsbGVyOjI0NzIwNjAyNDp2ZW5kb3I6TWVyY2Fkb0xpdnJlIEJyYXNpbCIsIm5hbWUiOiJNZXJjYWRvTGl2cmUgQnJhc2lsIiwic3RhdHVzIjoiYWN0aXZlIiwiZXh0ZXJuYWxUZW5hbnQiOiIyNDcyMDYwMjQiLCJjb25maWd1cmF0aW9uIjp7InByaWNlcyI6W3siX2lkIjoiNjc0OGJmY2JhMjQ5NTJhZTVkZmIxMTljIiwicHVibGljYXRpb25UeXBlIjoiUHJlbWl1bSIsInB1YmxpY2F0aW9uTmFtZSI6IiIsIm1hcmdpbiI6MH1dfX0seyJfaWQiOiI2NzQ4YmZjYmEyNDk1MmFlNWRmYjExOWQiLCJ1cm4iOiJ1cm46U2VsbGVyOjI0NzIwNjAyNDp2ZW5kb3I6TWVyY2Fkb0xpdnJlIEJyYXNpbCIsIm5hbWUiOiJNZXJjYWRvTGl2cmUgQnJhc2lsIiwic3RhdHVzIjoiYWN0aXZlIiwiZXh0ZXJuYWxUZW5hbnQiOiIyNDcyMDYwMjQiLCJjb25maWd1cmF0aW9uIjp7InByaWNlcyI6W3siX2lkIjoiNjc0OGJmY2JhMjQ5NTJhZTVkZmIxMTllIiwicHVibGljYXRpb25UeXBlIjoiQ2zDoXNzaWNvIiwicHVibGljYXRpb25OYW1lIjoiIiwibWFyZ2luIjowfV19fSx7Il9pZCI6IjY3NDhiZmNiYTI0OTUyYWU1ZGZiMTE5ZiIsInVybiI6InVybjpTZWxsZXI6MDEuNTQyLjI0MC8wMDA4LTU3OnZlbmRvcjpQZcOnYXMgQ2hldnJvbGV0IiwibmFtZSI6IlBlw6dhcyBDaGV2cm9sZXQiLCJzdGF0dXMiOiJhY3RpdmUiLCJleHRlcm5hbFRlbmFudCI6IjAxLjU0Mi4yNDAvMDAwOC01NyIsImNvbmZpZ3VyYXRpb24iOnsicHJpY2VzIjpbeyJfaWQiOiI2NzQ4YmZjYmEyNDk1MmFlNWRmYjExYTAiLCJwdWJsaWNhdGlvblR5cGUiOiJCMkMiLCJwdWJsaWNhdGlvbk5hbWUiOiIiLCJtYXJnaW4iOjB9XX19LHsiX2lkIjoiNjc0OGJmY2JhMjQ5NTJhZTVkZmIxMWExIiwidXJuIjoidXJuOlNlbGxlcjowMS41NDIuMjQwLzAwMDgtNTc6dmVuZG9yOlBlw6dhcyBDaGV2cm9sZXQiLCJuYW1lIjoiUGXDp2FzIENoZXZyb2xldCIsInN0YXR1cyI6ImFjdGl2ZSIsImV4dGVybmFsVGVuYW50IjoiMDEuNTQyLjI0MC8wMDA4LTU3IiwiY29uZmlndXJhdGlvbiI6eyJwcmljZXMiOlt7Il9pZCI6IjY3NDhiZmNiYTI0OTUyYWU1ZGZiMTFhMiIsInB1YmxpY2F0aW9uVHlwZSI6IkIyQiIsInB1YmxpY2F0aW9uTmFtZSI6IiIsIm1hcmdpbiI6MH1dfX0seyJfaWQiOiI2NzQ4YmZjYmEyNDk1MmFlNWRmYjExYTMiLCJ1cm4iOiJ1cm46U2VsbGVyOjYxODUzNjY2NTp2ZW5kb3I6U2hvcGVlIiwibmFtZSI6IlNob3BlZSIsInN0YXR1cyI6ImFjdGl2ZSIsImV4dGVybmFsVGVuYW50IjoiNjE4NTM2NjY1IiwiY29uZmlndXJhdGlvbiI6eyJwcmljZXMiOlt7Il9pZCI6IjY3NDhiZmNiYTI0OTUyYWU1ZGZiMTFhNCIsInB1YmxpY2F0aW9uVHlwZSI6IiIsInB1YmxpY2F0aW9uTmFtZSI6IiIsIm1hcmdpbiI6MH1dfX1dLCJwaG9uZU51bWJlciI6IiJ9LCJpYXQiOjE3MzI4MjA5Mzl9.7GEAMKVMkkgTGNVjDrDB0ww3aYaj2Oz8ttpJxDRSSgU',
      },
      auth: undefined as IUser | undefined,
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      getType: () => 'http',
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;

    expect(await authGuard.canActivate(context)).toBe(true);
    expect(request['auth']?.email).toBe('w.souza@jorlan.com');
  });

  // it('using a alephee v2 resissued token should return true if the token is valid', async () => {
  //   reflectorMock.get.mockReturnValue(false);

  //   const request = {
  //     headers: {
  //       authorization:
  //         'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3LnNvdXphQGpvcmxhbi5jb20iLCJlbWFpbCI6Incuc291emFAam9ybGFuLmNvbSIsImlzcyI6ImFsZXBoZWUtdjMtdG9rZW4tcHJvdmlkZXIiLCJleHAiOjE3MzMwODAxMzcsInVzZXIiOnt9LCJ0ZW5hbnQiOnsidXJuIjoidXJuOnRlbmFudDo4NDY4IiwiZmlzY2FsSWQiOiIwMTU0MjI0MDAwMDg1NyIsIm5hbWUiOiJKT1JMQU4gUy9BIFZFSUNVTE9TIEFVVE9NT1RPUkVTIElNUCBFIENPTSIsImFsaWFzIjoiSm9ybGFuIEdPIiwic3RhdHVzIjoiQWN0aXZlIiwiZW1haWwiOiJ3LnNvdXphQGpvcmxhbi5jb20iLCJjb3VudHJ5Ijp7InVybiI6InVybjpjb3VudHJ5Ojc2IiwibmFtZSI6IkJyYXNpbCJ9LCJyb2xlcyI6WyJTZWxsZXIiXSwibWFya2V0cGxhY2VzIjpbeyJfaWQiOiI2NzQ4YmZjYmEyNDk1MmFlNWRmYjExOWIiLCJ1cm4iOiJ1cm46U2VsbGVyOjI0NzIwNjAyNDp2ZW5kb3I6TWVyY2Fkb0xpdnJlIEJyYXNpbCIsIm5hbWUiOiJNZXJjYWRvTGl2cmUgQnJhc2lsIiwic3RhdHVzIjoiYWN0aXZlIiwiZXh0ZXJuYWxUZW5hbnQiOiIyNDcyMDYwMjQiLCJjb25maWd1cmF0aW9uIjp7InByaWNlcyI6W3siX2lkIjoiNjc0OGJmY2JhMjQ5NTJhZTVkZmIxMTljIiwicHVibGljYXRpb25UeXBlIjoiUHJlbWl1bSIsInB1YmxpY2F0aW9uTmFtZSI6IiIsIm1hcmdpbiI6MH1dfX0seyJfaWQiOiI2NzQ4YmZjYmEyNDk1MmFlNWRmYjExOWQiLCJ1cm4iOiJ1cm46U2VsbGVyOjI0NzIwNjAyNDp2ZW5kb3I6TWVyY2Fkb0xpdnJlIEJyYXNpbCIsIm5hbWUiOiJNZXJjYWRvTGl2cmUgQnJhc2lsIiwic3RhdHVzIjoiYWN0aXZlIiwiZXh0ZXJuYWxUZW5hbnQiOiIyNDcyMDYwMjQiLCJjb25maWd1cmF0aW9uIjp7InByaWNlcyI6W3siX2lkIjoiNjc0OGJmY2JhMjQ5NTJhZTVkZmIxMTllIiwicHVibGljYXRpb25UeXBlIjoiQ2zDoXNzaWNvIiwicHVibGljYXRpb25OYW1lIjoiIiwibWFyZ2luIjowfV19fSx7Il9pZCI6IjY3NDhiZmNiYTI0OTUyYWU1ZGZiMTE5ZiIsInVybiI6InVybjpTZWxsZXI6MDEuNTQyLjI0MC8wMDA4LTU3OnZlbmRvcjpQZcOnYXMgQ2hldnJvbGV0IiwibmFtZSI6IlBlw6dhcyBDaGV2cm9sZXQiLCJzdGF0dXMiOiJhY3RpdmUiLCJleHRlcm5hbFRlbmFudCI6IjAxLjU0Mi4yNDAvMDAwOC01NyIsImNvbmZpZ3VyYXRpb24iOnsicHJpY2VzIjpbeyJfaWQiOiI2NzQ4YmZjYmEyNDk1MmFlNWRmYjExYTAiLCJwdWJsaWNhdGlvblR5cGUiOiJCMkMiLCJwdWJsaWNhdGlvbk5hbWUiOiIiLCJtYXJnaW4iOjB9XX19LHsiX2lkIjoiNjc0OGJmY2JhMjQ5NTJhZTVkZmIxMWExIiwidXJuIjoidXJuOlNlbGxlcjowMS41NDIuMjQwLzAwMDgtNTc6dmVuZG9yOlBlw6dhcyBDaGV2cm9sZXQiLCJuYW1lIjoiUGXDp2FzIENoZXZyb2xldCIsInN0YXR1cyI6ImFjdGl2ZSIsImV4dGVybmFsVGVuYW50IjoiMDEuNTQyLjI0MC8wMDA4LTU3IiwiY29uZmlndXJhdGlvbiI6eyJwcmljZXMiOlt7Il9pZCI6IjY3NDhiZmNiYTI0OTUyYWU1ZGZiMTFhMiIsInB1YmxpY2F0aW9uVHlwZSI6IkIyQiIsInB1YmxpY2F0aW9uTmFtZSI6IiIsIm1hcmdpbiI6MH1dfX0seyJfaWQiOiI2NzQ4YmZjYmEyNDk1MmFlNWRmYjExYTMiLCJ1cm4iOiJ1cm46U2VsbGVyOjYxODUzNjY2NTp2ZW5kb3I6U2hvcGVlIiwibmFtZSI6IlNob3BlZSIsInN0YXR1cyI6ImFjdGl2ZSIsImV4dGVybmFsVGVuYW50IjoiNjE4NTM2NjY1IiwiY29uZmlndXJhdGlvbiI6eyJwcmljZXMiOlt7Il9pZCI6IjY3NDhiZmNiYTI0OTUyYWU1ZGZiMTFhNCIsInB1YmxpY2F0aW9uVHlwZSI6IiIsInB1YmxpY2F0aW9uTmFtZSI6IiIsIm1hcmdpbiI6MH1dfX1dLCJwaG9uZU51bWJlciI6IiJ9LCJpYXQiOjE3MzI4MjA5Mzl9.7GEAMKVMkkgTGNVjDrDB0ww3aYaj2Oz8ttpJxDRSSgU',
  //     },
  //     auth: undefined as IUser | undefined,
  //   };

  //   const context = {
  //     switchToHttp: () => ({
  //       getRequest: () => request,
  //     }),
  //     getType: () => 'http',
  //     getHandler: jest.fn(),
  //   } as unknown as ExecutionContext;

  //   // Act 
  //   const result = await authGuard.canActivate(context);

  //   const user = request['auth'];

  //   expect(result).toBe(true);
  //   expect(user).toBeDefined();
  //   expect(user?.email).toBe('w.souza@jorlan.com');
  //   expect(user?.roles).toEqual(['Seller']);
    
  // });

  it('should return false if the token is invalid', async () => {
    reflectorMock.get.mockReturnValue(false);

    const request = {
      headers: {
        authorization: 'Bearer invalid-token',
      },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      getType: () => 'http',
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;

    expect(await authGuard.canActivate(context)).toBe(false);
  });

  it('should throw UnauthorizedException if an error occurs', async () => {
    reflectorMock.get.mockReturnValue(false);

    const request = {
      headers: {
        authorization: 'Bearer token',
      },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => {
          throw new Error();
        },
      }),
      getType: () => 'http',
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;

    await expect(authGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should return true if the context type is rpc', async () => {
    reflectorMock.get.mockReturnValue(false);

    const context = {
      switchToHttp: () => ({
        getRequest: () => {},
      }),
      getType: () => 'rpc',
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;

    expect(await authGuard.canActivate(context)).toBe(true);
  });
});
