import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    fetchDrafts,
    fetchDraft,
    createDraft,
    releaseBill,
    fetchBill,
    fetchAccount,
    fetchRecipes, updateDraft, fetchAccounts
} from '../../api/api';

export function useDrafts() {
    return useQuery('drafts', fetchDrafts);
}

export function useCreateDraft() {
    const qc = useQueryClient();
    return useMutation(createDraft, {
        onSuccess: () => qc.invalidateQueries('drafts')
    });
}

export function useUpdateDraft() {
    const qc = useQueryClient();
    return useMutation(updateDraft, {
        onSuccess: () => qc.invalidateQueries('drafts')
    });
}

export function useDraft(id) {
    return useQuery(['draft', id], () => fetchDraft(id));
}

export function useReleaseBill() {
    const qc = useQueryClient();
    return useMutation(releaseBill, {
        onSuccess: () => qc.invalidateQueries(['drafts','bills','accounts']),
    });
}

export function useBill(id, { enabled } = { enabled: true }) {
    return useQuery(
        ['bill', id],
        () => fetchBill(id),
        { enabled }
    );
}

export function useAccount(id, opts) {
    return useQuery(['account', id], () => fetchAccount(id), opts);
}

export const useRecipes = () => useQuery('recipes', fetchRecipes);

export function useAccountsList() {
    return useQuery('accounts', fetchAccounts);
}