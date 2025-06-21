import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateRawMaterial } from './hook';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

const schema = yup.object({
    name:            yup.string().required('Material name is required'),
    initialQuantity: yup
        .number()
        .typeError('Enter a number')
        .positive('Must be positive')
        .required('Initial quantity is required'),
    minThreshold:    yup
        .number()
        .typeError('Enter a number')
        .positive('Must be positive')
        .required('Minimum threshold is required'),
}).required();

export default function RawMaterialForm() {
    const navigate = useNavigate();
    const createMutation = useCreateRawMaterial();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { name: '', initialQuantity: '', minThreshold: '' }
    });

    const onSubmit = async data => {
        try {
            await createMutation.mutateAsync(data);
            toast.success('Raw material added');
            navigate('/raw-materials');
        } catch {
            toast.error('Failed to add material');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans">
            {/* Header */}
            <div className="flex items-center p-4 pb-2">
                <button onClick={() => navigate(-1)} className="text-[#181611]">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
                    </svg>
                </button>
                <h2 className="flex-1 text-center text-lg font-bold text-[#181611]">Add Raw Material</h2>
                <div className="w-6" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 px-4 space-y-6">
                {/* Material Name */}
                <div>
                    <label className="block text-[#181611] text-base font-medium mb-2">
                        Material Name
                    </label>
                    <input
                        {...register('name')}
                        placeholder="Enter material name"
                        className="w-full h-14 p-4 bg-white border border-[#e6e3dd] rounded-xl placeholder:text-[#8c805f] focus:outline-none"
                    />
                    {errors.name && (
                        <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                    )}
                </div>

                {/* Initial Quantity */}
                <div>
                    <label className="block text-[#181611] text-base font-medium mb-2">
                        Initial Quantity
                    </label>
                    <input
                        type="number"
                        {...register('initialQuantity')}
                        placeholder="Enter initial quantity"
                        className="w-full h-14 p-4 bg-white border border-[#e6e3dd] rounded-xl placeholder:text-[#8c805f] focus:outline-none"
                    />
                    {errors.initialQuantity && (
                        <p className="text-red-600 text-sm mt-1">{errors.initialQuantity.message}</p>
                    )}
                </div>

                {/* Minimum Threshold */}
                <div>
                    <label className="block text-[#181611] text-base font-medium mb-2">
                        Minimum Threshold Quantity
                    </label>
                    <input
                        type="number"
                        {...register('minThreshold')}
                        placeholder="Enter minimum threshold quantity"
                        className="w-full h-14 p-4 bg-white border border-[#e6e3dd] rounded-xl placeholder:text-[#8c805f] focus:outline-none"
                    />
                    {errors.minThreshold && (
                        <p className="text-red-600 text-sm mt-1">{errors.minThreshold.message}</p>
                    )}
                </div>
            </form>

            {/* Add Material Button */}
            <div className="p-4">
                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="w-full h-14 bg-[#f9c024] text-[#181611] font-bold rounded-full"
                >
                    {isSubmitting ? 'Adding…' : 'Add Material'}
                </button>
            </div>
        </div>
    );
}
