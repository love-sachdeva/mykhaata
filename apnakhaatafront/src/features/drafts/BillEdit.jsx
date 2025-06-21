import React from 'react';
import {
    useNavigate,
    useParams,
    useLocation,
} from 'react-router-dom';
import {
    useDraft,
    useBill,
    useReleaseBill,
    useAccount,
    useCreateDraft,
    useUpdateDraft,
} from './hook';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

// ───────────────────────────────────────────────────────────
// Validation
// ───────────────────────────────────────────────────────────
const itemSchema = yup.object({
    itemName: yup.string().required('Item name required'),
    quantity: yup.number().positive().required('Quantity required'),
    unitCost: yup.number().positive().required('Unit cost required'),
});
const schema = yup
    .object({
        lines: yup.array().of(itemSchema).min(1, 'Add at least one item'),
    })
    .required();

export default function BillEdit() {
    // ─────────────────────────────────────────────────────────
    // Router, params, and state
    // ─────────────────────────────────────────────────────────
    const { id: paramId } = useParams();            // draftId (number) if editing
    const draftId = paramId ? Number(paramId) : undefined;

    const location = useLocation();
    const { state } = location;                     // may contain isDraft, lines, newLine …
    const isDraft   = state?.isDraft ?? true;       // default: editing draft

    const navigate = useNavigate();

    // ─────────────────────────────────────────────────────────
    // Data queries
    // ─────────────────────────────────────────────────────────
    const { data: draft, isLoading: loadingDraft } = useDraft(draftId, {
        enabled: isDraft && !!draftId,
    });
    const { data: bill, isLoading: loadingBill }   = useBill(draftId, {
        enabled: !isDraft && !!draftId,
    });
    const isLoadingRecord = isDraft ? loadingDraft : loadingBill;

    const accountIdFromRecord = (isDraft ? draft : bill)?.accountId;
    const { data: acc, isLoading: loadingAcc } = useAccount(accountIdFromRecord, {
        enabled: !!accountIdFromRecord,
    });

    // ─────────────────────────────────────────────────────────
    // Form setup
    // ─────────────────────────────────────────────────────────
    const {
        register,
        control,
        watch,
        setValue,
        getValues,
        handleSubmit,
        reset,
        formState: { isDirty, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { accountName: '', lines: state?.lines ?? [] },
    });

    const { fields, append } = useFieldArray({
        control,
        name: 'lines',
    });
    const lines = watch('lines');

    // ─────────────────────────────────────────────────────────
    // Load server data → form  (FIXED: removed state?.lines dep)
    // ─────────────────────────────────────────────────────────
    React.useEffect(() => {
        const record = isDraft ? draft : bill;
        if (!record) return;

        // Don’t overwrite while the user is editing
        if (isDirty) return;

        const mergedLines =
            state?.lines?.length ? state.lines : record.lines;

        reset(
            {
                accountName: '',
                lines: mergedLines.map(l => ({
                    itemName : l.itemName,
                    quantity : l.quantity,
                    unitCost : l.unitCost,
                })),
            },
            { keepDirtyValues: true }          // preserve any edits if we ever call reset again
        );
    }, [draft, bill, isDraft, reset, isDirty]);      // ← state?.lines removed

    // accountName from account data
    React.useEffect(() => {
        if (acc?.name) {
            setValue('accountName', acc.name, { shouldDirty: false });
        }
    }, [acc, setValue]);

    // ─────────────────────────────────────────────────────────
    // Handle return from /add-item
    // ─────────────────────────────────────────────────────────
    React.useEffect(() => {
        const newLine = state?.newLine;
        if (!newLine) return;

        append(newLine);                           // marks form dirty

        // rewrite history entry with updated lines
        const { newLine: _omit, ...rest } = state ?? {};
        navigate(location.pathname, {
            replace: true,
            state: { ...rest, lines: getValues('lines') },
        });
    }, [state?.newLine, append, navigate, location.pathname, state, getValues]);

    // ─────────────────────────────────────────────────────────
    // Computed total
    // ─────────────────────────────────────────────────────────
    const total = lines.reduce(
        (sum, l) =>
            sum + (parseFloat(l.quantity) || 0) * (parseFloat(l.unitCost) || 0),
        0
    );

    // ─────────────────────────────────────────────────────────
    // Mutations
    // ─────────────────────────────────────────────────────────
    const createDraft  = useCreateDraft();
    const updateDraft  = useUpdateDraft();
    const releaseDraft = useReleaseBill();
    const draftMutate  = draftId ? updateDraft : createDraft;

    const onSave = async formData => {
        const payload = {
            ...(draftId ? { draftId } : {}),
            accountId: acc.id,
            lines: formData.lines.map(l => ({
                itemName : l.itemName,
                quantity : l.quantity,
                unitCost : l.unitCost,
            })),
        };

        try {
            const response = await draftMutate.mutateAsync(payload);
            toast.success('Draft saved');

            if (draftId) {
                navigate('/drafts');
            } else if (response.id) {
                navigate(`/bills/${response.id}`, {
                    replace: true,
                    state: { isDraft: true },
                });
            }

            reset(
                {
                    accountName: acc.name,
                    lines: response.lines.map(l => ({
                        itemName : l.itemName,
                        quantity : l.quantity,
                        unitCost : l.unitCost,
                    })),
                },
                { keepValues: false }
            );
        } catch (err) {
            console.error(err);
            toast.error('Save failed');
        }
    };

    const onRelease = async () => {
        try {
            navigate(`/bills/${draftId}/finalize`, { state: { isDraft:true } });
        } catch {
            toast.error('Release failed');
        }
    };

    // ─────────────────────────────────────────────────────────
    // Loading
    // ─────────────────────────────────────────────────────────
    if (isLoadingRecord || loadingAcc) {
        return <div className="p-4 text-center">Loading…</div>;
    }

    // ─────────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col min-h-screen bg-brandBg font-sans">

            {/* ───── Header ───── */}
            <div className="flex items-center p-4 pb-2">
                <button
                    onClick={() => navigate('/drafts')}
                    className="text-textPrimary"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                         viewBox="0 0 256 256">
                        <path
                            d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
                    </svg>
                </button>
                <h2 className="flex-1 text-center text-lg font-bold text-textPrimary">
                    {isDraft ? 'Edit Bill' : 'View Bill'}
                </h2>
                <div className="w-6" />
            </div>

            {/* ───── Account card ───── */}
            <div className="flex flex-col items-center p-4">
                <div
                    className="h-28 w-28 bg-cardBg rounded-full bg-center bg-cover"
                    style={{ backgroundImage: `url(${acc.avatarUrl||'https://lh3.googleusercontent.com/aida-public/AB6AXuAVXTo1uDYotfqH0g5pP3auaQSBLzO88oRuj3G20_5rM2Nmh_TSjb87JAUQdfA0OMaPEKk-g7j9tD825LFIS_YrdjuFdCGiawkwU5LYu17PTTdOXpHvJFQrkAo-ID8PwTt_lIDE7cuAr7nMiD-jCYvkP7FfYaLbOp9UBdJP82NKXPL0XBRfK8kMFOG1S-6dSqZuZJ85F4sv6AbqspQt4tTj4Iil8iz2kRZfZnA0IHxivpL-txv1WOiHXb-EmQyraB1M8Zuw_joy0Vg'})` }}
                />
                <p className="mt-4 text-textPrimary text-xl font-bold">{acc.name}</p>
                <p className="text-textSecondary">
                    {acc.phone || acc.gstOrAadhaar}
                </p>
            </div>

            {/* ───── Line items ───── */}
            <h3 className="text-[#1c180d] text-lg font-bold px-4 pb-2 pt-4">
                Items
            </h3>

            <div className="flex-1 overflow-y-auto">
                {fields.map((f, i) => {
                    const { itemName, quantity, unitCost } = lines[i] || {};
                    const lineTotal =
                        (parseFloat(quantity) || 0) * (parseFloat(unitCost) || 0);

                    return isDraft ? (
                        /* Editable row */
                        <div
                            key={f.id}
                            className="flex gap-4 bg-[#fcfbf8] px-4 py-3 justify-between"
                        >
                            <div className="flex-1 flex flex-col justify-center">
                                <p className="text-[#1c180d] text-base font-medium">
                                    {itemName}
                                </p>
                                <p className="text-[#9e8647] text-sm">
                                    Quantity: {quantity}, Cost: ₹{unitCost}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setValue(
                                            `lines.${i}.quantity`,
                                            Math.max(1, (parseInt(quantity) || 0) - 1),
                                            { shouldDirty: true }
                                        )
                                    }
                                    className="h-7 w-7 rounded-full bg-[#f4f0e6] flex items-center justify-center"
                                >
                                    −
                                </button>

                                <input
                                    type="number"
                                    {...register(`lines.${i}.quantity`, { valueAsNumber: true })}
                                    className="w-14 h-8 text-center bg-transparent focus:outline-none"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setValue(
                                            `lines.${i}.quantity`,
                                            (parseInt(quantity) || 0) + 1,
                                            { shouldDirty: true }
                                        )
                                    }
                                    className="h-7 w-7 rounded-full bg-[#f4f0e6] flex items-center justify-center"
                                >
                                    ＋
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Read-only row */
                        <div
                            key={f.id}
                            className="flex items-center gap-4 bg-[#fcfbf8] px-4 py-2 justify-between"
                        >
                            <div className="flex flex-col justify-center">
                                <p className="text-[#1c180d] text-base font-medium">
                                    {itemName}
                                </p>
                                <p className="text-[#9e8647] text-sm">
                                    Quantity: {quantity}, Cost: ₹{unitCost}
                                </p>
                            </div>
                        </div>
                    );
                })}

                {isDraft && (
                    <div className="flex items-center gap-4 bg-[#fcfbf8] px-4 py-2 justify-between">
                        <p className="text-[#1c180d] text-base">Add Item</p>
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `${draftId || ''}/add-item`,
                                    {
                                        state: {
                                            isDraft,
                                            from : location.pathname,
                                            lines: getValues('lines'),   // keep unsaved items
                                        },
                                    }
                                )
                            }
                            className="text-[#1c180d] flex items-center justify-center"
                        >
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/>
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* ───── Total ───── */}
            <h3 className="text-[#1c180d] text-lg font-bold px-4 pb-2 pt-4">
                Total Bill
            </h3>
            <div className="flex items-center gap-4 bg-[#fcfbf8] px-4 min-h-14 justify-between">
                <p className="text-[#1c180d] text-base flex-1">Total</p>
                <p className="text-[#1c180d] text-base">
                    ₹{total.toLocaleString()}
                </p>
            </div>

            {/* ───── Buttons ───── */}
            {isDraft && (
                <div className="p-4 space-y-3">
                    <button
                        type="button"
                        disabled={!isDirty || isSubmitting}
                        onClick={handleSubmit(onSave)}
                        className="w-full h-14 bg-[#f9ba1a] text-[#1c180d] font-bold rounded-full"
                    >
                        {draftId ? 'Save Changes' : 'Save Draft'}
                    </button>
                    <button
                        type="button"
                        onClick={onRelease}
                        className="w-full h-14 bg-[#f4f0e6] text-[#1c180d] font-bold rounded-full"
                    >
                        Release Draft Bill
                    </button>
                </div>
            )}

            <div className="h-5 bg-[#fcfbf8]" />
        </div>
    );
}
