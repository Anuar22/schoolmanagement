import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ShieldCheck, School, BookOpen, UserCheck, KeyRound, AlertTriangle } from 'lucide-react';

interface Allocation {
    class_name: string;
    stream: string;
    subject_name: string;
    subject_code: string;
}

interface InstitutionData {
    name: string;
    tenant_id: string | null;
    role: string;
    allocations: Allocation[];
}

interface Props extends PageProps {
    mustVerifyEmail: boolean;
    status?: string;
    institution: InstitutionData;
}

export default function Edit({ mustVerifyEmail, status, institution, auth }: Props) {
    const user = auth.user;
    const isTeacher = (user?.role || '').toLowerCase() === 'teacher';
    const isAdmin = ['admin', 'super_admin'].includes((user?.role || '').toLowerCase());

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                Staff Identity & Access Credentials
                            </h2>
                            <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                isAdmin
                                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                                    : 'bg-purple-50 border border-purple-200 text-purple-700'
                            }`}>
                                {institution.role}
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Manage your authenticated institutional credentials and security settings.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Staff Profile" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* 1. Institutional Governance Card (Read-Only Organization Context) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                            <School className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Institutional Affiliation</h3>
                            <p className="text-xs text-slate-500">Multi-tenant boundary assigned by the system administration</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Institution / School</span>
                            <div className="text-sm font-bold text-slate-800 mt-1">{institution.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-1 truncate">ID: {institution.tenant_id ?? 'Default'}</div>
                        </div>

                        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assigned Role Authority</span>
                            <div className="flex items-center gap-2 mt-1">
                                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                                <span className="text-sm font-bold text-slate-900">{institution.role}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1">
                                {isAdmin ? 'Full administrative governance access' : 'Classroom instructional & grading access'}
                            </div>
                        </div>

                        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Account State</span>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                <span className="text-sm font-bold text-emerald-700">Active & Verified</span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1">Continuous Assessment Audits Active</div>
                        </div>
                    </div>

                    {/* Teacher Workload Assignments Display (if teacher) */}
                    {isTeacher && (
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <div className="flex items-center gap-2 mb-3">
                                <BookOpen className="w-4 h-4 text-purple-600" />
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    Current Teaching Allocations ({institution.allocations.length})
                                </h4>
                            </div>
                            {institution.allocations.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">No course allocations assigned yet.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {institution.allocations.map((alloc, idx) => (
                                        <div key={idx} className="bg-white border border-purple-100 rounded-lg p-3 text-xs">
                                            <div className="font-bold text-slate-900">{alloc.class_name} ({alloc.stream})</div>
                                            <div className="text-purple-600 font-medium mt-0.5">{alloc.subject_name} • {alloc.subject_code}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 2. Personal Profile Information Form */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
                            <p className="text-xs text-slate-500">Update your staff name and registered official email address</p>
                        </div>
                    </div>

                    <div className="max-w-xl">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>
                </div>

                {/* 3. Password Security Form */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <KeyRound className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Update Password</h3>
                            <p className="text-xs text-slate-500">Ensure your account uses a long, random password to remain secure</p>
                        </div>
                    </div>

                    <div className="max-w-xl">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>
                </div>

                {/* 4. Danger Zone (Account Deactivation) */}
                <div className="bg-white border border-rose-200/80 rounded-2xl p-6 shadow-xs">
                    <div className="flex items-center gap-3 border-b border-rose-100 pb-4 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-rose-900">Deactivate Account</h3>
                            <p className="text-xs text-slate-500">Permanently remove your account and authorization credentials</p>
                        </div>
                    </div>

                    <div className="max-w-xl">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}