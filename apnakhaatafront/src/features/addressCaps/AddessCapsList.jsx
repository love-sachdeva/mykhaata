import React from 'react';
import { useAddressCaps } from './hook';
import { useNavigate } from 'react-router-dom';

export default function AddressCapsList() {
    const navigate = useNavigate();
    const { data: caps = [], isLoading } = useAddressCaps();

    if (isLoading) return <div className="p-4 text-center">Loading…</div>;

    return (
        <div className="flex flex-col min-h-screen bg-brandBg font-sans">
            {/* Header */}
            <div className="flex items-center p-4 pb-2">
                <button onClick={() => navigate('/')} className="text-textPrimary">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
                    </svg>
                </button>
                <h2 className="flex-1 text-center text-lg font-bold text-textPrimary">Address Caps</h2>
                <div className="w-6" />
            </div>

            {/* Top Cities Grid */}
            <h3 className="px-4 pt-4 pb-2 text-lg font-bold text-textPrimary">Top Cities</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
                {caps.map(c => (
                    <button
                        key={c.address}
                        onClick={() => navigate(`/address-caps/${encodeURIComponent(c.address)}/edit`)}
                        className="flex flex-col gap-2 rounded-lg border border-[#e9e2ce] bg-cardBg p-4"
                    >
                        {/* Centered Icon + City Name */}
                        <div className="flex gap-4">
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"/>
                            </svg>
                            <span className="text-textPrimary text-base font-bold justify-center items-center" >{c.address}</span>
                        </div>

                        {/* Centered Cap line */}
                        <p className="text-textSecondary text-sm text-center">
                            Cap: {c.maxQuantity}
                        </p>
                    </button>
                ))}
            </div>

            {/* Add New City */}
            <div className="flex justify-end px-4 py-3">
                <button
                    onClick={() => navigate('/address-caps/new')}
                    className="h-10 px-4 bg-btnPrimary text-textPrimary font-bold rounded-full"
                >
                    Add New City
                </button>
            </div>
        </div>
    );
}
