import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AcademicFilterBar from '@/Components/AcademicFilterBar';
import { Head } from '@inertiajs/react';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

interface StudentRow {
    student_id: string;
    admission_number: string;
    first_name: string;
    last_name: string;
    score: number | string | null;
    remarks: string | null;
}

interface FilterItem {
    id: string;
    name: string;
    stream?: string;
    code?: string;
}

interface Props {
    terms: FilterItem[];
    classes: FilterItem[];
    subjects: FilterItem[];
    filters: {
        term_id: string;
        class_id: string;
        subject_id: string;
    };
    term: { name: string } | null;
    assessment: {
        id: string;
        class_name: string;
        stream: string;
        subject_name: string;
        assessment_name: string;
        max_score: number;
    } | null;
    students: StudentRow[];
}

export default function GradeEntry({
    terms,
    classes,
    subjects,
    filters,
    term,
    assessment,
    students: initialStudents,
}: Props) {
    const [rows, setRows] = useState(
        initialStudents.map((s) => ({
            ...s,
            score: s.score ?? '',
            saveStatus: 'idle' as 'idle' | 'saving' | 'saved' | 'error',
        }))
    );

    useEffect(() => {
        setRows(
            initialStudents.map((s) => ({
                ...s,
                score: s.score ?? '',
                saveStatus: 'idle',
            }))
        );
    }, [initialStudents]);

    const handleScoreChange = (index: number, val: string) => {
        const next = [...rows];
        next[index].score = val;
        setRows(next);
    };

    const saveScore = async (index: number) => {
        if (!assessment) return;
        const row = rows[index];
        if (row.score === '' || isNaN(Number(row.score))) return;

        const numScore = Number(row.score);
        if (numScore < 0 || numScore > assessment.max_score) {
            updateStatus(index, 'error');
            return;
        }

        updateStatus(index, 'saving');
        try {
            await axios.post(route('grades.upsert'), {
                assessment_id: assessment.id,
                student_id: row.student_id,
                score: numScore,
            });
            updateStatus(index, 'saved');
        } catch {
            updateStatus(index, 'error');
        }
    };

    const updateStatus = (index: number, status: 'idle' | 'saving' | 'saved' | 'error') => {
        setRows((prev) => {
            const copy = [...prev];
            copy[index].saveStatus = status;
            return copy;
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter' || e.key === 'ArrowDown') {
            e.preventDefault();
            const nextInput = document.getElementById(`score-input-${index + 1}`);
            if (nextInput) nextInput.focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevInput = document.getElementById(`score-input-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', margin: 0 }}>
                            {assessment ? `${assessment.subject_name} — ${assessment.assessment_name}` : 'Grade Entry'}
                        </h2>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>
                            {assessment ? `${assessment.class_name} (${assessment.stream}) | ${term?.name}` : 'Select a stream and subject to begin'}
                        </p>
                    </div>
                    {assessment && (
                        <span style={{ fontSize: '12px', fontWeight: 700, backgroundColor: '#ecfdf5', color: '#065f46', padding: '6px 12px', borderRadius: '9999px', border: '1px solid #a7f3d0' }}>
                            Max Score: {assessment.max_score}
                        </span>
                    )}
                </div>
            }
        >
            <Head title="Mark Entry Grid" />

            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Universal Context Selector */}
                <AcademicFilterBar
                    terms={terms}
                    classes={classes}
                    subjects={subjects}
                    selectedTermId={filters.term_id}
                    selectedClassId={filters.class_id}
                    selectedSubjectId={filters.subject_id}
                    routeName="grades.index"
                />

                {/* Marksheet Grid */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    {rows.length === 0 ? (
                        <div style={{ padding: '48px 16px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                            No active students found enrolled in this stream.
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '12px 20px', width: '160px' }}>Admission #</th>
                                    <th style={{ padding: '12px 20px' }}>Student Name</th>
                                    <th style={{ padding: '12px 20px', width: '180px' }}>Score / {assessment?.max_score}</th>
                                    <th style={{ padding: '12px 20px', textAlign: 'center', width: '100px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, idx) => (
                                    <tr key={row.student_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '12px 20px', fontFamily: 'monospace', color: '#4b5563' }}>{row.admission_number}</td>
                                        <td style={{ padding: '12px 20px', fontWeight: 600, color: '#111827' }}>
                                            {row.last_name}, {row.first_name}
                                        </td>
                                        <td style={{ padding: '12px 20px' }}>
                                            <input
                                                id={`score-input-${idx}`}
                                                type="number"
                                                value={row.score}
                                                onChange={(e) => handleScoreChange(idx, e.target.value)}
                                                onBlur={() => saveScore(idx)}
                                                onKeyDown={(e) => handleKeyDown(e, idx)}
                                                style={{
                                                    width: '100px',
                                                    textAlign: 'center',
                                                    fontWeight: 700,
                                                    fontSize: '14px',
                                                    padding: '6px 8px',
                                                    borderRadius: '6px',
                                                    border: row.saveStatus === 'error' ? '1px solid #ef4444' : '1px solid #d1d5db',
                                                    backgroundColor: row.saveStatus === 'error' ? '#fef2f2' : '#ffffff',
                                                    outline: 'none',
                                                }}
                                                placeholder="0 - 100"
                                            />
                                        </td>
                                        <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                                            {row.saveStatus === 'saving' && <RefreshCw style={{ width: '16px', height: '16px', color: '#3b82f6', display: 'inline', animation: 'spin 1s linear infinite' }} />}
                                            {row.saveStatus === 'saved' && <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10b981', display: 'inline' }} />}
                                            {row.saveStatus === 'error' && <AlertCircle style={{ width: '16px', height: '16px', color: '#ef4444', display: 'inline' }} />}
                                            {row.saveStatus === 'idle' && <span style={{ color: '#d1d5db' }}>—</span>}
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