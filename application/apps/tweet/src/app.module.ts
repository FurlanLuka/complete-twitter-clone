import { Module } from '@nestjs/common';
import { TweetModule } from '@twitr/api/tweet/tweet'

@Module({
  imports: [TweetModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
