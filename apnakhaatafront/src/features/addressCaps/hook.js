import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchAddressCaps, upsertAddressCap} from '../../api/api';

export const useAddressCaps = () => useQuery('addressCaps', fetchAddressCaps);

export const useUpdateAddressCap = () => {
    const qc = useQueryClient();
    return useMutation(upsertAddressCap, {
        onSuccess: () => qc.invalidateQueries('addressCaps'),
    });
};
