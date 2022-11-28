import { IsString, IsUUID, MaxLength } from 'class-validator';

export class TweetDto {
  @IsUUID(4)
  author: string;

  @IsString()
  @MaxLength(140)
  tweet: string;
}
