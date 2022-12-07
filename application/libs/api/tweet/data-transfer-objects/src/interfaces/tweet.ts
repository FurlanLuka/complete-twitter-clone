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
}

export interface GetTweetIdsPayload {
  userIds: string[];
}

export type GetTweetIdsResponse = string[];
