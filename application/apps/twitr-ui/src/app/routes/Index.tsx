import { MainContainer } from '../components/MainContainer';
import { Timeline } from '../components/Timeline';
import { TweetForm } from '../components/TweetForm';

export const IndexRoute: React.FC = () => {
  return <MainContainer>
    {/* <TweetForm onSubmit={() => {}} onTextChange={() => {}}/> */}
    <Timeline />
  </MainContainer>;
};
