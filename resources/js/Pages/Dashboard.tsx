import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Users, 
    GraduationCap, 
    CalendarCheck, 
    DollarSign, 
    ClipboardList, 
    Award, 
    ArrowRight 
} from 'lucide-react';

interface Props {
    term: { name: string } | null;
    metrics: {
        total_students: number;
        total_teachers: number;
        total_classes: number;
        collection_rate: number;
        total_collected: number;
        total_invoiced: number;
        attendance_rate: number | null;
        present_today: number;
        absent_today: number;
    };
    recentPayments: Array<{
        receipt_number: string;
        amount: number;
        payment_method: string;
        created_at: string;
        first_name: string;
        last_name: string;
        admission_number: string;
    }>;
}

export default function Dashboard({ term, metrics, recentPayments }: Props) {
    const { auth } = usePage<{ auth: { user: { name: string } } }>().props;

    const quickLinks = [
        {
            title: 'Academic Command Desk',
            description: 'Early warning radar, department curves & exam standings',
            href: route('academic.desk'),
            icon: GraduationCap,
            accent: '#4f46e5',
            badge: 'Real-time',
        },
        {
            title: 'Marksheet Grid',
            description: 'Auto-saving continuous test & exam entry matrix',
            href: route('grades.index'),
            icon: ClipboardList,
            accent: '#2563eb',
            badge: 'Active Term',
        },
        {
            title: 'Official Report Cards',
            description: 'Class rankings and automated PDF transcript release',
            href: route('academic.summary'),
            icon: Award,
            accent: '#059669',
            badge: 'End of Term',
        },
        {
            title: 'Attendance Register',
            description: 'One-click morning roll-call & absenteeism radar',
            href: route('attendance.index'),
            icon: CalendarCheck,
            accent: '#d97706',
            badge: 'Daily',
        },
        {
            title: 'Fee Collection & Bursar',
            description: 'Receivables tracking, payment receipts & financial clearance',
            href: route('fees.index'),
            icon: DollarSign,
            accent: '#059669',
            badge: 'Bursar',
        },
        {
            title: 'Staff & Student Directory',
            description: 'Admissions, class stream assignments & teacher allocations',
            href: route('roster.index'),
            icon: Users,
            accent: '#9333ea',
            badge: 'Admin',
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', margin: 0 }}>
                            Institutional Overview
                        </h2>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>
                            Welcome back, {auth?.user?.name ?? 'Administrator'} — {term?.name ?? 'No Active Term'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                            href={route('grades.index')}
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
                            <ClipboardList style={{ width: '15px', height: '15px' }} /> Enter Marks
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Institutional Dashboard" />

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* 1. Core Vital Metric Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    
                    {/* Students */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Active Students</span>
                            <div style={{ fontSize: '26px', fontWeight: 800, color: '#111827', marginTop: '4px' }}>
                                {metrics?.total_students ?? 0}
                            </div>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                Across {metrics?.total_classes ?? 0} Streams
                            </span>
                        </div>
                        <div style={{ width: '44px', height: '44px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users style={{ width: '22px', height: '22px' }} />
                        </div>
                    </div>

                    {/* Attendance */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Today's Roll-Call</span>
                            <div style={{ fontSize: '26px', fontWeight: 800, color: metrics?.attendance_rate !== null ? '#059669' : '#6b7280', marginTop: '4px' }}>
                                {metrics?.attendance_rate !== null ? `${metrics.attendance_rate}%` : 'Pending'}
                            </div>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                {metrics?.attendance_rate !== null ? `${metrics.present_today} Present • ${metrics.absent_today} Absent` : 'Not recorded yet'}
                            </span>
                        </div>
                        <div style={{ width: '44px', height: '44px', backgroundColor: '#fffbeb', color: '#d97706', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CalendarCheck style={{ width: '22px', height: '22px' }} />
                        </div>
                    </div>

                    {/* Fees Collection */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Fee Collection Rate</span>
                            <div style={{ fontSize: '26px', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                                {metrics?.collection_rate ?? 0}%
                            </div>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                TZS {(metrics?.total_collected ?? 0).toLocaleString()}
                            </span>
                        </div>
                        <div style={{ width: '44px', height: '44px', backgroundColor: '#ecfdf5', color: '#059669', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <DollarSign style={{ width: '22px', height: '22px' }} />
                        </div>
                    </div>

                    {/* Academic Staff */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Academic Staff</span>
                            <div style={{ fontSize: '26px', fontWeight: 800, color: '#111827', marginTop: '4px' }}>
                                {metrics?.total_teachers ?? 0}
                            </div>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>Active Instructors</span>
                        </div>
                        <div style={{ width: '44px', height: '44px', backgroundColor: '#faf5ff', color: '#9333ea', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <GraduationCap style={{ width: '22px', height: '22px' }} />
                        </div>
                    </div>

                </div>

                {/* 2. Operations Launchpad Grid */}
                <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '14px' }}>Operations Launchpad</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                        {quickLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.title}
                                    href={link.href}
                                    style={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '16px',
                                        padding: '20px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        textDecoration: 'none',
                                        transition: 'all 0.15s ease',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: `${link.accent}15`, color: link.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Icon style={{ width: '22px', height: '22px' }} />
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>{link.title}</h4>
                                                <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#f3f4f6', color: '#4b5563' }}>
                                                    {link.badge}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>{link.description}</p>
                                        </div>
                                    </div>
                                    <ArrowRight style={{ width: '16px', height: '16px', color: '#9ca3af', flexShrink: 0 }} />
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* 3. Recent Real-Time Ledger Feed */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div>
                            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>Recent Fee Receipts</h3>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>Latest automated collections credited to accounts</p>
                        </div>
                        <Link href={route('fees.index')} style={{ fontSize: '12px', fontWeight: 600, color: '#4f46e5', textDecoration: 'none' }}>
                            View All →
                        </Link>
                    </div>

                    {(!recentPayments || recentPayments.length === 0) ? (
                        <div style={{ padding: '24px 0', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
                            No fee payments recorded this term yet.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {recentPayments.map((p) => (
                                <div key={p.receipt_number} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                                            {p.last_name}, {p.first_name}
                                            <span style={{ fontSize: '11px', color: '#6b7280', marginLeft: '6px', fontFamily: 'monospace' }}>({p.admission_number})</span>
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#6b7280' }}>
                                            {p.receipt_number} • {p.payment_method}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#059669' }}>
                                            + TZS {Number(p.amount).toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#9ca3af' }}>{new Date(p.created_at).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}