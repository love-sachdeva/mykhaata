import { useQuery } from 'react-query';
import { fetchOverview, fetchActivities } from '../../api/api';

export const useOverview   = () => useQuery('overview', fetchOverview);
export const useActivities = () => useQuery('activities', fetchActivities);
