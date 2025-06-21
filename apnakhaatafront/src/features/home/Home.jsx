import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOverview, useActivities } from './hook';
import {useSalesOverview} from "../reports/hook";

const ICONS = {
    address: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path
                d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"
            ></path>
        </svg>
    ),
    stock: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path
                d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z"
            ></path>
        </svg>
    ),
    bill: (
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path
                d="M72,104a8,8,0,0,1,8-8h96a8,8,0,0,1,0,16H80A8,8,0,0,1,72,104Zm8,40h96a8,8,0,0,0,0-16H80a8,8,0,0,0,0,16ZM232,56V208a8,8,0,0,1-11.58,7.15L192,200.94l-28.42,14.21a8,8,0,0,1-7.16,0L128,200.94,99.58,215.15a8,8,0,0,1-7.16,0L64,200.94,35.58,215.15A8,8,0,0,1,24,208V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56Zm-16,0H40V195.06l20.42-10.22a8,8,0,0,1,7.16,0L96,199.06l28.42-14.22a8,8,0,0,1,7.16,0L160,199.06l28.42-14.22a8,8,0,0,1,7.16,0L216,195.06Z"/>
        </svg>
    ),
    accounts: (
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M128,128a48,48,0,1,0-48-48A48,48,0,0,0,128,128Zm0,24c-54.24,0-96,28.65-96,64v16a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V216C224,180.65,182.24,152,128,152Z"/>
        </svg>
    ),
    reports: (
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"/>
        </svg>
    ),
    recipe: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path
                d="M224,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h64a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64Z"
            ></path>
        </svg>)
};

function formatCurrency(n) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(n)
}

export default function Home() {
    const navigate = useNavigate();
    const location = useLocation();
    const {data: ov, isLoading: lo} = useOverview();
    const {data: acts = [], isLoading: la} = useActivities();
    const { data: overview = {} }     = useSalesOverview()

    if (lo || la) return <div className="p-4 text-center">Loading…</div>;

    return (
        <div className="flex flex-col min-h-screen justify-between bg-brandBg">
            {/* Header */}
            <div className="flex items-center p-4 pb-2 justify-between">
            <h2 className="text-textPrimary text-lg font-bold flex-1 text-center">My  Khaata</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Overview */}
                <h3 className="px-4 pt-5 pb-3 text-2xl font-bold text-textPrimary">Overview</h3>
                <div className="flex flex-wrap gap-4 px-4">
                    <div className="flex-1 min-w-[158px] p-6 bg-cardBg rounded-xl">
                        <p className="text-textPrimary font-medium mb-4 text-center">Total Sales Today</p>
                        <p className="text-2xl font-bold text-textPrimary">{formatCurrency(overview.totalSales)}</p>
                    </div>
                    <div className="flex-1 min-w-[158px] p-6 bg-cardBg rounded-xl">
                        <p className="text-textPrimary font-medium text-center mb-6">Total Bills</p>
                        <p className="text-4xl font-bold text-center text-textPrimary">{ov.billsCount}</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <h3 className="px-4 pt-5 pb-3 text-2xl font-bold text-textPrimary mt-6">Quick Actions</h3>
                <div className="flex gap-4 px-4">
                    <button
                        onClick={() => navigate('/drafts')}
                        className="flex-1 h-10 bg-btnPrimary text-textPrimary font-bold rounded-xl"
                    >
                        View Drafts
                    </button>
                    <button
                        onClick={() => navigate('/drafts/new')}
                        className="flex-1 h-10 bg-cardBg text-textPrimary font-bold rounded-xl"
                    >
                        Add Bill
                    </button>
                </div>

                {/* Recent Activity */}
                <h3 className="px-4 pt-5 pb-3 text-2xl font-bold text-textPrimary mt-6">Recent Activity</h3>
                <div className="space-y-2 px-4">
                    {acts.map(a => (
                        <div key={a.id} className="flex items-center gap-4 bg-brandBg py-2">
                            <div className="p-2 bg-cardBg rounded-lg">{ICONS[a.type]}</div>
                            <div className="flex-1">
                                <p className="text-textPrimary font-medium">{a.title}</p>
                                <p className="text-sm text-textSecondary">{a.subtitle}</p>
                            </div>
                            <p className="text-sm text-textSecondary">{a.timeAgo}</p>
                        </div>
                    ))}
                </div>

                {/* Explore More */}
                <h3 className="px-4 pt-5 pb-3 text-2xl font-bold text-textPrimary mt-6">Explore More</h3>
                <div className="space-y-2 px-4">
                    <button
                        onClick={() => navigate('/address-caps')}
                        className="flex items-center gap-3 py-3 bg-brandBg"
                    >
                        <div className="p-2 bg-cardBg rounded-lg">{ICONS.address}</div>
                        <span className="text-textPrimary">My Address Caps</span>
                    </button>
                    <button
                        onClick={() => navigate('/recipes')}
                        className="flex items-center gap-3 py-3 bg-brandBg"
                    >
                        <div className="p-2 bg-cardBg rounded-lg">{ICONS.recipe}</div>
                        <span className="text-textPrimary">Recipe</span>
                    </button>
                </div>
            </div>

            {/* Bottom Nav */}
            <nav className="flex border-t border-cardBg bg-brandBg h-12 lg:h-16 px-4 lg:px-8">
                {[
                    { to: '/accounts',   label: 'Accounts', icon: 'accounts'  },
                    { to: '/raw-materials', label: 'Stock',  icon: 'stock'     },
                    { to: '/bills',      label: 'Bills',    icon: 'bill'      },
                    { to: '/reports',    label: 'Reports',  icon: 'reports'   },
                ].map(link => {
                    const active = location.pathname === link.to;
                    return (
                        <button
                            key={link.to}
                            onClick={() => navigate(link.to)}
                            className={`
                flex-1 flex flex-col items-center justify-center gap-1
                ${active ? 'text-textPrimary' : 'text-textSecondary'}
                text-xs lg:text-sm font-medium
              `}
                        >
                            <div className="h-6 w-6 lg:h-8 lg:w-8">
                                {ICONS[link.icon]}
                            </div>
                            <span>{link.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
