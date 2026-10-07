import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
    BookOpen, 
    CalendarCheck, 
    Users, 
    TrendingUp, 
    AlertTriangle, 
    ArrowRight, 
    CheckCircle2, 
    ClipboardList,
    Clock
} from 'lucide-react';

interface WorkloadItem {
    class_id: string | number;
    class_name: string;
    stream: string;
    subject_id: string | number;
    subject_name: string;
}

interface Term {
    id: string | number;
    name: string;
}

interface AtRiskStudent {
    first_name: string;
    last_name: string;
    admission_number: string;
    class_name: string;
    stream: string;
    subject_name: string;
    score: number;
}

interface Props {
    activeTerm?: Term | null;
    metrics?: {
        total_allocations: number;
        total_students: number;
        class_mean: number;
        at_risk_count: number;
        attendance_submitted: boolean;
    };
    workload?: WorkloadItem[];
    atRiskStudents?: AtRiskStudent[];
}

export default function TeacherDashboard({
    activeTerm = null,
    metrics = {
        total_allocations: 0,
        total_students: 0,
        class_mean: 0,
        at_risk_count: 0,
        attendance_submitted: false,
    },
    workload = [],
    atRiskStudents = [],
}: Props) {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user;
    const items = Array.isArray(workload) ? workload : [];
    const atRisks = Array.isArray(atRiskStudents) ? atRiskStudents : [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                Faculty Instructional Desk
                            </h2>
                            <span className="bg-purple-50 border border-purple-200 text-purple-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                Faculty Portal
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Instructor: <strong className="text-slate-800">{user?.name}</strong> • Active Term: {activeTerm?.name ?? 'Term 1'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/grades"
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-xs"
                        >
                            <ClipboardList className="w-4 h-4" />
                            <span>Marksheet Matrix</span>
                        </Link>
                        <Link
                            href="/attendance"
                            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-xs"
                        >
                            <CalendarCheck className="w-4 h-4" />
                            <span>Roll-Call</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Faculty Instructional Desk" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

                {/* 1. Instructional Focus KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Assigned Courses */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Allocated Streams</span>
                            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                <BookOpen className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                            {metrics.total_allocations}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            Teaching workload assignments
                        </div>
                    </div>

                    {/* Students Under Care */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Students Under Care</span>
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                            {metrics.total_students}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            Across your class allocations
                        </div>
                    </div>

                    {/* Class Subject Mean */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Your Course Mean</span>
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
                            {metrics.class_mean}%
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            Average assessment mastery
                        </div>
                    </div>

                    {/* Roll-Call State */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Today's Roll-Call</span>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                metrics.attendance_submitted ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                                <CalendarCheck className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                            {metrics.attendance_submitted ? 'Complete' : 'Pending'}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            {metrics.attendance_submitted ? 'Recorded for today' : 'Awaiting classroom check'}
                        </div>
                    </div>

                </div>

                {/* 2. Assigned Streams List */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Your Assigned Teaching Allocations</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Classes and subjects under your direct grading responsibility</p>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">
                            {items.length} Active Courses
                        </span>
                    </div>

                    {items.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 text-xs">
                            No teaching allocations assigned yet. Please contact the Head of Studies or Administrator.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="py-3 px-5">Class / Stream</th>
                                        <th className="py-3 px-5">Subject Syllabus</th>
                                        <th className="py-3 px-5 text-right">Direct Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {items.map((alloc, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3.5 px-5 font-bold text-slate-900">
                                                {alloc.class_name} ({alloc.stream})
                                            </td>
                                            <td className="py-3.5 px-5 font-semibold text-indigo-600">
                                                {alloc.subject_name}
                                            </td>
                                            <td className="py-3.5 px-5 text-right space-x-2">
                                                <Link
                                                    href={`/grades?class_id=${alloc.class_id}&subject_id=${alloc.subject_id}`}
                                                    className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-md"
                                                >
                                                    Enter Marks <ArrowRight className="w-3 h-3" />
                                                </Link>
                                                <Link
                                                    href={`/attendance?class_id=${alloc.class_id}`}
                                                    className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md"
                                                >
                                                    Roll Call
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* 3. Students Flagged for Intervention in Teacher's Subjects */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-900">Remedial Focus Students</h4>
                                <span className="bg-rose-50 text-rose-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-rose-100">
                                    Below 40%
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">Students in your courses needing instructional support</p>
                        </div>
                    </div>

                    {atRisks.length === 0 ? (
                        <div className="py-10 text-center text-slate-400 text-xs">
                            No at-risk students recorded in your courses. All students are meeting the 40% benchmark.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="py-3 px-5">Student</th>
                                        <th className="py-3 px-5">Class</th>
                                        <th className="py-3 px-5">Subject</th>
                                        <th className="py-3 px-5 text-right">Latest Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {atRisks.map((s, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50">
                                            <td className="py-3 px-5 font-bold text-slate-900">
                                                {s.last_name}, {s.first_name}
                                                <div className="text-[10px] text-slate-400 font-mono font-normal">{s.admission_number}</div>
                                            </td>
                                            <td className="py-3 px-5 text-slate-600">{s.class_name} ({s.stream})</td>
                                            <td className="py-3 px-5 font-semibold text-slate-800">{s.subject_name}</td>
                                            <td className="py-3 px-5 text-right font-black text-rose-600">{s.score}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}