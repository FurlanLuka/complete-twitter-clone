import {
  Card,
  Spacer,
  Button,
  Text,
  Input,
  Link,
} from '@nextui-org/react';

interface LoginFormProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = (props: LoginFormProps) => {
  return (
    <Card
      css={{
        maxWidth: 350,
        padding: 20,
        marginTop: 150,
      }}
    >
      <Card.Body>
        <Text
          h1
          weight="bold"
          css={{
            margin: 'auto',
            mb: '20px',
          }}
        >
          Twitr
        </Text>
        <Spacer y={2} />
        <Input
          clearable
          bordered
          fullWidth
          color="primary"
          size="lg"
          placeholder="username"
          onChange={(e) => props.onUsernameChange(e.target.value)}
        />
        <Spacer y={1} />
        <Input
          clearable
          bordered
          fullWidth
          color="primary"
          size="lg"
          placeholder="Password"
          type="password"
          onChange={(e) => props.onPasswordChange(e.target.value)}
        />
        <Spacer y={2} />
        <Button onClick={() => props.onLoginClick()}>Sign in</Button>
        <Spacer y={1} />
        <Link onPress={() => props.onRegisterClick()}>
          Don't have an account? Register
        </Link>
      </Card.Body>
    </Card>
  );
};
