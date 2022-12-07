import { Body, Controller, Post } from '@nestjs/common';
import {
  RefreshTokenDto,
  UserDto,
} from '@twitr/api/user/data-transfer-objects';
import { TokenResponse } from '@twitr/api/user/data-transfer-objects/types';
import { UserService } from './user.service';

@Controller('/v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() body: UserDto): Promise<TokenResponse> {
    return this.userService.createUser(body.handle, body.password);
  }

  @Post('login')
  async loginUser(@Body() body: UserDto): Promise<TokenResponse> {
    return this.userService.loginUser(body.handle, body.password);
  }

  @Post('token/refresh')
  async refreshToken(@Body() body: RefreshTokenDto): Promise<TokenResponse> {
    return this.userService.refreshToken(body.refreshToken);
  }
}
