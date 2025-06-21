import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDraftToRelease, useAddressCaps, useReleaseBill } from './hook';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

const schema = yup.object({
    reductionPercentage: yup.number().min(0).max(100).required()
}).required();

export default function ReleaseForm() {
    const [params] = useSearchParams();
    const draftId = Number(params.get('draftId'));
    const navigate = useNavigate();

    const { data: draft, isLoading: ld } = useDraftToRelease(draftId);
    const { data: caps = [] } = useAddressCaps();
    const { mutateAsync, isLoading: lr } = useReleaseBill();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { reductionPercentage: 0 }
    });

    if (ld) return <div>Loading…</div>;
    if (!draft) return <div>Draft not found</div>;

    const cap = caps.find(c => c.address === draft.accountAddress);

    const onSubmit = async ({ reductionPercentage }) => {
        try {
            const res = await mutateAsync({ draftId, reductionPercentage });
            toast.success('Bill released!');
            navigate(`/bills/${res.billId}`);
        } catch {
            toast.error('Release failed');
        }
    };

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <h2 className="text-xl font-heading">Release #{draftId}</h2>
            <div className="bg-white p-4 rounded shadow">
                <p><strong>Account:</strong> {draft.accountName}</p>
                <p><strong>Address:</strong> {draft.accountAddress}</p>
            </div>

            <div className="bg-white p-4 rounded shadow space-y-2">
                {draft.lines.map((l,i) => (
                    <div key={i} className="flex justify-between">
                        <span>{l.itemName} ({l.quantity}×₹{l.unitCost})</span>
                        <span>₹{l.lineTotal}</span>
                    </div>
                ))}
            </div>

            {cap && (
                <div className="bg-parchment p-4 rounded">
                    <p><strong>Address Cap:</strong> {cap.maxQuantity}</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label>Extra Reduction (%)</label>
                    <input
                        type="number"
                        {...register('reductionPercentage')}
                        className="ml-2 p-1 border rounded w-20"
                    />
                    {errors.reductionPercentage && (
                        <p className="text-red-600">{errors.reductionPercentage.message}</p>
                    )}
                </div>
                <button type="submit" disabled={lr} className="bg-accent text-white px-4 py-2 rounded-lg">
                    {lr ? 'Releasing…' : 'Release Bill'}
                </button>
            </form>
        </div>
    );
}
