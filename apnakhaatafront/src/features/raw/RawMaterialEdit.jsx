import React, {useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRawMaterial, useAdjustRawMaterial } from './hook';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

const schema = yup.object({
    quantityOnHand: yup
        .number()
        .typeError('Enter a number')
        .required('Quantity is required'),
    minThreshold: yup
        .number()
        .typeError('Enter a number')
        .positive('Must be positive')
        .required('Threshold is required'),
}).required();

export default function RawMaterialEdit() {
    const [quantity ,setQuantity] = useState(0);
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: mat, isLoading } = useRawMaterial(id);
    const adjustMutation = useAdjustRawMaterial();

    // ↓ Here we destructure handleSubmit from useForm
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            quantityOnHand: mat?.quantityOnHand,
            minThreshold: mat?.minThreshold
        }
    });

    // Reset form when mat loads
    React.useEffect(() => {
        if (mat) {
            reset({
                quantityOnHand: mat.quantityOnHand,
                minThreshold: mat.minThreshold
            });
        }
    }, [mat, reset]);

    // onSubmit called with validated form data
    const onSubmit = async data => {
        try {
            await adjustMutation.mutateAsync({
                       name:      mat.name,
                       quantity:  quantity,
                       threshold: data.minThreshold});
            toast.success('Updated!');
            navigate('/raw-materials');
        } catch {
            toast.error('Update failed');
        }
    };


    if (isLoading) return <div className="p-4 text-center">Loading…</div>;

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans">
            {/* Header */}
            <div className="flex items-center p-4 pb-2">
                <button onClick={() => navigate(-1)} className="text-[#171512]">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path
                            d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
                    </svg>
                </button>
                <h2 className="flex-1 text-center text-lg font-bold text-[#171512]">Update Raw Material</h2>
                <div className="w-6"/>
            </div>

            <div className="px-4 space-y-4">
                {/* Raw Material */}
                <h3 className="text-[#171512] text-lg font-bold pt-4">Raw Material</h3>
                <div className="flex justify-between items-center bg-white py-2">
                    <div>
                        <p className="text-[#171512] text-base font-medium">{mat.name}</p>
                        <p className="text-[#827b68] text-sm">Current Quantity: {mat.quantityOnHand} kg</p>
                    </div>
                    <div>
                        <p className="text-[#171512] text-base">{mat.minThreshold} kg</p>
                    </div>
                </div>

                {/* Quantity */}
                <h3 className="text-[#171512] text-lg font-bold pt-4">Add Quantity</h3>
                <div>
                    <label className="block text-[#171512] text-base font-medium mb-2">Quantity</label>
                    <input
                        type="number"
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full h-14 p-4 bg-white border border-[#e4e2dd] rounded-xl placeholder:text-[#827b68] focus:outline-none focus:border-[#e4e2dd]"
                        placeholder="Add quantity"
                    />
                    {errors.quantityOnHand && (
                        <p className="text-red-600 text-sm mt-1">{errors.quantityOnHand.message}</p>
                    )}
                </div>

                {/* Threshold */}
                <h3 className="text-[#171512] text-lg font-bold pt-4">Threshold</h3>
                <div>
                    <label className="block text-[#171512] text-base font-medium mb-2">Threshold</label>
                    <input
                        type="number"
                        {...register("minThreshold")}
                        className="w-full h-14 p-4 bg-white border border-[#e4e2dd] rounded-xl placeholder:text-[#827b68] focus:outline-none focus:border-[#e4e2dd]"
                        placeholder="Enter new threshold"
                    />
                    {errors.minThreshold && (
                        <p className="text-red-600 text-sm mt-1">{errors.minThreshold.message}</p>
                    )}
                </div>
            </div>

            {/* Update Button */}
            <div className="p-4">
                {/* ↓ Here we wire handleSubmit to onClick */}
                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={adjustMutation.isLoading}
                    className="w-full h-14 bg-btnPrimary text-textPrimary font-bold rounded-full"
                >
                    {adjustMutation.isLoading ? 'Updating…' : 'Update'}
                </button>
            </div>
        </div>
    );
}
