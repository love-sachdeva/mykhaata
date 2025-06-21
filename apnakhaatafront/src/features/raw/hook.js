import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    adjustRawMaterial,
    createRawMaterial,
    fetchRawMaterial,
    fetchRawMaterials,
} from '../../api/api';

export function useRawMaterials() {
    return useQuery('rawMaterials', fetchRawMaterials);
}

export function useCreateRawMaterial() {
    const qc = useQueryClient();
    return useMutation(createRawMaterial, {
        onSuccess: () => qc.invalidateQueries('rawMaterials'),
    });
}

export function useRawMaterial(id) {
    return useQuery(['rawMaterial', id], () => fetchRawMaterial(id));
}

export function useAdjustRawMaterial() {
    const qc = useQueryClient();
    return useMutation(adjustRawMaterial, {
        onSuccess: () => {
            // refresh the list and detail
            qc.invalidateQueries('rawMaterials')
            qc.invalidateQueries(['rawMaterial']);
        }
    });
}
