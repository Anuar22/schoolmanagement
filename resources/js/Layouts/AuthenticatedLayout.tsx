import { PropsWithChildren, ReactNode } from 'react';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, ClipboardList, Award, CalendarCheck, DollarSign, Users2 } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth?.user;

    const navItems = [
        { name: 'Command Desk', route: 'academic.desk', icon: LayoutDashboard },
        { name: 'Marksheet Grid', route: 'grades.index', icon: ClipboardList },
        { name: 'Class Standings', route: 'academic.summary', icon: Award },
        { name: 'Attendance', route: 'attendance.index', icon: CalendarCheck },
        { name: 'Fees Ledger', route: 'fees.index', icon: DollarSign },
        { name: 'Staff & Students', route: 'roster.index', icon: Users2 },
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
            {/* Top Navigation Bar */}
            <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 40 }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
                    
                    {/* Brand & Main Links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', overflowX: 'auto' }}>
                        <Link
                            href={route('academic.desk')}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}
                        >
                            <div style={{ width: '36px', height: '36px', backgroundColor: '#4f46e5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                                <LayoutDashboard style={{ width: '20px', height: '20px' }} />
                            </div>
                            <span style={{ fontSize: '16px', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
                                EduCore
                            </span>
                        </Link>

                        {/* Navigation Links */}
                        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = route().current(item.route);

                                return (
                                    <Link
                                        key={item.route}
                                        href={route(item.route)}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            whiteSpace: 'nowrap',
                                            backgroundColor: isActive ? '#eef2ff' : 'transparent',
                                            color: isActive ? '#4f46e5' : '#4b5563',
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        <Icon style={{ width: '16px', height: '16px', color: isActive ? '#4f46e5' : '#6b7280' }} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* User Profile Menu */}
                    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '6px 12px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        backgroundColor: '#ffffff',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: '#374151',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <span>{user?.name ?? 'Account'}</span>
                                    <svg
                                        style={{ width: '14px', height: '14px', color: '#9ca3af' }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>

                </div>
            </nav>

            {/* Optional Context Header */}
            {header && (
                <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px' }}>
                        {header}
                    </div>
                </header>
            )}

            {/* Page Body */}
            <main style={{ flex: 1 }}>{children}</main>
        </div>
    );
}