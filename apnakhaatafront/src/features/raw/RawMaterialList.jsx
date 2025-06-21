import React from 'react';
import { useRawMaterials } from './hook';
import { useNavigate } from 'react-router-dom';

const COLORS = [
    '#fac638','#f4a261','#e76f51','#2a9d8f',
    '#264653','#e9c46a','#8ab17d','#a66fb5'
];
function stringToColor(name) {
    const sum = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return COLORS[sum % COLORS.length];
}

export default function RawMaterialsList() {
    const navigate = useNavigate();
    const { data: list = [], isLoading } = useRawMaterials();

    if (isLoading) {
        return <div className="p-4 text-center">Loading…</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-brandBg font-sans">
            {/* Header */}
            <div className="flex items-center p-4 pb-2 justify-between">
                <button
                    onClick={() => navigate('/')}
                    className="text-textPrimary"
                >
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
                    </svg>
                </button>
                <h2 className="flex-1 text-center text-lg font-bold text-textPrimary">
                    Raw Materials
                </h2>
                <button
                    onClick={() => navigate('/raw-materials/new')}
                    className="text-textPrimary"
                >
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/>
                    </svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="w-full px-4 mx-auto
                       max-w-full lg:max-w-15xl xl:max-h-5 xl:max-w-screen-2xl">
                        {list.map(m => {
                        const bg = stringToColor(m.name);
                        const letter = m.name.charAt(0).toUpperCase();
                        return (
                            <button
                                key={m.id}
                                onClick={() => navigate(`/raw-materials/${m.id}`)}
                                className="flex items-center gap-4 bg-brandBg px-4 py-3 w-full text-left"
                            >
                                <div
                                    className="flex items-center justify-center h-14 w-14 rounded-lg text-white font-bold text-xl flex-shrink-0"
                                    style={{ backgroundColor: bg }}
                                >
                                    {letter}
                                </div>
                                <div>
                                    <p className="text-textPrimary text-base font-medium">
                                        {m.name}
                                    </p>
                                    <p className="text-textSecondary text-sm">
                                        Current: {m.quantityOnHand} kg | Threshold: {m.minThreshold} kg
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
