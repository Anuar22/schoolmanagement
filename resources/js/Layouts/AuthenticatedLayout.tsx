import { PropsWithChildren, ReactNode } from 'react';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, ClipboardList, Award, CalendarCheck, DollarSign, Users2 } from 'lucide-react';
import { ShieldAlert } from 'lucide-react'; // import icon

interface User {
    id: number;
    name: string;
    email: string;
    role?: 'admin' | 'teacher' | 'bursar' | 'super_admin' | string;
}

interface NavItem {
    name: string;
    route: string;
    icon: typeof LayoutDashboard;
    roles: string[];
}

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth?.user;
    const userRole = user?.role ?? 'teacher';

    const allNavItems: NavItem[] = [
        { 
            name: 'Command Desk', 
            route: 'academic.desk', 
            icon: LayoutDashboard, 
            roles: ['admin', 'super_admin', 'teacher'] 
        },
        { 
            name: 'Marksheet Grid', 
            route: 'grades.index', 
            icon: ClipboardList, 
            roles: ['admin', 'super_admin', 'teacher'] 
        },
        { 
            name: 'Class Standings', 
            route: 'academic.summary', 
            icon: Award, 
            roles: ['admin', 'super_admin', 'teacher'] 
        },
        { 
            name: 'Attendance', 
            route: 'attendance.index', 
            icon: CalendarCheck, 
            roles: ['admin', 'super_admin', 'teacher'] 
        },
        { 
            name: 'Fees Ledger', 
            route: 'fees.index', 
            icon: DollarSign, 
            roles: ['admin', 'super_admin', 'bursar'] 
        },
        { 
            name: 'Staff & Students', 
            route: 'roster.index', 
            icon: Users2, 
            roles: ['admin', 'super_admin'] 
        },
        { 
            name: 'Audit Trail', 
            route: 'audit.index', 
            icon: ShieldAlert, 
            roles: ['admin', 'super_admin'] 
        },
    ];

    // Filter links based on current user role
    const visibleNavItems = allNavItems.filter((item) => item.roles.includes(userRole));

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
            {/* Top Navigation Bar */}
            <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 40 }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
                    
                    {/* Brand & Main Links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', overflowX: 'auto' }}>
                        <Link
                            href={route('dashboard')}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}
                        >
                            <div style={{ width: '36px', height: '36px', backgroundColor: '#4f46e5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                                <LayoutDashboard style={{ width: '20px', height: '20px' }} />
                            </div>
                            <span style={{ fontSize: '16px', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
                                EduCore
                            </span>
                        </Link>

                        {/* Role-Filtered Navigation Links */}
                        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                            {visibleNavItems.map((item) => {
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

                    {/* User Profile & Role Indicator */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
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
                                    <span style={{
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        backgroundColor: userRole === 'admin' ? '#eef2ff' : userRole === 'bursar' ? '#ecfdf5' : '#f3f4f6',
                                        color: userRole === 'admin' ? '#4338ca' : userRole === 'bursar' ? '#047857' : '#4b5563',
                                        textTransform: 'uppercase'
                                    }}>
                                        {userRole}
                                    </span>
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
                                <Dropdown.Link href={route('dashboard')}>Dashboard</Dropdown.Link>
                                <Dropdown.Link href={route('profile.edit')}>Profile Settings</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>

                </div>
            </nav>

            {/* Context Header */}
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