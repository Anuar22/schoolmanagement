import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Award, FileText, ArrowLeft, Lock, CheckCircle } from 'lucide-react';

interface SummaryRow {
    student_id: string;
    admission_number: string;
    full_name: string;
    total_score: number;
    average: number;
    grade_letter: string;
    rank: number;
    fee_status: 'PAID' | 'PARTIAL' | 'UNPAID' | 'NO_INVOICE';
    outstanding_balance: number;
    is_cleared: boolean;
}

interface Props {
    term: { name: string } | null;
    currentClass: { name: string; stream: string } | null;
    summary: SummaryRow[];
}

export default function ReportSummary({ term, currentClass, summary }: Props) {
    const getGradeBadge = (grade: string) => {
        switch (grade) {
            case 'A': return { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' };
            case 'B': return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' };
            case 'C': return { bg: '#fffbeb', color: '#b45309', border: '#fde68a' };
            default: return { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' };
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', margin: 0 }}>
                            Class Standings & Report Cards
                        </h2>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>
                            {currentClass ? `${currentClass.name} (${currentClass.stream})` : 'Class'} — {term?.name ?? 'Active Term'}
                        </p>
                    </div>
                    <Link
                        href={route('grades.index')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: '#ffffff',
                            color: '#374151',
                            border: '1px solid #d1d5db',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            textDecoration: 'none'
                        }}
                    >
                        <ArrowLeft style={{ width: '14px', height: '14px' }} /> Marksheet
                    </Link>
                </div>
            }
        >
            <Head title="Class Standings" />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                                <th style={{ padding: '12px 20px', width: '70px' }}>Rank</th>
                                <th style={{ padding: '12px 20px' }}>Admission #</th>
                                <th style={{ padding: '12px 20px' }}>Student Name</th>
                                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Average %</th>
                                <th style={{ padding: '12px 20px', textAlign: 'center' }}>Grade</th>
                                <th style={{ padding: '12px 20px', textAlign: 'center' }}>Bursar Clearance</th>
                                <th style={{ padding: '12px 20px', textAlign: 'center' }}>Report Card</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.map((row) => {
                                const badge = getGradeBadge(row.grade_letter);
                                return (
                                    <tr key={row.student_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '14px 20px', fontWeight: 800, color: row.rank === 1 ? '#d97706' : '#374151' }}>
                                            {row.rank === 1 ? (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                    <Award style={{ width: '15px', height: '15px' }} /> #1
                                                </span>
                                            ) : (
                                                `#${row.rank}`
                                            )}
                                        </td>
                                        <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: '#6b7280', fontSize: '12px' }}>
                                            {row.admission_number}
                                        </td>
                                        <td style={{ padding: '14px 20px', fontWeight: 600, color: '#111827' }}>
                                            {row.full_name}
                                        </td>
                                        <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 700, color: '#111827' }}>
                                            {row.average}%
                                        </td>
                                        <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                                            <span style={{
                                                padding: '3px 8px',
                                                borderRadius: '9999px',
                                                fontSize: '11px',
                                                fontWeight: 800,
                                                backgroundColor: badge.bg,
                                                color: badge.color,
                                                border: `1px solid ${badge.border}`
                                            }}>
                                                {row.grade_letter}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                                            {row.is_cleared ? (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: '#059669' }}>
                                                    <CheckCircle style={{ width: '13px', height: '13px' }} /> Cleared
                                                </span>
                                            ) : (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: '#dc2626' }}>
                                                    <Lock style={{ width: '13px', height: '13px' }} /> Hold (TZS {row.outstanding_balance.toLocaleString()})
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                                            <a
                                                href={`/report-card/pdf/${row.student_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    color: row.is_cleared ? '#4f46e5' : '#6b7280',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                <FileText style={{ width: '14px', height: '14px' }} />
                                                <span>{row.is_cleared ? 'Official PDF' : 'Provisional PDF'}</span>
                                            </a>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}