import { IsString, MaxLength, MinLength } from 'class-validator';

export class UserDto {
  @IsString()
  @MaxLength(20)
  @MinLength(1)
  handle: string;

  @IsString()
  password: string;
}

export interface TokenResponse {
  token: string;
  exp: number;
  refreshToken: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

export class FollowDto {
  @IsString()
  @MaxLength(20)
  @MinLength(1)
  handle: string;
}

export interface GetFollowersPayload {
  userId: string;
}

export interface GetFolloweesPayload {
  userId: string;
}

export type GetFollowersResponse = string[]

export type GetFolloweesResponse = string[]