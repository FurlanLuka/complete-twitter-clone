import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from '@twitr/api/user/authentication';
import { FollowDto } from '@twitr/api/user/data-transfer-objects';
import { FollowService } from './follow.service';

@Controller('v1/follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  async follow(@Body() body: FollowDto, @Req() req): Promise<void> {
    return this.followService.follow(req.user.sub, body.handle);
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  async getFollowees(@Req() req): Promise<string[]> {
    return this.followService.getFollowees(req.user.sub);
  }
}
