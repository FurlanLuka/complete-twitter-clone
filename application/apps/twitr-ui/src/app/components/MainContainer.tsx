import { Container } from '@nextui-org/react';
import { PropsWithChildren } from 'react';

export const MainContainer: React.FC<PropsWithChildren> = (props) => (
  <Container
    display="flex"
    alignItems="center"
    justify="center"
    css={{ width: 840, padding: 20 }}
  >
    {props.children}
  </Container>
);
