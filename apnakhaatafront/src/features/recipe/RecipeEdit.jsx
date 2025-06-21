import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {useRecipe, useUpdateRecipe, useRawMaterials, useCreateRecipe} from './hook';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

// Validation schema
const componentSchema = yup.object({
    rawMaterialName: yup.string().required('Raw Material is required'),
    quantityPerUnit: yup.number().positive().required('Quantity is required')
});

const schema = yup.object({
    productName: yup.string().required('Product name is required'),
    components: yup.array().of(componentSchema).min(1, 'At least one component is required')
}).required();

export default function RecipeEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: rec, isLoading } = useRecipe(id);
    const upd = useCreateRecipe();
    const { data: rawMaterials = [], isLoading: rawLoading } = useRawMaterials();

    const [autocompleteStates, setAutocompleteStates] = React.useState({});

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            productName: '',
            components: []
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'components' });

    // Populate form when recipe is loaded
    React.useEffect(() => {
        if (rec) {
            reset({
                productName: rec.productName,
                components: rec.components.map(c => ({
                    rawMaterialName: c.rawMaterialName,
                    quantityPerUnit: c.quantityPerUnit
                }))
            });
        }
    }, [rec, reset]);

    const onSubmit = async (data) => {
        try {
             const dto = {
                productName: data.productName,
                components: data.components.map(c => ({
                rawMaterialName:   c.rawMaterialName,
                quantityPerUnit:   c.quantityPerUnit
            }))
            };
            await upd.mutateAsync(dto);
            toast.success('Updated!');
            navigate('/recipes');
        } catch {
            toast.error('Update failed');
        }
    };

    const handleAutocompleteChange = (index, value) => {
        setValue(`components.${index}.rawMaterialName`, value);
        setAutocompleteStates(prev => ({ ...prev, [index]: false }));
    };

    if (isLoading || rawLoading) return <div className="p-4 text-center">Loading…</div>;

    return (
        <div className="flex flex-col min-h-screen bg-brandBg font-sans">
            {/* Header */}
            <div className="flex items-center p-4 pb-2">
                <button onClick={() => navigate(-1)} className="text-textPrimary">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
                    </svg>
                </button>
                <h2 className="flex-1 text-center text-lg font-bold text-textPrimary">Edit Recipe</h2>
                <div className="w-6"/>
            </div>

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
                        <p className="text-red-500 text-sm">{errors.productName.message}</p>
                    )}
                </div>

                {/* Components */}
                <h3 className="text-textPrimary font-medium">Raw Materials</h3>
                {fields.map((field, index) => {
                    const isNewField = field.rawMaterialName === '';
                    const currentValue = watch(`components.${index}.rawMaterialName`);

                    const filteredSuggestions = rawMaterials.filter((m) =>
                        m.name.toLowerCase().includes(currentValue?.toLowerCase() || '')
                    );

                    return (
                        <div key={field.id} className="flex flex-col gap-1 mb-3">
                            <div className="flex gap-2 items-end">
                                {isNewField ? (
                                    <div className="relative w-full">
                                        <input
                                            {...register(`components.${index}.rawMaterialName`)}
                                            placeholder="Start typing material..."
                                            onFocus={() =>
                                                setAutocompleteStates((s) => ({ ...s, [index]: true }))
                                            }
                                            className="w-full h-12 p-3 bg-cardBg rounded-xl placeholder:text-textSecondary focus:outline-none"
                                        />
                                        {autocompleteStates[index] && currentValue && (
                                            <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow max-h-48 overflow-y-auto w-full">
                                                {filteredSuggestions.map((m) => (
                                                    <li
                                                        key={m.id}
                                                        onClick={() =>
                                                            handleAutocompleteChange(index, m.name)
                                                        }
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    >
                                                        {m.name}
                                                    </li>
                                                ))}
                                                {filteredSuggestions.length === 0 && (
                                                    <li className="px-4 py-2 text-gray-400">
                                                        No match found
                                                    </li>
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    <input
                                        {...register(`components.${index}.rawMaterialName`)}
                                        readOnly
                                        className="flex-1 h-12 p-3 bg-gray-100 rounded-xl text-textPrimary"
                                    />
                                )}

                                <input
                                    type="number"
                                    {...register(`components.${index}.quantityPerUnit`)}
                                    placeholder="Qty"
                                    className="w-28 h-12 p-3 bg-cardBg rounded-xl placeholder:text-textSecondary focus:outline-none"
                                />

                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="text-red-600"
                                >
                                    ✕
                                </button>
                            </div>
                            {errors.components?.[index]?.rawMaterialName && (
                                <p className="text-red-500 text-sm">
                                    {errors.components[index].rawMaterialName.message}
                                </p>
                            )}
                            {errors.components?.[index]?.quantityPerUnit && (
                                <p className="text-red-500 text-sm">
                                    {errors.components[index].quantityPerUnit.message}
                                </p>
                            )}
                        </div>
                    );
                })}

                <button
                    type="button"
                    onClick={() =>
                        append({ rawMaterialName: '', quantityPerUnit: 0 })
                    }
                    className="px-4 py-2 bg-cardBg rounded-full text-textPrimary font-medium"
                >
                    Add Raw Material
                </button>
            </form>

            <div className="p-4">
                <button
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                    disabled={upd.isLoading}
                    className="w-full h-14 bg-btnPrimary text-textPrimary font-bold rounded-full"
                >
                    {upd.isLoading ? 'Updating…' : 'Update Recipe'}
                </button>
            </div>
        </div>
    );
}
