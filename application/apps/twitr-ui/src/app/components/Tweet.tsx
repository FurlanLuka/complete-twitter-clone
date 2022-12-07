import { Card, Text } from '@nextui-org/react';
import { TweetDto } from '@twitr/api/tweet/data-transfer-objects/types';

interface TweetProps {
  tweet: TweetDto;
}

export const Tweet: React.FC<TweetProps> = (props: TweetProps) => {
  return (
    <Card
      css={{
        width: '100%',
        padding: 10,
        marginTop: 20
      }}
    >
      <Text>Author: {props.tweet.author}</Text>
      <Text>Tweet: {props.tweet.tweet}</Text>
      <Text>Likes: {props.tweet.likes}</Text>
    </Card>
  );
};
