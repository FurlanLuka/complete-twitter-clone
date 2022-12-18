export interface CreateTweetPayload {
  tweet: string;
}

export interface TweetUpdatedPayload {
  author: string;
  tweet: TweetDto;
}

export interface TweetDto {
  id: string;
  author: string;
  tweet: string;
  likes: number;
  createdAt: number;
}

export interface GetUserTweetsPayload {
  userIds: string[];
  olderThan?: string;
}

export type GetTweetsResponse = TweetDto[];
export type GetTweetResponse = TweetDto;
