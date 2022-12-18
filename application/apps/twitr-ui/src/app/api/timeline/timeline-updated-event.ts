import { TimelineResponse } from '@twitr/api/timeline/data-transfer-objects/types';
import { TIMELINE_QUERY_KEY } from '.';
import { queryClient } from '../../../main';

// offload a lot of calculations to user

export const timelineUpdatedEventHandler = (data: TimelineResponse) => {
  queryClient.setQueryData(TIMELINE_QUERY_KEY, () => {
    return data;
  });
  queryClient.setDefaultOptions({
    queries: {
      staleTime: Infinity,
    },
  });
};
