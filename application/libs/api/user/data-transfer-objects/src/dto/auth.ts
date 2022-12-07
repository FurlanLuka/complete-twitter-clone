import { IsString } from 'class-validator';
import { RefreshTokenPayload } from '../types';

export class RefreshTokenDto implements RefreshTokenPayload {
  @IsString()
  refreshToken: string;
}
