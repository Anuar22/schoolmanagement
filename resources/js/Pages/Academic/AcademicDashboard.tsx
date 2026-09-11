import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    GraduationCap, 
    AlertTriangle, 
    CheckCircle, 
    BookOpen, 
    Users, 
    ClipboardList,
    ArrowRight
} from 'lucide-react';

interface Props {
    term: { name: string } | null;
    metrics: {
        total_students: number;
        total_classes: number;
        total_subjects: number;
        school_gpa: number;
        pending_submissions: number;
    };
    atRiskStudents: Array<{
        id: string;
        first_name: string;
        last_name: string;
        class_name: string;
        stream: string;
        avg_score: number;
    }>;
    departmentPerformance: Array<{
        department: string;
        avg_score: number;
    }>;
}

export default function AcademicDashboard({ term, metrics, atRiskStudents, departmentPerformance }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', margin: 0 }}>
                            Academic Operations Command
                        </h2>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>
                            {term?.name ?? 'No Active Term'} — Realtime Overview
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Link
                            href={route('grades.index')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: '#4f46e5',
                                color: '#ffffff',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 600,
                                textDecoration: 'none'
                            }}
                        >
                            <ClipboardList style={{ width: '16px', height: '16px' }} />
                            <span>Open Marksheet</span>
                        </Link>
                        <Link
                            href={route('academic.summary')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: '#ffffff',
                                color: '#374151',
                                border: '1px solid #d1d5db',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 600,
                                textDecoration: 'none'
                            }}
                        >
                            <span>Class Standings</span>
                            <ArrowRight style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Academic Dashboard" />

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* 1. Top KPI Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    
                    {/* Card 1: Students */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '16px',
                        padding: '20px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                        <div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Enrolled Students
                            </span>
                            <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: '4px 0 2px 0', lineHeight: 1.2 }}>
                                {metrics.total_students}
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#059669' }}>
                                Active Roster
                            </span>
                        </div>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <Users style={{ width: '22px', height: '22px' }} />
                        </div>
                    </div>

                    {/* Card 2: Mean Score */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '16px',
                        padding: '20px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                        <div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                School Mean Score
                            </span>
                            <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: '4px 0 2px 0', lineHeight: 1.2 }}>
                                {metrics.school_gpa}%
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#4f46e5' }}>
                                Weighted Average
                            </span>
                        </div>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: '#eef2ff',
                            color: '#4f46e5',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <GraduationCap style={{ width: '22px', height: '22px' }} />
                        </div>
                    </div>

                    {/* Card 3: Subjects */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '16px',
                        padding: '20px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                        <div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Active Subjects
                            </span>
                            <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: '4px 0 2px 0', lineHeight: 1.2 }}>
                                {metrics.total_subjects}
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>
                                {metrics.total_classes} Streams
                            </span>
                        </div>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: '#fffbeb',
                            color: '#d97706',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <BookOpen style={{ width: '22px', height: '22px' }} />
                        </div>
                    </div>

                    {/* Card 4: Overdue Marksheets */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '16px',
                        padding: '20px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                        <div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Overdue Marksheets
                            </span>
                            <div style={{ fontSize: '28px', fontWeight: 800, color: '#dc2626', margin: '4px 0 2px 0', lineHeight: 1.2 }}>
                                {metrics.pending_submissions}
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#dc2626' }}>
                                Requires Follow-up
                            </span>
                        </div>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: '#fef2f2',
                            color: '#dc2626',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <AlertTriangle style={{ width: '22px', height: '22px' }} />
                        </div>
                    </div>

                </div>

                {/* 2. Middle Row: Diagnostics & Department Curve */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                    
                    {/* Early Warnings Radar */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        gridColumn: 'span 2'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>Academic Early Warnings</h3>
                                <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>Students flagged below passing threshold (40%)</p>
                            </div>
                            <span style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                backgroundColor: '#fef2f2',
                                color: '#b91c1c',
                                padding: '4px 10px',
                                borderRadius: '9999px',
                                border: '1px solid #fee2e2'
                            }}>
                                {atRiskStudents.length} Flagged
                            </span>
                        </div>

                        {atRiskStudents.length === 0 ? (
                            <div style={{
                                padding: '48px 16px',
                                textAlign: 'center',
                                color: '#6b7280',
                                fontSize: '14px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px dashed #e5e7eb',
                                borderRadius: '12px'
                            }}>
                                <CheckCircle style={{ width: '32px', height: '32px', color: '#10b981', marginBottom: '8px' }} />
                                <span style={{ fontWeight: 600, color: '#374151' }}>All student averages above threshold</span>
                                <span style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>No immediate interventions needed</span>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '14px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #f3f4f6', fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>
                                            <th style={{ padding: '10px 12px' }}>Student</th>
                                            <th style={{ padding: '10px 12px' }}>Class</th>
                                            <th style={{ padding: '10px 12px', textAlign: 'right' }}>Average</th>
                                            <th style={{ padding: '10px 12px', textAlign: 'right' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {atRiskStudents.map((s) => (
                                            <tr key={s.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                                                <td style={{ padding: '12px', fontWeight: 600, color: '#111827' }}>
                                                    {s.last_name}, {s.first_name}
                                                </td>
                                                <td style={{ padding: '12px', fontSize: '12px', color: '#6b7280' }}>
                                                    {s.class_name} ({s.stream})
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#dc2626' }}>
                                                    {s.avg_score}%
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                                    <button style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        fontSize: '12px',
                                                        fontWeight: 600,
                                                        color: '#4f46e5',
                                                        cursor: 'pointer'
                                                    }}>
                                                        Intervention Plan
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Department Standings */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>Department Standings</h3>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 16px 0' }}>Rolling average by faculty</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {departmentPerformance.map((dept) => (
                                    <div key={dept.department}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                                            <span style={{ color: '#374151' }}>{dept.department}</span>
                                            <span style={{ color: '#4f46e5', fontWeight: 700 }}>{dept.avg_score}%</span>
                                        </div>
                                        <div style={{ width: '100%', backgroundColor: '#f3f4f6', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
                                            <div
                                                style={{
                                                    width: `${Math.min(dept.avg_score, 100)}%`,
                                                    backgroundColor: '#4f46e5',
                                                    height: '8px',
                                                    borderRadius: '9999px',
                                                    transition: 'width 0.5s ease'
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                            <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Scores aggregate all recorded continuous tests & exams</p>
                        </div>
                    </div>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}