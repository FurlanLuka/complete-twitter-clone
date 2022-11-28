import { Controller, Get } from '@nestjs/common';

@Controller('v1/tweet')
export class TweetController {
  @Get('')
  tweet(): string {
    return 'Hey there';
  }
}
