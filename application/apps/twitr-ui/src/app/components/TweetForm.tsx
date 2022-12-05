import { Button, Card, Spacer, Textarea } from '@nextui-org/react';

interface TweetFormProps {
  onSubmit: () => void;
  onTextChange: () => void;
}

export const TweetForm: React.FC<TweetFormProps> = (props: TweetFormProps) => {
  return (
    <Card
      css={{
        width: '100%',
        padding: 10,
      }}
    >
      <Textarea
        placeholder="Enter your amazing ideas."
        minRows={1}
        shadow={false}
      />
      <Spacer y={1} />
      <Button onClick={() => props.onSubmit()}>Post</Button>
    </Card>
  );
};
