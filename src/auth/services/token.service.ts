import { Injectable, Logger, Optional } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import IUser from '../user';

@Injectable()
/**
 * Service for generating JWT tokens for users.
 */
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly iis: string,
    @Optional() private readonly privateKey?: string,
    @Optional() private readonly iss?: string,
  ) {}

  /**
   * Generates a JWT token for the specified user.
   * @param user - The user object.
   * @returns A promise that resolves to the generated JWT token.
   */
  async getTokenForUser(user: IUser, options?: { expiresIn?: string; algorithm?: string }): Promise<string> {
    Logger.log(`Generating token for user: ${user.username}`);

    const payload = {
      sub: user.username,
      user,
      iss: this.iss ?? 'http://jescrich',
    };

    if (!this.privateKey) Logger.error('Private key not found. Please provide a private key to generate the token.');

    const privateKey = this.privateKey?.replace(/\\n/g, '\n');
    const { expiresIn } = options ?? { expiresIn: '1d' };

    const access_token = this.jwtService.sign(payload, {
      privateKey,
      algorithm: 'RS256',
      expiresIn,
    });

    return access_token;
  }
}
