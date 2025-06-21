import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBills, useDrafts } from './hook';
import format from 'date-fns/format';

export default function BillsList(props) {
    const {onlyDrafts} = props;
    const navigate = useNavigate();
    const { data: released = [], isLoading: loadingR } = useBills();
    const { data: drafts   = [], isLoading: loadingD } = useDrafts();
    const [statusFilter, setStatusFilter] = useState( onlyDrafts ? 'drafts' : 'released');
    const [dateOrder,    setDateOrder]    = useState('newest');
    const [searchText,   setSearchText]   = useState('');

    const isLoading = loadingR || loadingD;

    const items = useMemo(() => {
        const source =
            statusFilter === 'drafts'
                ? drafts.filter(d => d.status !== 'RELEASED')
                : released;
        return source
            .filter(b =>
                b.accountName?.toLowerCase().includes(searchText.toLowerCase()) ||
                b.id.toString().includes(searchText)
            )
            .sort((a, b) => {
                const da = new Date(a.releasedAt);
                const db = new Date(b.releasedAt);
                if (isNaN(da) || isNaN(db)) return 0;
                return dateOrder === 'newest' ? db - da : da - db;
            });
    }, [statusFilter, dateOrder, drafts, released, searchText]);

    if (isLoading) {
        return <div className="p-4 text-center">Loading…</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-brandBg font-sans relative">
            {/* Header */}
            <div className="flex items-center p-4 pb-2">
                <button onClick={() => navigate('/')} className="text-textPrimary w-6 h-6">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
                    </svg>
                </button>
                <h2 className="flex-1 text-center text-lg font-bold text-textPrimary">All Bills</h2>
                <div className="w-6" />
            </div>

            {/* Search & Filters */}
            <div className="px-4 space-y-3">
                {/* Search */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-textSecondary" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/>
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        placeholder="Search by ID or Account"
                        className="w-full h-12 pl-10 pr-4 bg-cardBg rounded-full placeholder:text-textSecondary focus:outline-none"
                    />
                </div>

                {/* Slimmer filter pills */}
                <div className="flex gap-2">
                    {['released','drafts'].map(val => (
                        <button
                            key={val}
                            onClick={() => setStatusFilter(val)}
                            className={`
                flex-auto min-w-0 h-10 px-3 text-s rounded-full font-medium
                ${statusFilter===val
                                ? 'bg-btnPrimary text-textPrimary'
                                : 'bg-cardBg text-textPrimary'}
              `}
                        >
                            {val.charAt(0).toUpperCase() + val.slice(1)}
                        </button>
                    ))}
                    {['newest','oldest'].map(val => (
                        <button
                            key={val}
                            onClick={() => setDateOrder(val)}
                            className={`
                flex-auto min-w-0 h-10 px-3 text-s rounded-full font-medium
                ${dateOrder===val
                                ? 'bg-btnPrimary text-textPrimary'
                                : 'bg-cardBg text-textPrimary'}
              `}
                        >
                            {val.charAt(0).toUpperCase() + val.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 space-y-3 py-3">
                {items.length === 0 && statusFilter === 'drafts' ? (
                    <div className="p-6 text-center text-textSecondary">
                        🙌 You did it! No more drafts !!
                    </div>
                ) : (items.map(b => {
                    const total = Array.isArray(b.lines)
                        ? b.lines.reduce((sum, l) => sum + (l.lineTotal || 0), 0)
                        : 0;
                    const dt = new Date(b.releasedAt);
                    const dateStr = !isNaN(dt) ? format(dt, 'MMM d, yyyy') : '';

                    // Determine color by accountType
                    const isCreditor = b.accountType === 'Creditor';
                    const typeColor  = isCreditor ? 'text-[#d6934f]' : 'text-[#859669]';

                    return (
                        <button
                            key={b.id}
                            onClick={() =>
                                navigate(`/bills/${b.id}/edit`, {
                                    state: { isDraft: statusFilter === 'drafts' }
                                })
                            }
                            className="w-full text-left flex items-center justify-between bg-brandBg py-2 px-3 rounded-lg"
                        >
                            <div className="flex flex-col">
                                <p className={`font-medium ${typeColor}`}>
                                    {b.accountType}: {b.accountName}
                                </p>
                                <p className="text-textSecondary text-sm">
                                    Bill ID: {b.id} {dateStr && <>· {dateStr}</>}
                                </p>
                            </div>
                            <p className="text-textPrimary font-bold">
                                ₹{total.toLocaleString()}
                            </p>
                        </button>
                    );
                }))}
            </div>

            {/* Floating Add Button */}
            <button
                onClick={() => navigate('/drafts/new')}
                className="
          fixed bottom-6 right-6
          h-14 w-14
          bg-btnPrimary text-textPrimary
          rounded-full shadow-lg
          flex items-center justify-center
        "
            >
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                    <path
                        d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/>
                </svg>
            </button>
        </div>
    );
}
