import React, { useState, useEffect } from 'react';
import { 
    ResponsiveContainer, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    CartesianGrid, 
    Cell 
} from 'recharts';
import { Award, Layers } from 'lucide-react';

interface GradeBand {
    grade: string;
    count: number;
    color: string;
}

interface StreamStat {
    stream: string;
    average: number;
}

interface Props {
    gradeBands?: GradeBand[];
    streamPerformance?: StreamStat[];
}

export default function AcademicIntelligenceRadar({
    gradeBands = [],
    streamPerformance = []
}: Props) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const safeBands = Array.isArray(gradeBands) && gradeBands.length > 0 
        ? gradeBands 
        : [
            { grade: 'A (75-100)', count: 0, color: '#10b981' },
            { grade: 'B (65-74)', count: 0, color: '#3b82f6' },
            { grade: 'C (45-64)', count: 0, color: '#f59e0b' },
            { grade: 'D (30-44)', count: 0, color: '#f97316' },
            { grade: 'F (<30)', count: 0, color: '#ef4444' },
        ];

    const safeStreams = Array.isArray(streamPerformance) ? streamPerformance : [];

    if (!mounted) {
        return (
            <div className="h-72 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 text-xs">
                Rendering academic analytics telemetry...
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* 1. Academic Bell Curve / Grade Band Distribution */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-900">Institutional Grade Distribution</h4>
                                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-indigo-100">
                                    Bell Curve
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">Student marks categorized by mastery bands</p>
                        </div>
                        <Award className="w-5 h-5 text-indigo-500" />
                    </div>

                    <div className="w-full h-56 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={safeBands} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="grade" stroke="#94a3b8" fontSize={11} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                                <Tooltip 
                                    formatter={(val: any) => [`${val || 0} Students`, 'Enrolled']}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                                />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                    {safeBands.map((entry, idx) => (
                                        <Cell key={`band-${idx}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Target: 70%+ in Bands A–C</span>
                    <span className="font-semibold text-slate-700">Division Competency Standard</span>
                </div>
            </div>

            {/* 2. Stream Head-to-Head Comparison (Form 1A vs Form 1B, etc.) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-900">Class Stream Performance Standings</h4>
                                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-100">
                                    Stream Index
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">Average academic score recorded across active class cohorts (%)</p>
                        </div>
                        <Layers className="w-5 h-5 text-emerald-500" />
                    </div>

                    {safeStreams.length === 0 ? (
                        <div className="h-56 flex items-center justify-center text-slate-400 text-xs">
                            No class stream examination averages computed yet.
                        </div>
                    ) : (
                        <div className="w-full h-56 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={safeStreams} layout="vertical" margin={{ top: 5, right: 20, left: 15, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                                    <YAxis dataKey="stream" type="category" stroke="#64748b" fontSize={11} tickLine={false} width={110} />
                                    <Tooltip 
                                        formatter={(val: any) => [`${val || 0}%`, 'Stream Average']}
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                                    />
                                    <Bar dataKey="average" fill="#059669" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Benchmark: 50.0% Minimum Passing Average</span>
                    <span className="font-semibold text-emerald-700">Cohort Variance</span>
                </div>
            </div>

        </div>
    );
}