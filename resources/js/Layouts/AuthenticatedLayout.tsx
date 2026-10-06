import { PropsWithChildren, ReactNode, useState } from 'react';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
    LayoutDashboard, 
    ClipboardList, 
    CalendarCheck, 
    DollarSign, 
    Users, 
    TrendingUp, 
    ShieldAlert, 
    Award,
    GraduationCap
} from 'lucide-react';

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const page = usePage<PageProps>();
    const props = page.props || {};
    const auth = props.auth || ({} as any);
    const tenant = props.tenant || null;
    const user = auth?.user || null;
    
    // Safe fallback so no undefined access can crash the component
    const userRole = (user?.role || 'teacher').toLowerCase();
    const userName = user?.name || 'Staff User';
    const userEmail = user?.email || '';

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const allNavItems = [
        {
            name: 'Dashboard',
            route: 'dashboard',
            icon: LayoutDashboard,
            roles: ['admin', 'super_admin', 'teacher', 'bursar'],
        },
        {
            name: 'Academic Desk',
            route: 'academic.desk',
            icon: TrendingUp,
            roles: ['admin', 'super_admin', 'teacher'],
        },
        {
            name: 'Marksheet Grid',
            route: 'grades.index',
            icon: ClipboardList,
            roles: ['admin', 'super_admin', 'teacher'],
        },
        {
            name: 'Attendance',
            route: 'attendance.index',
            icon: CalendarCheck,
            roles: ['admin', 'super_admin', 'teacher'],
        },
        {
            name: 'Fees Ledger',
            route: 'fees.index',
            icon: DollarSign,
            roles: ['admin', 'super_admin', 'bursar'],
        },
        {
            name: 'Staff & Students',
            route: 'roster.index',
            icon: Users,
            roles: ['admin', 'super_admin'],
        },
        {
            name: 'Report Cards',
            route: 'academic.summary',
            icon: Award,
            roles: ['admin', 'super_admin', 'teacher'],
        },
        {
            name: 'Audit Trail',
            route: 'audit.index',
            icon: ShieldAlert,
            roles: ['admin', 'super_admin'],
        },
    ];

    const authorizedNavItems = allNavItems.filter((item) => item.roles.includes(userRole));

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="border-b border-slate-200 bg-white shadow-xs">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            {/* Brand / Tenant Title */}
                            <div className="flex shrink-0 items-center">
                                <Link href={route('dashboard')} className="flex items-center gap-2 text-indigo-600 font-extrabold text-lg">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                                        <GraduationCap className="h-5 w-5" />
                                    </div>
                                    <div className="hidden sm:block">
                                        <span className="text-slate-900 font-bold tracking-tight">
                                            {tenant?.name ?? 'EduCore'}
                                        </span>
                                    </div>
                                </Link>
                            </div>

                            {/* Desktop Navigation */}
                            <div className="hidden space-x-6 sm:-my-px sm:ms-8 sm:flex">
                                {authorizedNavItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <NavLink
                                            key={item.route}
                                            href={route(item.route)}
                                            active={route().current(item.route)}
                                        >
                                            <span className="flex items-center gap-1.5 py-1">
                                                <Icon className="h-4 w-4" />
                                                <span>{item.name}</span>
                                            </span>
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>

                        {/* User Profile / Status Dropdown */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none"
                                            >
                                                <span>{userName}</span>
                                                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                                    userRole === 'admin' || userRole === 'super_admin'
                                                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                                                        : userRole === 'bursar'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                                                }`}>
                                                    {userRole}
                                                </span>
                                                <svg
                                                    className="-me-0.5 ms-1 h-4 w-4"
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
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <div className="px-4 py-2 text-xs text-slate-400 border-b border-slate-100">
                                            {userEmail}
                                        </div>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile Settings
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile Hamburger */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        {authorizedNavItems.map((item) => (
                            <ResponsiveNavLink
                                key={item.route}
                                href={route(item.route)}
                                active={route().current(item.route)}
                            >
                                {item.name}
                            </ResponsiveNavLink>
                        ))}
                    </div>

                    <div className="border-t border-slate-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-slate-800">{userName}</div>
                            <div className="text-sm font-medium text-slate-500">{userEmail}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white border-b border-slate-200">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}