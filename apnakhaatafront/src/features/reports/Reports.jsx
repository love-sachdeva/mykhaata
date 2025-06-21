import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    useSalesOverview,
    useSalesTrend,
    useInventoryStatus,
    useConsumptionTrend,
    useTopItemTrends
} from './hook'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, CartesianGrid
} from 'recharts'

function formatCurrency(n) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(n)
}

export default function Reports() {
    const navigate = useNavigate()

    // global period for Sales Trends etc.
    const [period, setPeriod] = useState('month')
    // independent period for Top Selling Items
    const [topPeriod, setTopPeriod] = useState('month')

    // data hooks
    const { data: overview = {} }     = useSalesOverview()
    const { data: trend = {} }        = useSalesTrend(period)
    const { data: inventory = {} }    = useInventoryStatus()
    const { data: topItemTrend = {} } = useTopItemTrends(topPeriod)

    // unpack overview
    const {
        totalSales = 0,
        avgOrderValue = 0,
        totalItemsSold = 0,
        pctSalesChange: rawPctSalesChange = 0,
        pctAOVChange:    rawPctAOVChange    = 0,
        pctItemsChange:  rawPctItemsChange  = 0,
    } = overview

    const pctSalesChange = Number(rawPctSalesChange) || 0
    const pctAOVChange   = Number(rawPctAOVChange)   || 0
    const pctItemsChange = Number(rawPctItemsChange) || 0

    // sales trend data
    const rawLabels    = trend.labels  || []
    const series       = trend.series  || []
    const labels       = rawLabels.map(dateStr => {
        const d = new Date(dateStr)
        return isNaN(d)
            ? dateStr
            : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
    })
    const currentTotal = series.reduce((sum, v) => sum + (v||0), 0)
    const pctChange    = Number(trend.pctChange || 0)
    const chartData    = useMemo(
        () => labels.map((name,i) => ({ name, value: series[i] ?? 0 })),
        [labels, series]
    )

    // unpack inventory (for completeness)
    const {
        totalItemsSold: totalInStock   = 0,
        lowStockItems:   lowStockCount  = 0,
        outOfStockItems: outOfStockCount= 0,
        lowStockNames   = [],
        outOfStockNames = []
    } = inventory

    // top-item trends & selection
    const topLabels   = topItemTrend.labels || []
    const topSeries   = topItemTrend.items  || []
    const [selectedItem, setSelectedItem] = useState('')
    useEffect(() => {
        if (topSeries.length && !topSeries.some(s => s.itemName === selectedItem)) {
            setSelectedItem(topSeries[0].itemName)
        }
    }, [topSeries, selectedItem])

    const selectedObj  = topSeries.find(s => s.itemName === selectedItem) || { values: [] }
    const selectedData = topLabels.map((lab,i) => {
        const d = new Date(lab)
        const name = isNaN(d)
            ? lab
            : d.toLocaleDateString('en-IN', { day:'2-digit', month:'short' })
        return { name, value: selectedObj.values[i] ?? 0 }
    })

    return (
        <div className="flex flex-col min-h-screen bg-[#fcfbf8] font-sans">
            {/* Header */}
            <div className="flex items-center p-4 pb-2 bg-[#fcfbf8]">
                <button onClick={() => navigate(-1)} className="text-[#1c180d] w-6 h-6">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path
                            d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
                    </svg>
                </button>
                <h2 className="flex-1 text-center text-lg font-bold text-[#1c180d]">Reports</h2>
                <div className="w-6"/>
            </div>

            <div className="px-4 space-y-6 flex-1 overflow-y-auto">
                {/* Sales Overview */}
                <SectionTitle>Sales Overview</SectionTitle>
                <div className="flex flex-wrap gap-4 p-4">
                    <Card title="Total Sales"         value={formatCurrency(totalSales)} pct={pctSalesChange} />
                    <Card title="Average Order Value" value={formatCurrency(avgOrderValue)} pct={pctAOVChange} />
                    <Card title="Total Items Sold"    value={totalItemsSold.toLocaleString()} pct={pctItemsChange} />
                </div>

                {/* Sales Trends */}
                <SectionTitle>Sales Trends</SectionTitle>
                <PeriodTabs period={period} onChange={setPeriod} />
                <div className="flex flex-col gap-4 px-4 py-2 md:flex-row md:gap-4">
                    <ChartCard
                        title={period === 'month' ? 'Monthly Sales'
                            : period === 'week' ? 'Weekly Sales'
                                : 'Daily Sales'}
                        amount={formatCurrency(currentTotal)}
                        pct={pctChange}
                        chartType="bar"
                        data={chartData}
                    />
                    <ChartCard
                        title={period === 'month' ? 'Monthly Trend'
                            : period === 'week' ? 'Weekly Trend'
                                : 'Hourly Trend'}
                        chartType="line"
                        data={chartData}
                    />
                </div>

                {/* Inventory Status */}
                <SectionTitle>Inventory Status</SectionTitle>
                <div className="flex flex-wrap gap-4 p-4">
                    <RotatingCard label="Total Items in Stock" val={totalInStock} />
                    <RotatingCard label="Low Stock Items"      val={lowStockCount} altData={lowStockNames} />
                    <RotatingCard label="Out of Stock Items"   val={outOfStockCount} altData={outOfStockNames} />
                </div>

                {/* Top Selling Items */}
                <SectionTitle>Top Selling Items</SectionTitle>
                <div className="px-4">
                    {/* standalone select */}
                    <div className="mb-4">
                        <select
                            value={selectedItem}
                            onChange={e => setSelectedItem(e.target.value)}
                            className="
                w-full md:w-auto p-2
                border border-[#e9e2ce] rounded
                bg-white text-[#1c180d]
                focus:outline-none focus:ring-2 focus:ring-[#9e8747] focus:border-transparent
                transition
              "
                        >
                            {topSeries.map(s => (
                                <option key={s.itemName} value={s.itemName}>
                                    {s.itemName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* its own period tabs */}
                    <PeriodTabs period={topPeriod} onChange={setTopPeriod} />

                    {/* charts stack on mobile */}
                    <div className="flex flex-col gap-4 md:flex-row md:gap-4 mt-2">
                        <ChartCard
                            title={selectedItem}
                            chartType="bar"
                            data={selectedData}
                        />
                        <ChartCard
                            title={selectedItem}
                            chartType="line"
                            data={selectedData}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

// ───────────────── Components ─────────────────

function Card({ title, value, pct }) {
    return (
        <div className="flex flex-1 min-w-[158px] flex-col gap-2 rounded-xl p-6 bg-[#f4f0e6]">
            <p className="text-[#1c180d] text-base font-medium">{title}</p>
            <p className="text-[#1c180d] text-2xl font-bold">{value}</p>
            <p className={`text-base font-medium ${pct >= 0 ? 'text-[#078812]' : 'text-[#e71408]'}`}>
                {pct >= 0 ? '+' : ''}{pct.toFixed(0)}%
            </p>
        </div>
    )
}

function ChartCard({ title, amount, pct, chartType, data }) {
    return (
        <div className="flex-1 p-6 bg-[#f4f0e6] rounded-xl border border-[#e9e2ce]">
            <p className="text-[#1c180d] text-base font-medium mb-2">{title}</p>
            {amount != null && (
                <p className="text-[#1c180d] text-[32px] font-bold mb-1">{amount}</p>
            )}
            {pct != null && (
                <p className={`text-base font-medium ${pct >= 0 ? 'text-[#078812]' : 'text-[#e71408]'}`}>
                    {pct >= 0 ? '+' : ''}{pct.toFixed(0)}%
                </p>
            )}
            <ResponsiveContainer width="100%" height={160}>
                {chartType === 'bar' ? (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                        <XAxis dataKey="name" tick={{ fontSize: 12 }}/>
                        <YAxis/>
                        <Tooltip/>
                        <Bar dataKey="value" fill="#9e8747"/>
                    </BarChart>
                ) : (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                        <XAxis dataKey="name" tick={{ fontSize: 12 }}/>
                        <YAxis/>
                        <Tooltip/>
                        <Line type="monotone" dataKey="value" stroke="#9e8747" strokeWidth={3} dot={false}/>
                    </LineChart>
                )}
            </ResponsiveContainer>
        </div>
    )
}

function RotatingCard({ label, val, altData = [] }) {
    const [index, setIndex] = useState(0)
    const touchStartX = useRef(null)

    useEffect(() => {
        if (!altData.length) return
        const iv = setInterval(() => setIndex(i => (i + 1) % (altData.length + 1)), 4000)
        return () => clearInterval(iv)
    }, [altData])

    const handleSwipe = endX => {
        if (touchStartX.current == null) return
        if (Math.abs(endX - touchStartX.current) > 30) {
            setIndex(i => (i + 1) % (altData.length + 1))
        }
        touchStartX.current = null
    }

    const content = index === 0
        ? <p className="text-[#1c180d] text-2xl font-bold">{val.toLocaleString()}</p>
        : <p className="text-[#9e8747] text-sm text-center max-w-full">{altData[index - 1]}</p>

    return (
        <div
            className="flex flex-1 min-w-[158px] flex-col items-center justify-center gap-2 rounded-xl p-6 border transition-all duration-300"
            style={{ minHeight: '120px' }}
            onTouchStart={e => touchStartX.current = e.touches[0].clientX}
            onTouchEnd={e => handleSwipe(e.changedTouches[0].clientX)}
        >
            <p className="text-[#1c180d] text-base font-medium text-center">{label}</p>
            {content}
        </div>
    )
}

function SectionTitle({ children }) {
    return <h3 className="text-[#1c180d] text-[22px] font-bold pt-5 pb-2">{children}</h3>
}

function PeriodTabs({ period, onChange }) {
    return (
        <div className="flex px-4 py-3">
            {['day','week','month'].map(p => (
                <label
                    key={p}
                    className={`
            flex cursor-pointer h-10 grow items-center justify-center
            rounded-full px-3 text-sm font-medium
            ${period===p
                        ? 'bg-[#fcfbf8] text-[#1c180d] shadow'
                        : 'text-[#9e8747]'}
          `}
                >
                    <input
                        type="radio"
                        name="period"
                        value={p}
                        checked={period===p}
                        onChange={() => onChange(p)}
                        className="hidden"
                    />
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                </label>
            ))}
        </div>
    )
}
