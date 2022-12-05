import { IsString, MaxLength, MinLength } from 'class-validator';
import { FollowPayload } from '../types';

export class FollowDto implements FollowPayload {
  @IsString()
  @MaxLength(20)
  @MinLength(1)
  handle: string;
}
