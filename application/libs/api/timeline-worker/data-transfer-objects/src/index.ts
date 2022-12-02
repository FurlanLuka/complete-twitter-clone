import { TweetDto } from '@twitr/api/tweet/data-transfer-objects';

export interface UpdateTimelineCommandPayload {
  tweetId: string;
  userIds: string[];
}

export interface RequestTimelineCommandPayload {
  userId: string;
}

export interface TimelineResponse {
  tweets: TweetDto[];
  userId: string;
}
