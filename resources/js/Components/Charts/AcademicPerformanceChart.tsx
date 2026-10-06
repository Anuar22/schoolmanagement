import React from 'react';
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

interface GradeBand {
    grade: string;
    count: number;
    color: string;
}

interface SubjectAvg {
    subject: string;
    average: number;
}

interface Props {
    gradeBands?: GradeBand[];
    subjectAverages?: SubjectAvg[];
}

export default function AcademicPerformanceChart({ 
    gradeBands = [], 
    subjectAverages = [] 
}: Props) {
    const safeBands = Array.isArray(gradeBands) && gradeBands.length > 0 
        ? gradeBands 
        : [
            { grade: 'A', count: 0, color: '#10b981' },
            { grade: 'B', count: 0, color: '#3b82f6' },
            { grade: 'C', count: 0, color: '#f59e0b' },
            { grade: 'D', count: 0, color: '#f97316' },
            { grade: 'F', count: 0, color: '#ef4444' },
        ];

    const safeSubjectAverages = Array.isArray(subjectAverages) ? subjectAverages : [];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
            
            {/* 1. School-Wide Grade Distribution Bell Curve */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', minHeight: '320px' }}>
                <div style={{ marginBottom: '14px' }}>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                        Grade Distribution Spread
                    </h4>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                        Student counts bucketed across performance bands
                    </p>
                </div>

                <div style={{ width: '100%', height: 220, minHeight: '220px' }}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={180}>
                        <BarChart data={safeBands} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="grade" stroke="#94a3b8" fontSize={11} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                            <Tooltip 
                                formatter={(val: any) => [`${val || 0} Students`, 'Count']}
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

            {/* 2. Departmental Subject Averages */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', minHeight: '320px' }}>
                <div style={{ marginBottom: '14px' }}>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                        Subject Mean Standings
                    </h4>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                        Average term score recorded per subject syllabus (%)
                    </p>
                </div>

                {safeSubjectAverages.length === 0 ? (
                    <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '12px' }}>
                        No subject examination entries recorded yet.
                    </div>
                ) : (
                    <div style={{ width: '100%', height: 220, minHeight: '220px' }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={180}>
                            <BarChart data={safeSubjectAverages} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                                <YAxis dataKey="subject" type="category" stroke="#64748b" fontSize={11} tickLine={false} width={90} />
                                <Tooltip 
                                    formatter={(val: any) => [`${val || 0}%`, 'Class Mean']}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                                />
                                <Bar dataKey="average" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

        </div>
    );
}