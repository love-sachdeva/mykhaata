import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRawMaterial } from './hook';

export default function RawMaterialDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: m, isLoading } = useRawMaterial(id);
    if (isLoading) return <div className="p-4 text-center">Loading…</div>;

    return (
        <div className="flex flex-col min-h-screen bg-brandBg font-sans">
            {/* Header */}
            <div className="flex items-center p-4 pb-2">
                <button onClick={() => navigate(-1)} className="text-textPrimary">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
                    </svg>
                </button>
                <h2 className="flex-1 text-center text-lg font-bold text-textPrimary">Raw Material Details</h2>
                <div className="w-6" />
            </div>

            <div className="px-4 space-y-4">
                {/* Raw Material */}
                <h3 className="text-textPrimary text-lg font-bold">Raw Material</h3>
                <div className="flex justify-between">
                    <span className="text-textPrimary">{m.name}</span>
                    <span className="text-textPrimary">{m.quantityOnHand} kg</span>
                </div>

                {/* Quantity */}
                <h3 className="text-textPrimary text-lg font-bold pt-4">Quantity</h3>
                <div className="flex justify-between">
                    <span className="text-textPrimary">Current Quantity</span>
                    <span className="text-textPrimary">{m.quantityOnHand} kg</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-textPrimary">Minimum Threshold</span>
                    <span className="text-textPrimary">{m.minThreshold} kg</span>
                </div>
            </div>

            {/* Edit Buttons */}
            <div className="p-4">
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate(`/raw-materials/${id}/edit`)}
                        className="flex-1 h-10 bg-cardBg text-textPrimary font-bold rounded-xl"
                    >
                        Edit Quantity
                    </button>
                    <button
                        onClick={() => navigate(`/raw-materials/${id}/edit`)}
                        className="flex-1 h-10 bg-btnPrimary text-textPrimary font-bold rounded-xl"
                    >
                        Edit Threshold
                    </button>
                </div>
            </div>
        </div>
    );
}
