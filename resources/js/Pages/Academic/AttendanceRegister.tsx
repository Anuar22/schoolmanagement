import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Check, X, Clock, Calendar, CheckCheck, Save } from 'lucide-react';

interface StudentAttendance {
    student_id: string;
    admission_number: string;
    full_name: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'UNRECORDED';
    remarks: string;
}

interface Props {
    students: StudentAttendance[];
    selectedDate: string;
    currentClass: { id: string; name: string; stream: string } | null;
    stats: {
        total: number;
        present: number;
        absent: number;
        late: number;
    };
}

export default function AttendanceRegister({ students: initialStudents, selectedDate, currentClass, stats }: Props) {
    const [roster, setRoster] = useState(
        initialStudents.map((s) => ({
            ...s,
            status: s.status === 'UNRECORDED' ? 'PRESENT' : s.status,
        }))
    );
    const [date, setDate] = useState(selectedDate);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateStatus = (studentId: string, newStatus: 'PRESENT' | 'ABSENT' | 'LATE') => {
        setRoster((prev) =>
            prev.map((s) => (s.student_id === studentId ? { ...s, status: newStatus } : s))
        );
    };

    const markAll = (status: 'PRESENT' | 'ABSENT') => {
        setRoster((prev) => prev.map((s) => ({ ...s, status })));
    };

    const handleSave = () => {
        if (!currentClass) return;
        setIsSubmitting(true);
        router.post(
            route('attendance.bulk'),
            {
                class_id: currentClass.id,
                date: date,
                records: roster.map((s) => ({ student_id: s.student_id, status: s.status })),
            },
            {
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', margin: 0 }}>
                            Daily Attendance Register
                        </h2>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>
                            {currentClass ? `${currentClass.name} (${currentClass.stream})` : 'No Class Configured'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ffffff', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '8px' }}>
                            <Calendar style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => {
                                    setDate(e.target.value);
                                    router.get(route('attendance.index'), { date: e.target.value }, { preserveState: false });
                                }}
                                style={{ border: 'none', background: 'transparent', fontSize: '12px', fontWeight: 600, color: '#374151', outline: 'none' }}
                            />
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSubmitting}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: '#4f46e5',
                                color: '#ffffff',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            <Save style={{ width: '15px', height: '15px' }} />
                            <span>{isSubmitting ? 'Saving...' : 'Save Register'}</span>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Attendance Register" />

            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Fast Controls & Summary */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', background: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => markAll('PRESENT')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#ecfdf5',
                                color: '#047857',
                                border: '1px solid #a7f3d0',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            <CheckCheck style={{ width: '14px', height: '14px' }} /> Mark All Present
                        </button>
                        <button
                            onClick={() => markAll('ABSENT')}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#fef2f2',
                                color: '#b91c1c',
                                border: '1px solid #fecaca',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            <X style={{ width: '14px', height: '14px' }} /> Clear All
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: 600 }}>
                        <span style={{ color: '#059669' }}>Present: {roster.filter(s => s.status === 'PRESENT').length}</span>
                        <span style={{ color: '#dc2626' }}>Absent: {roster.filter(s => s.status === 'ABSENT').length}</span>
                        <span style={{ color: '#d97706' }}>Late: {roster.filter(s => s.status === 'LATE').length}</span>
                    </div>
                </div>

                {/* Roll Call Table */}
                <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                                <th style={{ padding: '12px 20px' }}>Admission #</th>
                                <th style={{ padding: '12px 20px' }}>Student Name</th>
                                <th style={{ padding: '12px 20px', textAlign: 'center' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roster.map((student) => (
                                <tr key={student.student_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '12px 20px', fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>
                                        {student.admission_number}
                                    </td>
                                    <td style={{ padding: '12px 20px', fontWeight: 600, color: '#111827' }}>
                                        {student.full_name}
                                    </td>
                                    <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                                            <button
                                                onClick={() => updateStatus(student.student_id, 'PRESENT')}
                                                style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    border: student.status === 'PRESENT' ? '1px solid #059669' : '1px solid #e5e7eb',
                                                    backgroundColor: student.status === 'PRESENT' ? '#10b981' : '#ffffff',
                                                    color: student.status === 'PRESENT' ? '#ffffff' : '#4b5563',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Present
                                            </button>
                                            <button
                                                onClick={() => updateStatus(student.student_id, 'LATE')}
                                                style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    border: student.status === 'LATE' ? '1px solid #d97706' : '1px solid #e5e7eb',
                                                    backgroundColor: student.status === 'LATE' ? '#f59e0b' : '#ffffff',
                                                    color: student.status === 'LATE' ? '#ffffff' : '#4b5563',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Late
                                            </button>
                                            <button
                                                onClick={() => updateStatus(student.student_id, 'ABSENT')}
                                                style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    border: student.status === 'ABSENT' ? '1px solid #dc2626' : '1px solid #e5e7eb',
                                                    backgroundColor: student.status === 'ABSENT' ? '#ef4444' : '#ffffff',
                                                    color: student.status === 'ABSENT' ? '#ffffff' : '#4b5563',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Absent
                                            </button>
                                        </div>
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