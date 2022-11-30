import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowController } from './follow.controller';
import { Follow } from './follow.entity';
import { FollowService } from './follow.service';

@Module({
  imports: [TypeOrmModule.forFeature([Follow])],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
