import React, {useMemo, useState} from 'react';
import { useAccounts } from './hook';
import { useNavigate } from 'react-router-dom';

export default function AccountsList() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('ALL'); // ALL, CREDITOR, DEBTOR
    const { data: accounts = [], isLoading } = useAccounts();
    const filtered = useMemo(() => {
        return accounts
            .filter(a =>
                (typeFilter === 'ALL' || a.type === typeFilter) &&
                a.name.toLowerCase().includes(search.toLowerCase())
            );
    }, [accounts, search, typeFilter]);

    if (isLoading) return <div className="p-4 text-center">Loading…</div>;

    return (
        <div className="flex flex-col min-h-screen bg-brandBg font-sans">
            {/* Header */}
            <div className="flex items-center p-4 pb-2 justify-between">
                <button onClick={() => navigate(-1)} className="text-textPrimary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
                    </svg>
                </button>
                <h2 className="flex-1 text-center text-lg font-bold text-textPrimary">Accounts</h2>
                <div className="w-6" />
            </div>


            {/* Search */}
            <div className="px-4 py-3">
                <div className="flex items-center bg-cardBg rounded-xl h-12 px-4">
                    <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="flex-1 bg-cardBg placeholder-textSecondary focus:outline-none"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 px-4 pb-3 overflow-x-auto">
                {[
                    { label: 'All',      value: 'ALL' },
                    { label: 'Creditor', value: 'CREDITOR' },
                    { label: 'Debtor',   value: 'DEBTOR' }
                ].map(f => (
                    <button
                        key={f.value}
                        onClick={() => setTypeFilter(f.value)}
                        className={`flex items-center gap-2 rounded-xl h-8 px-4 
              ${typeFilter===f.value ? 'bg-btnPrimary text-textPrimary' : 'bg-cardBg text-textPrimary'}`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {filtered.map(a => (
                    <button
                        key={a.id}
                        onClick={() => navigate(`/accounts/${a.id}`)}
                        className="w-full text-left flex items-center gap-4 bg-brandBg px-4 py-3"
                    >
                        <div
                            className="h-14 w-14 bg-cardBg rounded-full bg-center bg-cover"
                            style={{ backgroundImage: `url(${a.avatarUrl||'https://lh3.googleusercontent.com/aida-public/AB6AXuAVXTo1uDYotfqH0g5pP3auaQSBLzO88oRuj3G20_5rM2Nmh_TSjb87JAUQdfA0OMaPEKk-g7j9tD825LFIS_YrdjuFdCGiawkwU5LYu17PTTdOXpHvJFQrkAo-ID8PwTt_lIDE7cuAr7nMiD-jCYvkP7FfYaLbOp9UBdJP82NKXPL0XBRfK8kMFOG1S-6dSqZuZJ85F4sv6AbqspQt4tTj4Iil8iz2kRZfZnA0IHxivpL-txv1WOiHXb-EmQyraB1M8Zuw_joy0Vg'})` }}
                        />
                        <div>
                            <p className="text-textPrimary text-base font-medium">{a.name}</p>
                            <p className="text-textSecondary text-sm">
                                {a.type==='CREDITOR' ? 'Creditor' : 'Debtor'}
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Add Button */}
            <div className="flex justify-end p-5">
                <button
                    onClick={() => navigate('/accounts/new')}
                    className="flex items-center justify-center rounded-xl h-14 w-14 bg-btnPrimary text-textPrimary text-2xl"
                >
                    +
                </button>
            </div>
        </div>
    );
}
