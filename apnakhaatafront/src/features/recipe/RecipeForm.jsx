import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateRecipe, useRawMaterials } from './hook';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

const componentSchema = yup.object({
    rawMaterialName: yup.string().required('Raw Material is required'),
    qtyPerUnit:      yup
        .number()
        .typeError('Enter a number')
        .positive('Must be positive')
        .required('Quantity is required'),
});

const schema = yup.object({
    productName: yup.string().required('Product name is required'),
    components:  yup.array().of(componentSchema).min(1, 'Add at least one component'),
}).required();

export default function RecipeForm() {
    const navigate = useNavigate();
    const createMutation = useCreateRecipe();
    const { data: rawMaterials = [], isLoading: rawLoading } = useRawMaterials();

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { productName: '', components: [{ rawMaterialName: '', qtyPerUnit: '' }] }
    });
    const { fields, append, remove } = useFieldArray({ control, name: 'components' });

    const [openIndex, setOpenIndex] = React.useState(null);
    const values = watch('components');

    const onSubmit = async data => {
        const dto = {
            productName: data.productName,
            components: data.components.map(c => ({
                rawMaterialName: c.rawMaterialName,
                quantityPerUnit: c.qtyPerUnit
            }))
        };
        try {
            await createMutation.mutateAsync(dto);
            toast.success('Recipe saved');
            navigate('/recipes');
        } catch {
            toast.error('Failed to save');
        }
    };

    if (rawLoading) return <div className="p-4 text-center">Loading…</div>;

    return (
        <div className="flex flex-col min-h-screen bg-brandBg font-sans">
            {/* Header */}
            <div className="flex items-center p-4 pb-2">
                <button onClick={() => navigate('/recipes')} className="text-textPrimary">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
                    </svg>
                </button>
                <h2 className="flex-1 text-center text-lg font-bold text-textPrimary">New Recipe</h2>
                <div className="w-6" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 px-4 space-y-6">
                {/* Product Name */}
                <div>
                    <label className="block text-textPrimary font-medium mb-2">Product Name</label>
                    <input
                        {...register('productName')}
                        placeholder="Enter product name"
                        className="w-full h-14 p-4 bg-cardBg rounded-xl placeholder:text-textSecondary focus:outline-none"
                    />
                    {errors.productName && (
                        <p className="text-red-600 text-sm mt-1">{errors.productName.message}</p>
                    )}
                </div>

                {/* Components */}
                <h3 className="text-textPrimary font-medium">Raw Material</h3>
                {fields.map((fld, idx) => {
                    const val = values[idx]?.rawMaterialName;
                    const suggestions = rawMaterials.filter(m =>
                        m.name.toLowerCase().includes((val || '').toLowerCase())
                    );
                    return (
                        <div key={fld.id} className="flex flex-col gap-1">
                            <div className="flex gap-2 items-end">
                                <div className="relative flex-1">
                                    <input
                                        {...register(`components.${idx}.rawMaterialName`)}
                                        placeholder="Search raw material"
                                        className="w-full h-14 p-4 bg-cardBg rounded-xl placeholder:text-textSecondary focus:outline-none"
                                        onFocus={() => setOpenIndex(idx)}
                                        onBlur={() => setTimeout(()=>setOpenIndex(null), 100)}
                                    />
                                    {openIndex === idx && val && (
                                        <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow max-h-48 overflow-y-auto w-full">
                                            {suggestions.map(m => (
                                                <li
                                                    key={m.name}
                                                    onClick={() => {
                                                        setValue(`components.${idx}.rawMaterialName`, m.name);
                                                        setOpenIndex(null);
                                                    }}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    {m.name}
                                                </li>
                                            ))}
                                            {suggestions.length === 0 && (
                                                <li className="px-4 py-2 text-gray-400">No match found</li>
                                            )}
                                        </ul>
                                    )}
                                </div>

                                <div className="w-1/3">
                                    <input
                                        type="number"
                                        {...register(`components.${idx}.qtyPerUnit`)}
                                        placeholder="Enter quantity"
                                        className="w-full h-14 p-4 bg-cardBg rounded-xl placeholder:text-textSecondary focus:outline-none"
                                    />
                                </div>

                                <button type="button" onClick={() => remove(idx)} className="text-red-600">
                                    ✕
                                </button>
                            </div>
                            {errors.components?.[idx]?.rawMaterialName && (
                                <p className="text-red-600 text-sm">{errors.components[idx].rawMaterialName.message}</p>
                            )}
                            {errors.components?.[idx]?.qtyPerUnit && (
                                <p className="text-red-600 text-sm">{errors.components[idx].qtyPerUnit.message}</p>
                            )}
                        </div>
                    );
                })}

                <button
                    type="button"
                    onClick={() => append({ rawMaterialName: '', qtyPerUnit: '' })}
                    className="px-4 py-2 bg-cardBg rounded-full text-textPrimary font-medium"
                >
                    Add Component
                </button>
            </form>

            {/* Save Button */}
            <div className="p-4">
                <button
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="w-full h-14 bg-btnPrimary text-textPrimary font-bold rounded-full"
                >
                    {isSubmitting ? 'Saving…' : 'Save Recipe'}
                </button>
            </div>
        </div>
    );
}
