// src/features/bills/FinalizeAdjustedBill.jsx
import React, {useState} from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {useReleaseBill, useAccount, useDraft} from './hook';
import toast from 'react-hot-toast';
import { useForm, useFieldArray } from 'react-hook-form';
import {PercentageSlider} from "./PercentageSlider";
import {updateDraft} from "../../api/api";

export default function FinalizeAdjustedBill() {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const { lines: initialLines = [], accountId } = state || {};
    const { data: acc } = useAccount(accountId, { enabled: !!accountId });
    const releaseBill = useReleaseBill();

    const { data: draft, isLoading: loadingDraft } = useDraft(id, { enabled: true });

    // form for adjusting quantities & slider
    const { control, watch, setValue } = useForm({
        defaultValues: { lines: initialLines, pct: 0 }
    });
    const { fields } = useFieldArray({ control, name: 'lines' });
    const { lines, pct } = watch();

    // apply slider reduction
    React.useEffect(() => {
        if (pct == null) return;
        fields.forEach((f, i) => {
            const orig = initialLines[i].quantity;
            const adj = Math.floor(orig * (1 - pct/100));
            setValue(`lines.${i}.quantity`, adj, { shouldDirty: true });
        });
    }, [pct, fields, initialLines, setValue]);

    // recalc total
    const total = lines.reduce(
        (sum, l) => sum + (l.quantity||0)*(l.unitCost||0),
        0
    );

    const onRelease = async () => {
        try {

            console.log(lines);
            console.log(draft);
            // push updated lines

            await updateDraft({
                accountId: draft.accountId,
                draftId: draft.id,
                lines: lines.map(l => ({
                    itemName:  l.itemName,
                    quantity:  l.quantity,
                    unitCost:  l.unitCost
                }))
            });

            // now actually release
            await releaseBill.mutateAsync({ draftId: draft.id });

            toast.success('Bill released');
            navigate('/bills');
        } catch (err) {
            console.error(err);
            toast.error('Failed to release bill');
        }
    };

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
                <h2 className="flex-1 text-center text-lg font-bold text-textPrimary">
                    Final Adjusted Bill
                </h2>
                <div className="w-6"/>
            </div>
            {/* Avatar + Name */}
            <div className="flex flex-col items-center p-4">
                    <img src={ 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVXTo1uDYotfqH0g5pP3auaQSBLzO88oRuj3G20_5rM2Nmh_TSjb87JAUQdfA0OMaPEKk-g7j9tD825LFIS_YrdjuFdCGiawkwU5LYu17PTTdOXpHvJFQrkAo-ID8PwTt_lIDE7cuAr7nMiD-jCYvkP7FfYaLbOp9UBdJP82NKXPL0XBRfK8kMFOG1S-6dSqZuZJ85F4sv6AbqspQt4tTj4Iil8iz2kRZfZnA0IHxivpL-txv1WOiHXb-EmQyraB1M8Zuw_joy0Vg'}
                         alt={'user'}
                         className="h-28 w-28 bg-cardBg rounded-full bg-center bg-cover"
                    />
                <p className="mt-4 text-textPrimary text-xl font-bold">{acc?.name} </p>
            </div>
            {/* Items */}
            <h3 className="text-[#1c180d] text-lg font-bold px-4 pb-2">Items</h3>
            <div className="flex-1 overflow-y-auto space-y-2 px-4">
                {fields.map((f,i) => (
                    <div key={f.id} className="flex justify-between items-center bg-[#fcfbf8] px-4 py-3 rounded-lg">
                        <div>
                            <p className="text-[#1c180d] font-medium">{ lines[i].itemName }</p>
                            <p className="text-[#9e8747] text-sm">
                                Quantity: {lines[i].quantity}, Cost: ₹{lines[i].unitCost}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="h-7 w-7 rounded-full bg-[#f4f0e6] flex items-center justify-center"
                                onClick={() => {
                                    const q = Math.max(0, (lines[i].quantity||0) - 1);
                                    setValue(`lines.${i}.quantity`, q, { shouldDirty: true });
                                }}
                            >−</button>
                            <input
                                type="number"
                                className="w-12 text-center bg-transparent focus:outline-none"
                                {...control.register(`lines.${i}.quantity`, { valueAsNumber: true })}
                            />
                            <button
                                type="button"
                                className="h-7 w-7 rounded-full bg-[#f4f0e6] flex items-center justify-center"
                                onClick={() => {
                                    const q = (lines[i].quantity||0) + 1;
                                    setValue(`lines.${i}.quantity`, q, { shouldDirty: true });
                                }}
                            >＋</button>
                        </div>
                    </div>
                ))}
            </div>
            {/* Slider */}
            <h3 className="text-[#1c180d] text-lg font-bold px-4 pb-2 pt-4">Bill Adjustment</h3>
            <div className="px-4">
                <PercentageSlider value={pct} onChange={v => setValue('pct', v, { shouldDirty: true })} />
            </div>
            {/* Total */}
            <h3 className="text-[#1c180d] text-lg font-bold px-4 pb-2 pt-4">Total Bill</h3>
            <div className="flex items-center gap-4 bg-[#fcfbf8] px-4 py-3 justify-between">
                <p className="text-[#1c180d] font-normal">Total</p>
                <p className="text-[#1c180d] font-normal">₹{total.toLocaleString()}</p>
            </div>
            {/* Release */}
            <div className="p-4">
                <button
                    onClick={onRelease}
                    className="w-full h-14 bg-btnPrimary text-textPrimary font-bold rounded-full"
                >
                    Release Bill
                </button>
            </div>
            <div className="h-5 bg-[#fcfbf8]"/>
        </div>
    );
}
