import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { AuthenticationGuard } from '@twitr/api/user/authentication';
import { WebsocketTokenResponse } from './websocket.interfaces';

@Controller('v1/websockets')
export class WebsocketController {
  constructor(private websocketService: WebsocketService) {}

  @Post('auth')
  @UseGuards(AuthenticationGuard)
  public createAuthToken(@Request() req): Promise<WebsocketTokenResponse> {
    return this.websocketService.createAccessToken(req.user.sub);
  }
}
