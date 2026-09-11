import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Users, UserPlus, BookOpen, Trash2, Edit3, X, Check } from 'lucide-react';

interface Student {
    id: string;
    admission_number: string;
    first_name: string;
    last_name: string;
    gender: 'Male' | 'Female';
    is_active: boolean;
    class_id: string;
    class_name: string;
    stream: string;
}

interface Allocation {
    allocation_id: string;
    subject_name: string;
    subject_code: string;
    class_name: string;
    stream: string;
}

interface Teacher {
    id: number;
    name: string;
    email: string;
    allocations: Allocation[];
}

interface ClassItem {
    id: string;
    name: string;
    stream: string;
}

interface SubjectItem {
    id: string;
    name: string;
    code: string;
}

interface Props {
    students: Student[];
    teachers: Teacher[];
    classes: ClassItem[];
    subjects: SubjectItem[];
}

export default function RosterManagement({ students, teachers, classes, subjects }: Props) {
    const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');

    // Modals
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [showTeacherModal, setShowTeacherModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState<number | null>(null);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    // Student Form
    const [admNo, setAdmNo] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female'>('Male');
    const [classId, setClassId] = useState(classes[0]?.id ?? '');

    // Teacher Form
    const [teacherName, setTeacherName] = useState('');
    const [teacherEmail, setTeacherEmail] = useState('');
    const [teacherPassword, setTeacherPassword] = useState('password123');

    // Allocation Form
    const [allocSubject, setAllocSubject] = useState(subjects[0]?.id ?? '');
    const [allocClass, setAllocClass] = useState(classes[0]?.id ?? '');

    const handleCreateStudent = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('roster.students.store'), {
            admission_number: admNo,
            first_name: firstName,
            last_name: lastName,
            gender,
            class_id: classId,
        }, {
            onSuccess: () => {
                setShowStudentModal(false);
                setAdmNo('');
                setFirstName('');
                setLastName('');
            }
        });
    };

    const handleUpdateStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStudent) return;

        router.put(route('roster.students.update', editingStudent.id), {
            first_name: editingStudent.first_name,
            last_name: editingStudent.last_name,
            gender: editingStudent.gender,
            class_id: editingStudent.class_id,
            is_active: editingStudent.is_active,
        }, {
            onSuccess: () => setEditingStudent(null)
        });
    };

    const handleCreateTeacher = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('roster.teachers.store'), {
            name: teacherName,
            email: teacherEmail,
            password: teacherPassword,
        }, {
            onSuccess: () => {
                setShowTeacherModal(false);
                setTeacherName('');
                setTeacherEmail('');
            }
        });
    };

    const handleAssignAllocation = (e: React.FormEvent) => {
        e.preventDefault();
        if (!showAssignModal) return;

        router.post(route('roster.allocations.store'), {
            teacher_id: showAssignModal,
            subject_id: allocSubject,
            class_id: allocClass,
        }, {
            onSuccess: () => setShowAssignModal(null)
        });
    };

    const handleRemoveAllocation = (allocId: string) => {
        if (confirm('Remove this workload allocation from the teacher?')) {
            router.delete(route('roster.allocations.destroy', allocId));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', margin: 0 }}>
                            Staff & Student Administration
                        </h2>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>
                            Roster enrollments, class stream transfers, and teacher workload mapping
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {activeTab === 'students' ? (
                            <button
                                onClick={() => setShowStudentModal(true)}
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
                                <UserPlus style={{ width: '15px', height: '15px' }} /> Enroll Student
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowTeacherModal(true)}
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
                                <UserPlus style={{ width: '15px', height: '15px' }} /> Add Teacher
                            </button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title="Staff & Students" />

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Mode Selector Tabs */}
                <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
                    <button
                        onClick={() => setActiveTab('students')}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            backgroundColor: activeTab === 'students' ? '#4f46e5' : '#f3f4f6',
                            color: activeTab === 'students' ? '#ffffff' : '#4b5563',
                        }}
                    >
                        Student Directory ({students.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('teachers')}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            backgroundColor: activeTab === 'teachers' ? '#4f46e5' : '#f3f4f6',
                            color: activeTab === 'teachers' ? '#ffffff' : '#4b5563',
                        }}
                    >
                        Teacher Allocations ({teachers.length})
                    </button>
                </div>

                {/* Tab 1: Students Roster */}
                {activeTab === 'students' && (
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '12px 20px' }}>Adm #</th>
                                    <th style={{ padding: '12px 20px' }}>Full Name</th>
                                    <th style={{ padding: '12px 20px' }}>Gender</th>
                                    <th style={{ padding: '12px 20px' }}>Current Stream</th>
                                    <th style={{ padding: '12px 20px', textAlign: 'center' }}>Status</th>
                                    <th style={{ padding: '12px 20px', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontWeight: 700, color: '#374151' }}>
                                            {student.admission_number}
                                        </td>
                                        <td style={{ padding: '14px 20px', fontWeight: 600, color: '#111827' }}>
                                            {student.last_name}, {student.first_name}
                                        </td>
                                        <td style={{ padding: '14px 20px', color: '#4b5563' }}>{student.gender}</td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <span style={{ backgroundColor: '#eef2ff', color: '#4338ca', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                                                {student.class_name} ({student.stream})
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                                            <span style={{
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                padding: '2px 8px',
                                                borderRadius: '9999px',
                                                backgroundColor: student.is_active ? '#ecfdf5' : '#fef2f2',
                                                color: student.is_active ? '#047857' : '#b91c1c'
                                            }}>
                                                {student.is_active ? 'ACTIVE' : 'INACTIVE'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                                            <button
                                                onClick={() => setEditingStudent(student)}
                                                style={{ border: 'none', background: 'transparent', color: '#4f46e5', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}
                                            >
                                                <Edit3 style={{ width: '14px', height: '14px' }} /> Edit / Stream
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Tab 2: Teachers & Allocations */}
                {activeTab === 'teachers' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                        {teachers.map((t) => (
                            <div key={t.id} style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: 0 }}>{t.name}</h3>
                                            <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>{t.email}</p>
                                        </div>
                                        <button
                                            onClick={() => setShowAssignModal(t.id)}
                                            style={{
                                                backgroundColor: '#eef2ff',
                                                color: '#4f46e5',
                                                border: 'none',
                                                padding: '6px 10px',
                                                borderRadius: '6px',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            + Assign Workload
                                        </button>
                                    </div>

                                    <div style={{ marginTop: '16px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Assigned Classes & Subjects</span>
                                        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            {t.allocations.length === 0 ? (
                                                <span style={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic' }}>No active classes allocated</span>
                                            ) : (
                                                t.allocations.map((alloc) => (
                                                    <div key={alloc.allocation_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb', padding: '8px 10px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                                                        <div style={{ fontSize: '12px', color: '#374151' }}>
                                                            <strong>{alloc.subject_name}</strong> ({alloc.subject_code}) — {alloc.class_name} {alloc.stream}
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveAllocation(alloc.allocation_id)}
                                                            style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
                                                        >
                                                            <Trash2 style={{ width: '13px', height: '13px' }} />
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {/* Modal 1: Enroll Student */}
            {showStudentModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '440px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: 0 }}>Enroll New Student</h3>
                            <button onClick={() => setShowStudentModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X style={{ width: '18px', height: '18px', color: '#9ca3af' }} /></button>
                        </div>
                        <form onSubmit={handleCreateStudent} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '4px' }}>Admission Number</label>
                                <input type="text" value={admNo} onChange={(e) => setAdmNo(e.target.value)} required placeholder="e.g. ADM2026010" style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '4px' }}>First Name</label>
                                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '4px' }}>Last Name</label>
                                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '4px' }}>Gender</label>
                                <select value={gender} onChange={(e) => setGender(e.target.value as 'Male' | 'Female')} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '4px' }}>Assigned Stream</label>
                                <select value={classId} onChange={(e) => setClassId(e.target.value)} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }}>
                                    {classes.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name} ({c.stream})</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                                <button type="button" onClick={() => setShowStudentModal(false)} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#4f46e5', color: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Enroll Student</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal 2: Edit Student / Change Stream */}
            {editingStudent && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '440px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: 0 }}>Update Student Profile</h3>
                            <button onClick={() => setEditingStudent(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X style={{ width: '18px', height: '18px', color: '#9ca3af' }} /></button>
                        </div>
                        <form onSubmit={handleUpdateStudent} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '4px' }}>First Name</label>
                                    <input type="text" value={editingStudent.first_name} onChange={(e) => setEditingStudent({ ...editingStudent, first_name: e.target.value })} required style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '4px' }}>Last Name</label>
                                    <input type="text" value={editingStudent.last_name} onChange={(e) => setEditingStudent({ ...editingStudent, last_name: e.target.value })} required style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '4px' }}>Stream Reassignment</label>
                                <select value={editingStudent.class_id} onChange={(e) => setEditingStudent({ ...editingStudent, class_id: e.target.value })} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }}>
                                    {classes.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name} ({c.stream})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '4px' }}>Enrollment Status</label>
                                <select value={editingStudent.is_active ? '1' : '0'} onChange={(e) => setEditingStudent({ ...editingStudent, is_active: e.target.value === '1' })} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }}>
                                    <option value="1">Active</option>
                                    <option value="0">Inactive / Transferred</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                                <button type="button" onClick={() => setEditingStudent(null)} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#4f46e5', color: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal 3: Add Teacher */}
            {showTeacherModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '440px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: 0 }}>Create Teacher Account</h3>
                            <button onClick={() => setShowTeacherModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X style={{ width: '18px', height: '18px', color: '#9ca3af' }} /></button>
                        </div>
                        <form onSubmit={handleCreateTeacher} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '4px' }}>Full Name</label>
                                <input type="text" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} required placeholder="e.g. Sarah Mwangi" style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '4px' }}>Email Address</label>
                                <input type="email" value={teacherEmail} onChange={(e) => setTeacherEmail(e.target.value)} required placeholder="smwangi@school.ac.tz" style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '4px' }}>Initial Password</label>
                                <input type="text" value={teacherPassword} onChange={(e) => setTeacherPassword(e.target.value)} required style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                                <button type="button" onClick={() => setShowTeacherModal(false)} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#4f46e5', color: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Create Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal 4: Assign Workload */}
            {showAssignModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '440px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: 0 }}>Assign Subject & Class</h3>
                            <button onClick={() => setShowAssignModal(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X style={{ width: '18px', height: '18px', color: '#9ca3af' }} /></button>
                        </div>
                        <form onSubmit={handleAssignAllocation} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '4px' }}>Subject</label>
                                <select value={allocSubject} onChange={(e) => setAllocSubject(e.target.value)} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }}>
                                    {subjects.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '4px' }}>Target Stream</label>
                                <select value={allocClass} onChange={(e) => setAllocClass(e.target.value)} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }}>
                                    {classes.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name} ({c.stream})</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                                <button type="button" onClick={() => setShowAssignModal(null)} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#4f46e5', color: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Confirm Allocation</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}