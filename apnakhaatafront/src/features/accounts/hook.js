import { useQuery, useMutation, useQueryClient } from 'react-query';
import {fetchAccounts, createAccount, fetchAccountTxns, fetchAccount} from '../../api/api';

export function useAccounts() {
    return useQuery('accounts', fetchAccounts);
}

export function useCreateAccount() {
    const qc = useQueryClient();
    return useMutation(createAccount, {
        onSuccess: () => qc.invalidateQueries('accounts')
    });
}

export const useAccount = id =>
    useQuery(['account', id], () => fetchAccount(id));

export const useAccountTxns = id =>
    useQuery(['accountTxns', id], () => fetchAccountTxns(id));