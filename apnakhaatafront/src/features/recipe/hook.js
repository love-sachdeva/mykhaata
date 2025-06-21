import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    fetchRecipes,
    fetchRecipe,
    createRecipe,
    updateRecipe, fetchRawMaterials
} from '../../api/api';

export const useRecipes = () => useQuery('recipes', fetchRecipes);

export const useRecipe = id =>
    useQuery(['recipe', id], () => fetchRecipe(id));

export const useCreateRecipe = () => {
    const qc = useQueryClient();
    return useMutation(createRecipe, {
        onSuccess: () => qc.invalidateQueries('recipes'),
    });
};

export const useUpdateRecipe = () => {
    const qc = useQueryClient();
    return useMutation(updateRecipe, {
        onSuccess: () => qc.invalidateQueries(['recipe']).then(() => qc.invalidateQueries('recipes')),
    });
};

export const useRawMaterials = () =>
    useQuery('rawMaterials', fetchRawMaterials);
