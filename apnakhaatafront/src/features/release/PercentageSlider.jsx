import React from 'react';

export function PercentageSlider({ value, onChange }) {
    return (
        <div className="@container">
            <div className="relative flex w-full flex-col items-start justify-between gap-3 p-4 @[480px]:flex-row @[480px]:items-center">
                <div className="flex w-full shrink-[3] items-center justify-between">
                    <p className="text-[#1c180d] text-base font-medium leading-normal">
                        Reduce Bill Quantity by Percentage
                    </p>
                    <p className="text-[#1c180d] text-sm font-normal leading-normal @[480px]:hidden">
                        {value}%
                    </p>
                </div>

                <div className="flex h-4 w-full items-center gap-4">
                    {/* track */}
                    <div className="relative flex h-1 flex-1 rounded-sm bg-[#e9e1ce]">
                        {/* filled portion */}
                        <div
                            className="h-full rounded-sm bg-[#f9ba1a]"
                            style={{ width: `${value}%` }}
                        />
                        {/* thumb */}
                        <div
                            className="absolute -left-2 -top-1.5 size-4 rounded-full bg-[#f9ba1a]"
                            style={{ left: `calc(${value}% - 0.5rem)` }}
                        />
                    </div>

                    {/* hidden on small, visible on ≥480px */}
                    <p className="text-[#1c180d] text-sm font-normal leading-normal hidden @[480px]:block">
                        {value}%
                    </p>
                </div>

                {/* invisible native input for accessibility */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={e => onChange(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </div>
        </div>
    );
}
