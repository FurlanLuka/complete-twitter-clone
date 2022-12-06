import { Button, Card, Input, Spacer } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { usePostTweet } from '../api/tweet/post/use-post-tweet';

export const TweetForm: React.FC = () => {
  const [tweet, setTweet] = useState('');
  const postTweet = usePostTweet();

  useEffect(() => {
    if (postTweet.status === 'success') {
      setTweet('');
      postTweet.reset();
    }
  }, [postTweet.status]);

  return (
    <Card
      css={{
        width: '100%',
        padding: 10,
      }}
    >
      <Input
        placeholder="Enter your amazing ideas."
        shadow={false}
        value={tweet}
        onChange={(e) => setTweet(e.target.value)}
      />
      <Spacer y={1} />
      <Button
        onClick={() =>
          postTweet.mutate({
            accessToken: '',
            tweet,
          })
        }
      >
        Post
      </Button>
    </Card>
  );
};
