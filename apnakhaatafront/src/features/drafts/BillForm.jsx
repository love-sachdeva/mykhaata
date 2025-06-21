import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCreateDraft, useAccountsList } from './hook';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { v4 as uuid } from 'uuid';

// --- Validation schemas ---
const itemSchema = yup.object({
    itemName: yup.string().required('Name required'),
    quantity: yup.number().positive().required('Qty required'),
    unitCost: yup.number().positive().required('Cost required'),
});
const schema = yup
    .object({
        accountName: yup.string().required('Customer required'),
        lines: yup.array().of(itemSchema).min(1, 'Add at least one item'),
    })
    .required();

export default function BillForm() {
    const navigate = useNavigate();

    // rename to avoid ESLint 'location' global
    const loc = useLocation();
    const { state } = loc;

    const create = useCreateDraft();
    const { data: accounts = [] } = useAccountsList();

    const [open, setOpen] = React.useState(false);
    const [selectedAccountId, setSelectedAccountId] = React.useState(
        state?.accountId ?? null
    );

    const defaultValues = React.useMemo(
        () => ({
            accountName: state?.accountName ?? '',
            lines: state?.lines ?? [],
        }),
        [state]
    );

    const {
        register,
        watch,
        setValue,
        getValues,
        handleSubmit,
        control,
        formState: { errors, isDirty, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues,
    });

    const accountName = watch('accountName');

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'lines',
        keyName: 'fieldId',
    });

    const accountSuggestions = React.useMemo(
        () =>
            accounts
                .filter((a) =>
                    a.name.toLowerCase().includes(accountName.toLowerCase())
                )
                .slice(0, 5),
        [accounts, accountName]
    );

    React.useEffect(() => {
        const newLine = state?.newLine;
        if (newLine) {
            append({ ...newLine, fieldId: uuid() });

            // replace history state
            const { newLine: _, ...rest } = state;
            navigate(loc.pathname, {
                replace: true,
                state: {
                    ...rest,
                    accountName: getValues('accountName'),
                    lines: getValues('lines'),
                },
            });
        }
    }, [
        state?.newLine,
        append,
        navigate,
        loc.pathname,
        getValues,
        state,
    ]);

    const total = fields.reduce(
        (sum, f) =>
            sum +
            (parseFloat(f.quantity) || 0) *
            (parseFloat(f.unitCost) || 0),
        0
    );

    const onSubmit = async (data) => {
        if (!selectedAccountId) {
            toast.error('Please select a valid customer');
            return;
        }
        try {
            await create.mutateAsync({
                accountId: selectedAccountId,
                lines: data.lines.map((l) => ({
                    itemName: l.itemName,
                    quantity: l.quantity,
                    unitCost: l.unitCost,
                })),
            });
            toast.success('Draft created');
            navigate('/drafts');
        } catch {
            toast.error('Creation failed');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-brandBg font-sans">
            {/* Header */}
            <div className="flex items-center p-4 pb-2">
                <button onClick={() => navigate('/drafts')} className="text-textPrimary w-6 h-6">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path
                            d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
                    </svg>
                </button>
                <h2 className="flex-1 text-center text-lg font-bold text-textPrimary">
                    Create Bill
                </h2>
                <div className="w-6"/>
            </div>

            {/* Account Autocomplete */}
            <div className="relative px-4 pb-4">
                <input
                    {...register('accountName')}
                    placeholder="Start typing customer..."
                    onFocus={() => setOpen(true)}
                    className="w-full h-14 px-4 bg-cardBg rounded-xl placeholder:text-textSecondary focus:outline-none"
                />
                {open && accountName && (
                    <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow max-h-48 overflow-y-auto w-full">
                        {accountSuggestions.map((a) => (
                            <li
                                key={a.id}
                                onClick={() => {
                                    setValue('accountName', a.name, {
                                        shouldDirty: true,
                                    });
                                    setSelectedAccountId(a.id);
                                    setOpen(false);
                                }}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {a.name}{' '}
                                <span className="text-xs text-gray-500">
                  ({a.type.toLowerCase()})
                </span>
                            </li>
                        ))}
                        {!accountSuggestions.length && (
                            <li className="px-4 py-2 text-gray-400">
                                No match found
                            </li>
                        )}
                    </ul>
                )}
                {errors.accountName && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.accountName.message}
                    </p>
                )}
            </div>

            {/* Items */}
            <h3 className="text-[#1c180d] text-lg font-bold px-4 pb-2 pt-4">
                Items
            </h3>
            <div className="flex-1 overflow-y-auto">
                {fields.map((f, i) => {
                    const { itemName, quantity, unitCost, fieldId } = f;
                    const lineTotal =
                        (parseFloat(quantity) || 0) *
                        (parseFloat(unitCost) || 0);
                    return (
                        <div
                            key={fieldId}
                            className="flex items-center gap-4 bg-[#fcfbf8] px-4 py-3 justify-between"
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
                                    {...register(`lines.${i}.quantity`)}
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

                            <p className="text-[#1c180d] text-base">
                                ₹{lineTotal}
                            </p>

                            <button
                                type="button"
                                onClick={() => remove(i)}
                                className="text-red-600 ml-2"
                            >
                                ✕
                            </button>
                        </div>
                    );
                })}

                {/* Add Item */}
                <div className="flex items-center gap-4 bg-[#fcfbf8] px-4 py-2 justify-between">
                    <p className="text-[#1c180d] text-base">Add Item</p>
                    <button
                        type="button"
                        onClick={() =>
                            navigate('add-item', {
                                state: {
                                    from: loc.pathname,
                                    accountId: selectedAccountId,
                                    accountName: getValues('accountName'),
                                    lines: getValues('lines'),
                                },
                            })
                        }
                        className="text-[#1c180d] flex items-center justify-center"
                    >
                        ＋
                    </button>
                </div>
            </div>

            {/* Total */}
            <h3 className="text-[#1c180d] text-lg font-bold px-4 pb-2 pt-4">
                Total Bill
            </h3>
            <div className="flex items-center gap-4 bg-[#fcfbf8] px-4 min-h-14 justify-between">
                <p className="text-[#1c180d] text-base flex-1">Total</p>
                <p className="text-[#1c180d] text-base">
                    ₹{total.toLocaleString()}
                </p>
            </div>

            {/* Save Draft */}
            <div className="p-4">
                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={!isDirty || isSubmitting}
                    className={`w-full h-14 rounded-full font-bold ${
                        isDirty
                            ? 'bg-[#f9ba1a] text-[#1c180d]'
                            : 'bg-cardBg text-textSecondary'
                    }`}
                >
                    Save Draft
                </button>
            </div>

            <div className="h-5 bg-[#fcfbf8]" />
        </div>
    );
}
