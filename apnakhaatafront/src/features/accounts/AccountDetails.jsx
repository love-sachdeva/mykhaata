import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccount, useAccountTxns } from './hook';

export default function AccountDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: acc, isLoading: la } = useAccount(id);
    const { data: txns = [], isLoading: lt } = useAccountTxns(id);

    if (la || lt) return <div className="p-4 text-center">Loading…</div>;

    return (
        <div className="flex flex-col min-h-screen bg-brandBg font-sans">
            {/* Header */}
            <div className="flex items-center p-4 pb-2">
                <button onClick={()=>navigate(-1)} className="text-textPrimary">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128...Z"/></svg>
                </button>
                <h2 className="flex-1 text-center text-lg font-bold text-textPrimary">Account Details</h2>
                <div className="w-6" />
            </div>

            {/* Avatar & Name */}
            <div className="flex flex-col items-center p-4">
                <div
                    className="h-28 w-28 bg-cardBg rounded-full bg-center bg-cover"
                    style={{ backgroundImage: `url(${acc.avatarUrl||'https://lh3.googleusercontent.com/aida-public/AB6AXuAVXTo1uDYotfqH0g5pP3auaQSBLzO88oRuj3G20_5rM2Nmh_TSjb87JAUQdfA0OMaPEKk-g7j9tD825LFIS_YrdjuFdCGiawkwU5LYu17PTTdOXpHvJFQrkAo-ID8PwTt_lIDE7cuAr7nMiD-jCYvkP7FfYaLbOp9UBdJP82NKXPL0XBRfK8kMFOG1S-6dSqZuZJ85F4sv6AbqspQt4tTj4Iil8iz2kRZfZnA0IHxivpL-txv1WOiHXb-EmQyraB1M8Zuw_joy0Vg'})` }}
                />
                <p className="mt-4 text-textPrimary text-xl font-bold">{acc.name}</p>
                <p className="text-textSecondary">{acc.phone || acc.gstOrAadhaar}</p>
            </div>

            {/* Balance */}
            <div className="px-4">
                <h3 className="text-textPrimary text-lg font-bold pb-2">Balance</h3>
                <div className="flex justify-between bg-brandBg py-2">
                    <span className="text-textPrimary">Total Due</span>
                    <span className="text-textPrimary">₹{acc.balance}</span>
                </div>
            </div>

            {/* Info */}
            <div className="px-4 pt-4">
                <h3 className="text-textPrimary text-lg font-bold pb-2">Account Information</h3>
                {[
                    ['Name', acc.name],
                    ['Address', acc.address],
                    ['City', acc.city],
                    ['GST/Aadhaar', acc.gstOrAadhaar],
                    ['Type', acc.type==='CREDITOR'?'Creditor':'Debtor']
                ].map(([label, val]) => (
                    <div key={label} className="flex justify-between py-3 border-t border-cardBg">
                        <span className="text-textSecondary">{label}</span>
                        <span className="text-textPrimary">{val}</span>
                    </div>
                ))}
            </div>

            {/* Transactions */}
            <div className="px-4 pt-4 flex-1 overflow-y-auto">
                <h3 className="text-textPrimary text-lg font-bold pb-2">Transactions</h3>
                {txns.map(t => (
                    <div key={t.id} className="flex justify-between items-center py-3 border-t border-cardBg">
                        <div>
                            <p className="text-textPrimary">{t.title}</p>
                            <p className="text-textSecondary text-sm">{t.subtitle}</p>
                        </div>
                        <p className={`text-base font-medium ${t.amount < 0 ? 'text-red-600' : 'text-textPrimary'}`}>
                            {t.amount<0 ? '-' : ''}₹{Math.abs(t.amount)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
