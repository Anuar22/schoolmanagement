import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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

interface Props {
    term: { name: string };
    assessment: {
        id: string;
        class_name: string;
        stream: string;
        subject_name: string;
        assessment_name: string;
        max_score: number;
    };
    students: StudentRow[];
}

export default function GradeEntry({ term, assessment, students: initialStudents }: Props) {
    const [rows, setRows] = useState(
        initialStudents.map((s) => ({
            ...s,
            score: s.score ?? '',
            saveStatus: 'idle' as 'idle' | 'saving' | 'saved' | 'error',
        }))
    );

    const handleScoreChange = (index: number, val: string) => {
        const next = [...rows];
        next[index].score = val;
        setRows(next);
    };

    const saveScore = async (index: number) => {
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
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {assessment.subject_name} — {assessment.assessment_name}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {assessment.class_name} ({assessment.stream}) | {term?.name}
                        </p>
                    </div>
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 font-medium">
                        Max Score: {assessment.max_score}
                    </span>
                </div>
            }
        >
            <Head title="Mark Entry Grid" />

            <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="py-3.5 px-6">Admission #</th>
                                <th className="py-3.5 px-6">Student Name</th>
                                <th className="py-3.5 px-6 w-44">Score / {assessment.max_score}</th>
                                <th className="py-3.5 px-6 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {rows.map((row, idx) => (
                                <tr key={row.student_id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="py-3.5 px-6 font-mono text-gray-600 text-xs">{row.admission_number}</td>
                                    <td className="py-3.5 px-6 font-medium text-gray-800">
                                        {row.last_name}, {row.first_name}
                                    </td>
                                    <td className="py-3.5 px-6">
                                        <input
                                            id={`score-input-${idx}`}
                                            type="number"
                                            value={row.score}
                                            onChange={(e) => handleScoreChange(idx, e.target.value)}
                                            onBlur={() => saveScore(idx)}
                                            onKeyDown={(e) => handleKeyDown(e, idx)}
                                            className={`w-28 text-center font-semibold rounded-md text-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${
                                                row.saveStatus === 'error' ? 'border-red-500 bg-red-50 text-red-700' : ''
                                            }`}
                                            placeholder="0 - 100"
                                        />
                                    </td>
                                    <td className="py-3.5 px-6 text-center">
                                        {row.saveStatus === 'saving' && <RefreshCw className="w-4 h-4 text-blue-500 animate-spin inline" />}
                                        {row.saveStatus === 'saved' && <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" />}
                                        {row.saveStatus === 'error' && <AlertCircle className="w-4 h-4 text-rose-500 inline" />}
                                        {row.saveStatus === 'idle' && <span className="text-gray-300">—</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}