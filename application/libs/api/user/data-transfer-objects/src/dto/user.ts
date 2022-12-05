import { IsString, MaxLength, MinLength } from 'class-validator';
import { CreateUserPayload } from '../interfaces/user';

export class UserDto implements CreateUserPayload {
  @IsString()
  @MaxLength(20)
  @MinLength(1)
  handle: string;

  @IsString()
  password: string;
}
