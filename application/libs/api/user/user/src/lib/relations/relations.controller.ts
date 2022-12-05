import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationGuard } from '@twitr/api/user/authentication';
import {
  FollowDto,
  GetFolloweesPayload,
  GetFolloweesResponse,
  GetFollowersPayload,
  GetFollowersResponse,
} from '@twitr/api/user/data-transfer-objects';
import {
  SERVICE_QUEUE_NAME,
  GET_FOLLOWERS_RPC,
  GET_FOLLOWEES_RPC,
} from '@twitr/api/user/constants';
import { RelationsService } from './relations.service';
import { Rpc, RPCResponse, RPCResponseType } from '@twitr/api/utils/queue';

@Controller('v1/user/relations')
export class RelationsController {
  constructor(private relationsService: RelationsService) {}

  @Post('follow')
  @UseGuards(AuthenticationGuard)
  async follow(@Body() body: FollowDto, @Req() req): Promise<void> {
    return this.relationsService.follow(req.user.sub, body.handle);
  }

  @Get('followees')
  @UseGuards(AuthenticationGuard)
  async getFollowees(@Req() req): Promise<string[]> {
    return this.relationsService.getFollowees(req.user.sub);
  }

  @Get('followers')
  @UseGuards(AuthenticationGuard)
  async getFollowers(@Req() req): Promise<string[]> {
    return this.relationsService.getFollowers(req.user.sub);
  }
}

@Controller()
export class RelationsQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-follow`;

  constructor(private relationsService: RelationsService) {}

  @Rpc(GET_FOLLOWERS_RPC, RelationsQueueController.CONTROLLER_QUEUE_NAME)
  async getFollowers(
    payload: GetFollowersPayload
  ): Promise<RPCResponse<GetFollowersResponse>> {
    try {
      const data = await this.relationsService.getFollowers(payload.userId);

      return {
        type: RPCResponseType.SUCCESS,
        data,
      };
    } catch (error) {
      return {
        type: RPCResponseType.ERROR,
        message: error.message ?? 'INTERNAL_SERVER_EXCEPTION',
      };
    }
  }

  @Rpc(GET_FOLLOWEES_RPC, RelationsQueueController.CONTROLLER_QUEUE_NAME)
  async getFollowees(
    payload: GetFolloweesPayload
  ): Promise<RPCResponse<GetFolloweesResponse>> {
    try {
      const data = await this.relationsService.getFollowees(payload.userId);

      return {
        type: RPCResponseType.SUCCESS,
        data,
      };
    } catch (error) {
      return {
        type: RPCResponseType.ERROR,
        message: error.message ?? 'INTERNAL_SERVER_EXCEPTION',
      };
    }
  }
}
