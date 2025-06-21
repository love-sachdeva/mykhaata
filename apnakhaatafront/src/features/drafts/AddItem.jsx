import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useRecipes } from './hook';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
    itemName: yup.string().required('Recipe is required'),
    quantity: yup
        .number()
        .typeError('Must be a number')
        .positive('Must be positive')
        .required('Quantity is required'),
    unitCost: yup
        .number()
        .typeError('Must be a number')
        .positive('Must be positive')
        .required('Unit cost is required'),
});

export default function AddItem() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location  = useLocation();
    const { state } = location; // may carry accountName, lines …

    const { data: recipes = [] } = useRecipes();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { itemName: '', quantity: 1, unitCost: 0 },
    });

    const itemName = watch('itemName');
    const [open, setOpen] = React.useState(false);

    const suggestions = recipes
        .filter(r => r.productName.toLowerCase().includes(itemName.toLowerCase()))
        .slice(0, 5);

    const onSubmit = data => {
        const returnTo = state?.from ?? `/bills/${id}/edit`;
        navigate(returnTo, {
            state: {
                ...state, // 🔧 keep whatever was passed in (accountName, lines …)
                newLine: {
                    itemName: data.itemName,
                    quantity: Number(data.quantity),
                    unitCost: Number(data.unitCost),
                },
            },
        });
    };

    // --- UI unchanged --------------------------------------------------------
    return (
        <div className="flex flex-col min-h-screen bg-brandBg font-sans">
            {/* Header */}
            <div className="flex items-center p-4 pb-2">
                <button onClick={() => navigate(-1)} className="text-textPrimary w-6 h-6">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path
                            d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
                    </svg>
                </button>
                <h2 className="flex-1 text-center text-lg font-bold text-textPrimary">
                    Add Item
                </h2>
                <div className="w-6"/>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="px-4 space-y-6 flex-1">
                {/* Recipe Autocomplete */}
                <div className="relative">
                    <label className="block text-textPrimary font-medium mb-2">Recipe</label>
                    <input
                        {...register('itemName')}
                        placeholder="Start typing recipe..."
                        onFocus={() => setOpen(true)}
                        className="w-full h-14 p-4 bg-cardBg rounded-xl placeholder:text-textSecondary focus:outline-none"
                    />
                    {open && itemName && (
                        <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow max-h-48 overflow-y-auto w-full">
                            {suggestions.map(r => (
                                <li
                                    key={r.id}
                                    onClick={() => {
                                        setValue('itemName', r.productName, { shouldDirty: true });
                                        setOpen(false);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    {r.productName}
                                </li>
                            ))}
                            {suggestions.length === 0 && (
                                <li className="px-4 py-2 text-gray-400">No match found</li>
                            )}
                        </ul>
                    )}
                    {errors.itemName && (
                        <p className="text-red-500 text-sm mt-1">{errors.itemName.message}</p>
                    )}
                </div>

                {/* Quantity */}
                <div>
                    <label className="block text-textPrimary font-medium mb-2">Quantity</label>
                    <input
                        type="number"
                        {...register('quantity')}
                        className="w-full h-14 p-4 bg-cardBg rounded-xl placeholder:text-textSecondary focus:outline-none"
                    />
                    {errors.quantity && (
                        <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
                    )}
                </div>

                {/* Unit Cost */}
                <div>
                    <label className="block text-textPrimary font-medium mb-2">Unit Cost</label>
                    <input
                        type="number"
                        {...register('unitCost')}
                        className="w-full h-14 p-4 bg-cardBg rounded-xl placeholder:text-textSecondary focus:outline-none"
                    />
                    {errors.unitCost && (
                        <p className="text-red-500 text-sm mt-1">{errors.unitCost.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full h-14 bg-btnPrimary text-textPrimary font-bold rounded-full"
                >
                    Add Item
                </button>
            </form>

            <div className="h-5 bg-[#fcfbf8]" />
        </div>
    );
}
