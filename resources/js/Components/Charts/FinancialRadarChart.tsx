import React, { useState, useEffect } from 'react';
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    Tooltip, 
    CartesianGrid,
    PieChart,
    Pie,
    Cell
} from 'recharts';

interface TrendItem {
    month: string;
    collected: number;
}

interface ChannelItem {
    name: string;
    value: number;
}

interface Props {
    monthlyTrends?: TrendItem[];
    channelBreakdown?: ChannelItem[];
    totalCollected?: number;
    collectionRate?: number;
}

const COLORS = ['#4f46e5', '#059669', '#d97706', '#ec4899'];

export default function FinancialRadarChart({ 
    monthlyTrends = [], 
    channelBreakdown = [], 
    totalCollected = 0, 
    collectionRate = 0 
}: Props) {
    // Prevent SSR / early DOM calculation crashes
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const formatCurrency = (val: number | string) => {
        const num = Number(val) || 0;
        if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
        if (num >= 1_000) return `${(num / 1_000).toFixed(0)}k`;
        return `${num}`;
    };

    const safeTrends = Array.isArray(monthlyTrends) && monthlyTrends.length > 0 
        ? monthlyTrends 
        : [{ month: 'Term Start', collected: 0 }];

    const safeChannels = Array.isArray(channelBreakdown) ? channelBreakdown.filter(c => Number(c?.value) > 0) : [];

    if (!mounted) {
        return (
            <div style={{ height: '340px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '13px' }}>
                Loading financial radar metrics...
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            
            {/* 1. Area Velocity Curve */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', minHeight: '340px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                            Fee Collection Trajectory
                        </h4>
                        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                            Monthly cash intake velocity across active terms
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', backgroundColor: '#ecfdf5', padding: '3px 8px', borderRadius: '6px' }}>
                            {collectionRate}% Cleared
                        </span>
                    </div>
                </div>

                <div style={{ width: '100%', height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={safeTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                            <defs>
                                <linearGradient id="feeGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={formatCurrency} />
                            <Tooltip 
                                formatter={(val: any) => [`TZS ${Number(val || 0).toLocaleString()}`, 'Collected']}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                            />
                            <Area type="monotone" dataKey="collected" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#feeGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. Ingestion Channel Donut */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', minHeight: '340px' }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                    Payment Channels
                </h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                    Receivables by ingestion method
                </p>

                {safeChannels.length === 0 ? (
                    <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '12px' }}>
                        No payment channel distribution recorded yet.
                    </div>
                ) : (
                    <div style={{ width: '100%', height: 220, marginTop: '10px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={safeChannels}
                                    innerRadius={55}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {safeChannels.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(val: any) => [`TZS ${Number(val || 0).toLocaleString()}`, 'Total']}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginTop: '6px' }}>
                            {safeChannels.map((entry, index) => (
                                <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#475569' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span>{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}