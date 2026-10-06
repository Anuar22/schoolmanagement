import React, { useState, useEffect } from 'react';
import { 
    ResponsiveContainer, 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    Tooltip, 
    CartesianGrid, 
    BarChart, 
    Bar, 
    Cell 
} from 'recharts';
import { BookOpen, CheckCircle2, TrendingUp, Layers } from 'lucide-react';

interface AssessmentProgress {
    assessment: string;
    score: number;
}

interface CoverageItem {
    subject: string;
    done: number;
    planned: number;
    coverage: number;
}

interface Props {
    subjectTrends: Record<string, AssessmentProgress[]>;
    subjectsCoverage: CoverageItem[];
}

export default function DepartmentalPerformanceTracker({
    subjectTrends = {},
    subjectsCoverage = []
}: Props) {
    const [mounted, setMounted] = useState(false);
    
    // Available subject keys for user selection
    const availableSubjects = Object.keys(subjectTrends);
    const [selectedSubject, setSelectedSubject] = useState<string>(
        availableSubjects.includes('Physics') ? 'Physics' : availableSubjects[0] || 'Physics'
    );

    useEffect(() => {
        setMounted(true);
    }, []);

    const activeChartData = subjectTrends[selectedSubject] || [
        { assessment: 'CAT 1', score: 55 },
        { assessment: 'Mid-Term', score: 62 },
        { assessment: 'Terminal', score: 70 }
    ];

    if (!mounted) {
        return (
            <div className="h-80 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 text-xs">
                Loading departmental telemetry...
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* 1. Subject Longitudinal Performance Trajectory (e.g. Physics) */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-900">
                                    Subject Longitudinal Progression
                                </h4>
                                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-indigo-100">
                                    Progress Tracking
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Chronological performance across term assessments
                            </p>
                        </div>

                        {/* Dynamic Subject Selector Tabs */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {availableSubjects.slice(0, 5).map((subject) => (
                                <button
                                    key={subject}
                                    type="button"
                                    onClick={() => setSelectedSubject(subject)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                        selectedSubject === subject
                                            ? 'bg-indigo-600 text-white shadow-xs'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {subject}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="w-full h-64 mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={activeChartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="assessment" stroke="#94a3b8" fontSize={11} tickLine={false} />
                                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                                <Tooltip 
                                    formatter={(val: any) => [`${val || 0}%`, `${selectedSubject} Average`]}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="score" 
                                    stroke="#4f46e5" 
                                    strokeWidth={3} 
                                    dot={{ r: 5, fill: '#4f46e5', strokeWidth: 2, stroke: '#ffffff' }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                        Target: Minimum 65.0% Term Benchmark
                    </span>
                    <span className="font-semibold text-slate-800">
                        Current Mean: {activeChartData[activeChartData.length - 1]?.score || 0}%
                    </span>
                </div>
            </div>

            {/* 2. Syllabus & Continuous Assessment Coverage Index */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="text-sm font-bold text-slate-900">Syllabus Assessment Coverage</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Mandated continuous evaluations completed</p>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                            Curriculum Audit
                        </span>
                    </div>

                    <div className="space-y-3.5">
                        {subjectsCoverage.slice(0, 5).map((item, idx) => (
                            <div key={idx} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-slate-800">{item.subject}</span>
                                    <span className="text-slate-500 font-mono text-[11px]">
                                        {item.done}/{item.planned} tests ({item.coverage}%)
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            item.coverage >= 80 
                                                ? 'bg-emerald-500' 
                                                : item.coverage >= 50 
                                                ? 'bg-indigo-500' 
                                                : 'bg-amber-500'
                                        }`}
                                        style={{ width: `${item.coverage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        NECTA/Statutory Minimum Met
                    </span>
                    <span className="text-indigo-600 font-semibold">Audit Full Syllabus →</span>
                </div>
            </div>

        </div>
    );
}