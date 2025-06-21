import {useQuery, useMutation, useQueryClient} from 'react-query';
import {
    fetchDraft,
    fetchAddressCaps,
    releaseBill,
    fetchBill,
    fetchBills,
    fetchDrafts,
    createDraft, fetchAccounts, fetchAddressCap, fetchAccount
} from '../../api/api';

export function useDraftToRelease(id) {
    return useQuery(['draft', id], () => fetchDraft(id));
}
export function useAddressCaps() {
    return useQuery('addressCaps', fetchAddressCaps);
}

export function useAddressCap(address, options = {}) {
    return useQuery(
        ['addressCap', address],
        () => fetchAddressCap(address));
}

export function useBill(id) {
    return useQuery(['bill', id], () => fetchBill(id));
}

// Fetch and cache account list
export function useAccounts() {
    return useQuery('accounts', fetchAccounts);
}

// Fetch released bills, then enrich with account data
export function useBills() {
    const { data: bills = [], isLoading: lb } = useQuery('bills', fetchBills);
    const { data: accounts = [], isLoading: la } = useQuery('accounts', fetchAccounts);

    const enriched = bills.map(b => {
        const acct = accounts.find(a => a.id === b.accountId) || {};
        return {
            ...b,
            accountName: acct.name || `#${b.accountId}`,
            accountType: acct.type === 'CREDITOR' ? 'Creditor' : 'Debtor'
        };
    });

    return {
        data: enriched,
        isLoading: lb || la
    };
}

// Fetch drafts similarly
export function useDrafts() {
    const { data: drafts = [], isLoading: ld } = useQuery('drafts', fetchDrafts);
    const { data: accounts = [], isLoading: la } = useQuery('accounts', fetchAccounts);

    const enriched = drafts.map(d => {
        const acct = accounts.find(a => a.id === d.accountId) || {};
        return {
            ...d,
            accountName: acct.name || `#${d.accountId}`,
            accountType: acct.type === 'CREDITOR' ? 'Creditor' : 'Debtor'
        };
    });

    return {
        data: enriched,
        isLoading: ld || la
    };
}

// Create draft hook
export function useCreateDraft() {
    const qc = useQueryClient();
    return useMutation(createDraft, {
        onSuccess: () => qc.invalidateQueries(['drafts','bills','accounts']),
    });
}

// Release bill hook
export function useReleaseBill() {
    const qc = useQueryClient();
    return useMutation(releaseBill, {
        onSuccess: () => qc.invalidateQueries(['drafts','bills','accounts']),
    });
}

export const useAccount = id =>
    useQuery(['account', id], () => fetchAccount(id));

export function useDraft(id) {
    return useQuery(['draft', id], () => fetchDraft(id));
}