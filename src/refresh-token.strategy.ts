// refresh-token.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'), // Assuming refreshToken is sent in the request body
      passReqToCallback: true,
      secretOrKey: 'your_refresh_token_secret_key', // Use the same key as your access token
    });
  }

  async validate(req: any) {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid token');
    }
    return this.authService.refreshAccessToken(refreshToken);
  }
}
