import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  RefreshTokenDto,
  UserDto,
  TokenResponse,
} from '@twitr/api/user/data-transfer-objects';
import { UserService } from './user.service';
import { AuthenticationGuard } from '@twitr/api/user/authentication';

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
  @UseGuards(AuthenticationGuard)
  async refreshToken(
    @Body() body: RefreshTokenDto,
    @Req() req
  ): Promise<TokenResponse> {
    return this.userService.refreshToken(body.refreshToken, req.user.sub);
  }
}
