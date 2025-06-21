import { useQuery } from 'react-query';
import { fetchAlerts } from '../../api/api';

export function useAlerts() {
    return useQuery('alerts', fetchAlerts, { refetchInterval: 60000 });
}
