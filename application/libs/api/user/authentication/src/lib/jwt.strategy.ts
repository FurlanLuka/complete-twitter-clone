import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthenticationConfig } from './authentication.interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-auth') {
  constructor(@Inject('AUTHENTICATION_OPTIONS') options: AuthenticationConfig) {
    super({
      secretOrKey: options.secretKey,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: options.audience,
      issuer: options.issuer,
      algorithms: ['HS256'],
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate(payload: any, done: VerifiedCallback): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!payload) {
      done(new UnauthorizedException(), false);
    }

    return done(null, payload);
  }
}
