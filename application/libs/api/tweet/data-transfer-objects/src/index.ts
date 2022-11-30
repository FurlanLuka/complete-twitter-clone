import { IsString, MaxLength } from 'class-validator';

export class TweetDto {
  @IsString()
  @MaxLength(140)
  tweet: string;
}