import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AcademicPerformanceChart from '@/Components/Charts/AcademicPerformanceChart';
import { Head, Link } from '@inertiajs/react';
import { 
    AlertTriangle, 
    Award, 
    BookOpen, 
    FileText, 
    GraduationCap, 
    TrendingUp, 
    Users 
} from 'lucide-react';

interface Props {
    term: { name: string } | null;
    summary: {
        average_score: number;
        total_graded: number;
        at_risk_count: number;
    };
    gradeBands: Array<{
        grade: string;
        count: number;
        color: string;
    }>;
    subjectAverages: Array<{
        subject: string;
        average: number;
    }>;
    atRiskStudents: Array<{
        first_name: string;
        last_name: string;
        admission_number: string;
        class_name: string;
        stream: string;
        subject_name: string;
        score: number;
    }>;
}

export default function AcademicDesk({ 
    term, 
    summary, 
    gradeBands = [], 
    subjectAverages = [], 
    atRiskStudents = [] 
}: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                            Academic Command Desk
                        </h2>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                            Performance curve analytics, subject mastery standings & student remediation radar — {term?.name ?? 'No Active Term'}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                            href="/grades"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: '#4f46e5',
                                color: '#ffffff',
                                padding: '8px 14px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 600,
                                textDecoration: 'none'
                            }}
                        >
                            <BookOpen style={{ width: '15px', height: '15px' }} /> Marksheet Matrix
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Academic Desk" />

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 1. Academic Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Term Mean Score</span>
                            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                                {summary.average_score}%
                            </div>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>Institutional Average</span>
                        </div>
                        <div style={{ width: '44px', height: '44px', backgroundColor: '#eef2ff', color: '#4f46e5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TrendingUp style={{ width: '22px', height: '22px' }} />
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Marks Entered</span>
                            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                                {summary.total_graded}
                            </div>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>Continuous assessment rows</span>
                        </div>
                        <div style={{ width: '44px', height: '44px', backgroundColor: '#ecfdf5', color: '#059669', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileText style={{ width: '22px', height: '22px' }} />
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase' }}>At-Risk Radar (&lt;40%)</span>
                            <div style={{ fontSize: '28px', fontWeight: 800, color: '#ef4444', marginTop: '4px' }}>
                                {summary.at_risk_count}
                            </div>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>Scores flagged for remediation</span>
                        </div>
                        <div style={{ width: '44px', height: '44px', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AlertTriangle style={{ width: '22px', height: '22px' }} />
                        </div>
                    </div>

                </div>

                {/* 2. Visual Analytics Charts */}
                <AcademicPerformanceChart 
                    gradeBands={gradeBands} 
                    subjectAverages={subjectAverages} 
                />

                {/* 3. At-Risk Early Warning Remediation Table */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                                Early Warning Radar: Scores Requiring Intervention
                            </h4>
                            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                                Students performing below the passing threshold of 40%
                            </p>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#b91c1c', backgroundColor: '#fef2f2', padding: '4px 10px', borderRadius: '6px' }}>
                            Remediation Priority
                        </span>
                    </div>

                    {atRiskStudents.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                            No at-risk assessment scores recorded. All students are currently meeting the 40% benchmark.
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '10px 20px' }}>Student</th>
                                    <th style={{ padding: '10px 20px' }}>Class / Stream</th>
                                    <th style={{ padding: '10px 20px' }}>Subject Syllabus</th>
                                    <th style={{ padding: '10px 20px', textAlign: 'right' }}>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {atRiskStudents.map((s, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px 20px' }}>
                                            <div style={{ fontWeight: 600, color: '#0f172a' }}>
                                                {s.last_name}, {s.first_name}
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>
                                                {s.admission_number}
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 20px', color: '#475569' }}>
                                            {s.class_name} ({s.stream})
                                        </td>
                                        <td style={{ padding: '12px 20px', fontWeight: 600, color: '#0f172a' }}>
                                            {s.subject_name}
                                        </td>
                                        <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#b91c1c', backgroundColor: '#fef2f2', padding: '3px 8px', borderRadius: '6px' }}>
                                                {s.score}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}