// src/features/bills/FinalizeBill.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useDraft,
    useAccount,
    useAddressCap,    // you’ll need a hook that given accountId returns { address, maxQuantity }
    useReleaseBill
} from './hook';
import format from 'date-fns/format';

export default function FinalizeBill() {
    const { id } = useParams();            // draftId
    const navigate = useNavigate();

    // 1️⃣ load draft data
    const { data: draft,  isLoading: loadingDraft }  = useDraft(id, { enabled: true });
    // 2️⃣ pull in account info
    const accountId = draft?.accountId;
    const { data: acc, isLoading: loadingAcc } = useAccount(accountId, { enabled: !!accountId });
    const lines = draft?.lines ?? [];
    // 3️⃣ pull in address cap
    const { data: cap, isLoading: loadingCap } = useAddressCap(acc?.city, { enabled: !!acc?.city });

    // 4️⃣ let user finalize
    const release = useReleaseBill();
    const onFinalize = async () => {
        try {
            navigate(`/bills/${draft.id}/finalize/adjust`, { state: { isDraft : true, lines, accountId } });
        } catch {
            // TODO toast.error
        }
    };

    if (loadingDraft || loadingAcc || loadingCap) {
        return <div className="p-4 text-center">Loading…</div>;
    }

    // compute totals
    const totalQty    = draft.lines.reduce((sum, l) => sum + (l.quantity||0), 0);
    const totalAmount = draft.lines.reduce((sum, l) => sum + ((l.quantity||0)*(l.unitCost||0)), 0);

    // decide if we will need to scale down
    const overCap = totalQty > cap.maxQuantity;
    const warning = overCap
        ? `This address has a quantity cap of ${cap.maxQuantity} units.\nFinalizing this bill will proportionally reduce all items to fit within the cap.`
        : `This address has a quantity cap of ${cap.maxQuantity} units.`;

    return (
        <div className="flex flex-col min-h-screen bg-brandBg font-sans">
            {/* Header */}
            <div className="flex items-center p-4 pb-2">
                <button onClick={() => navigate(-1)} className="w-6 h-6 text-textPrimary">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path
                            d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
                    </svg>
                </button>
                <h2 className="flex-1 text-center text-lg font-bold text-textPrimary">Finalize Bill</h2>
                <div className="w-6"/>
            </div>

            <div className="px-4 space-y-6 flex-1 overflow-y-auto">
                {/* Bill Details */}
                <h3 className="text-textPrimary text-lg font-bold">Bill Details</h3>
                <div className="flex items-center gap-3">
                    <img
                        src={'https://lh3.googleusercontent.com/aida-public/AB6AXuAVXTo1uDYotfqH0g5pP3auaQSBLzO88oRuj3G20_5rM2Nmh_TSjb87JAUQdfA0OMaPEKk-g7j9tD825LFIS_YrdjuFdCGiawkwU5LYu17PTTdOXpHvJFQrkAo-ID8PwTt_lIDE7cuAr7nMiD-jCYvkP7FfYaLbOp9UBdJP82NKXPL0XBRfK8kMFOG1S-6dSqZuZJ85F4sv6AbqspQt4tTj4Iil8iz2kRZfZnA0IHxivpL-txv1WOiHXb-EmQyraB1M8Zuw_joy0Vg'}
                        alt={acc.name}
                        className="h-12 w-12 rounded-full object-cover bg-cardBg"
                    />
                    <div>
                        <p className="text-textPrimary font-medium">{acc.name}</p>
                        <p className="text-[#9e8747] text-sm">Bill #{draft.id}</p>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-cardBg p-3 rounded-lg">
                        <div className="bg-cardBg p-2 rounded"><BoxIcon /></div>
                        <div>
                            <p className="text-textPrimary font-medium">Total Quantity</p>
                            <p className="text-[#9e8747] text-sm">{totalQty} units</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-cardBg p-3 rounded-lg">
                        <div className="bg-cardBg p-2 rounded"><RupeeIcon /></div>
                        <div>
                            <p className="text-textPrimary font-medium">Total Amount</p>
                            <p className="text-[#9e8747] text-sm">₹{totalAmount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Address Cap */}
                <h3 className="text-textPrimary text-lg font-bold">Address Cap</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-cardBg p-3 rounded-lg">
                        <div className="bg-cardBg p-2 rounded"><MapPinIcon /></div>
                        <div>
                            <p className="text-textPrimary font-medium">Address</p>
                            <p className="text-[#9e8747] text-sm">{cap.address}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-cardBg p-3 rounded-lg">
                        <div className="bg-cardBg p-2 rounded"><BoxIcon /></div>
                        <div>
                            <p className="text-textPrimary font-medium">Quantity Cap</p>
                            <p className="text-[#9e8747] text-sm">{cap.maxQuantity} units</p>
                        </div>
                    </div>
                </div>

                <p className="text-textPrimary text-sm whitespace-pre-line">{warning}</p>
            </div>

            {/* Finalize button */}
            <div className="p-4">
                <button
                    onClick={onFinalize}
                    className="w-full h-14 bg-btnPrimary text-textPrimary font-bold rounded-full"
                >
                    Finalize Bill
                </button>
            </div>
        </div>
    );
}

// ─── simple inline SVG components ─────────────────

function BoxIcon() {
    return (
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path
                d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z"
            ></path>
            <line x1="32" y1="106" x2="128" y2="160"/>
            <line x1="224" y1="106" x2="128" y2="160"/>
        </svg>
    );
}

function RupeeIcon() {
    return (
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path
                d="M208,80a8,8,0,0,1-8,8H167.85c.09,1.32.15,2.65.15,4a60.07,60.07,0,0,1-60,60H92.69l72.69,66.08a8,8,0,1,1-10.76,11.84l-88-80A8,8,0,0,1,72,136h36a44.05,44.05,0,0,0,44-44c0-1.35-.07-2.68-.19-4H72a8,8,0,0,1,0-16h75.17A44,44,0,0,0,108,48H72a8,8,0,0,1,0-16H200a8,8,0,0,1,0,16H148.74a60.13,60.13,0,0,1,15.82,24H200A8,8,0,0,1,208,80Z"
            ></path>
        </svg>
    );
}

function MapPinIcon() {
    return (
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path
                d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"
            ></path>
        </svg>
    );
}
