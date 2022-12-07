import { useEffect } from 'react';
import { TimelineResponse } from '@twitr/api/timeline-worker/data-transfer-objects/types';
import { timelineUpdatedEventHandler } from '../api/timeline/timeline-updated-event';
import { websocketInstance } from '../api/websocket/websocket';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { TIMELINE_QUERY_KEY } from '../api/timeline';
import { Tweet } from './Tweet';

export const Timeline: React.FC = () => {
  const timelineData: UseQueryResult<TimelineResponse> =
    useQuery(TIMELINE_QUERY_KEY, {
      enabled: false,
    });

  useEffect(() => {
    websocketInstance.addHandler(
      'TIMELINE_UPDATED_HANDLER',
      timelineUpdatedEventHandler
    );

    return () => {
      websocketInstance.removeHandler('TIMELINE_UPDATED_HANDLER');
    };
  }, []);

  if (timelineData.isSuccess) {
    return (
      <>
        {timelineData.data.tweets.map((tweet) => (
          <Tweet tweet={tweet} key={tweet.id} />
        ))}
      </>
    );
  }

  return <></>;
};
