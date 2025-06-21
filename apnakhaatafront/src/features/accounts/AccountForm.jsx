import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateAccount } from './hook';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

const schema = yup.object({
    name:         yup.string().required('Name is required'),
    address:      yup.string().required('Address is required'),
    city:         yup.string().required('City is required'),
    gstOrAadhaar: yup.string().required('GST/Aadhaar is required'),
    type:         yup.string().oneOf(['CREDITOR','DEBTOR']).required('Select Creditor or Debtor'),
}).required();

export default function AccountForm() {
    const navigate = useNavigate();
    const { mutateAsync, isLoading } = useCreateAccount();
    const { register, control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { name:'', address:'', city:'', gstOrAadhaar:'', type:'' }
    });

    const onSubmit = async data => {
        try {
            await mutateAsync(data);
            toast.success('Account saved');
            navigate('/accounts');
        } catch {
            toast.error('Save failed');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#fcfbf8] font-sans">
            {/* Header */}
            <div className="flex items-center p-4 pb-2">
                <button onClick={() => navigate(-1)} className="text-[#1c180d]">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
                    </svg>
                </button>
                <h2 className="flex-1 text-center text-lg font-bold text-[#1c180d]">Add Details</h2>
                <div className="w-6" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 px-4 space-y-4">
                {[
                    { name: 'name',        placeholder: 'Name' },
                    { name: 'address',     placeholder: 'Address' },
                    { name: 'city',        placeholder: 'City' },
                    { name: 'gstOrAadhaar',placeholder: 'GST/Aadhaar Number' },
                ].map(f => (
                    <div key={f.name}>
                        <input
                            {...register(f.name)}
                            placeholder={f.placeholder}
                            className="w-full h-14 px-4 bg-[#f4f0e6] rounded-lg placeholder:text-[#9e8747] focus:outline-none"
                        />
                        {errors[f.name] && (
                            <p className="text-red-600 text-sm mt-1">{errors[f.name].message}</p>
                        )}
                    </div>
                ))}

                {/* Creditor / Debtor Toggle */}
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <div className="flex gap-3">
                            {[
                                { value: 'CREDITOR', label: 'Creditor' },
                                { value: 'DEBTOR',   label: 'Debtor' }
                            ].map(opt => (
                                <label
                                    key={opt.value}
                                    className={`
                    flex-1 h-11 flex items-center justify-center rounded-lg border 
                    ${field.value===opt.value ? 'border-2 border-[#fac638]' : 'border-[#e9e2ce]'}
                    text-[#1c180d]
                    cursor-pointer
                  `}
                                >
                                    <input
                                        type="radio"
                                        value={opt.value}
                                        checked={field.value===opt.value}
                                        onChange={() => field.onChange(opt.value)}
                                        className="hidden"
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                    )}
                />
                {errors.type && (
                    <p className="text-red-600 text-sm">{errors.type.message}</p>
                )}
            </form>

            {/* Save Button */}
            <div className="p-4">
                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isLoading}
                    className="w-full h-14 bg-[#fac638] text-[#1c180d] font-bold rounded-lg"
                >
                    {isLoading ? 'Saving…' : 'Save'}
                </button>
            </div>
        </div>
    );
}
