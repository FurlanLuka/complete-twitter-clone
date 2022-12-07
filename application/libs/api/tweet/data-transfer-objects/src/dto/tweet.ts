import { IsString, MaxLength } from 'class-validator';
import { CreateTweetPayload } from '../types';

export class CreateTweetDto implements CreateTweetPayload {
  @IsString()
  @MaxLength(140)
  tweet: string;
}
