export interface FollowPayload {
  handle: string;
}

export interface GetFollowersPayload {
  userId: string;
}

export interface GetFolloweesPayload {
  userId: string;
}

export type GetFollowersResponse = string[];

export type GetFolloweesResponse = string[];
