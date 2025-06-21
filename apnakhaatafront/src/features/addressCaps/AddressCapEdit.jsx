import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAddressCaps, useUpdateAddressCap } from './hook';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

const schema = yup.object({
    address:        yup.string().required(),
    maxQuantity: yup.number().typeError('Enter a number').positive().required()
}).required();

export default function AddressCapEdit() {
    const { city } = useParams();
    const navigate = useNavigate();
    const { data: caps = [] } = useAddressCaps();
    const cap = caps.find(c => c.address === decodeURIComponent(city)) || {};
    const update = useUpdateAddressCap();

    const { register, handleSubmit, reset, formState:{ errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { address: cap.address, maxQuantity: cap.maxQuantity },
    });

    React.useEffect(() => {
        reset({ address: cap.address, maxQuantity: cap.maxQuantity });
    }, [cap, reset]);

    const onSubmit = async data => {
        try {
            await update.mutateAsync(data);
            toast.success('Saved');
            navigate('/address-caps');
        } catch {
            toast.error('Save failed');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-brandBg font-sans">
            {/* Header */}
            <div className="flex items-center p-4 pb-2">
                <button onClick={() => navigate('/address-caps')} className="text-textPrimary">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
                    </svg>
                </button>
                <h2 className="flex-1 text-center text-lg font-bold text-textPrimary">Edit Maximum Quantity</h2>
                <div className="w-6" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="px-4 space-y-6">
                {/* City */}
                <div>
                    <label className="block text-textPrimary font-medium mb-2">City</label>
                    <input
                        {...register('address')}
                        className="w-full h-14 p-4 bg-cardBg rounded-xl placeholder:text-textSecondary focus:outline-none"
                        readOnly
                    />
                </div>

                {/* Max Quantity */}
                <div>
                    <label className="block text-textPrimary font-medium mb-2">Maximum Quantity</label>
                    <input
                        type="number"
                        {...register('maxQuantity')}
                        placeholder="Enter maximum quantity"
                        className="w-full h-14 p-4 bg-cardBg rounded-xl placeholder:text-textSecondary focus:outline-none"
                    />
                    {errors.maxQuantity && (
                        <p className="text-red-600 text-sm mt-1">{errors.maxQuantity.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 px-4 bg-btnPrimary text-textPrimary font-bold rounded-full"
                >
                    Save
                </button>
            </form>
        </div>
    );
}
