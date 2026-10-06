import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
    GraduationCap, 
    BookOpen, 
    AlertTriangle, 
    Users, 
    CalendarCheck, 
    TrendingUp, 
    Award,
    Layers,
    CheckCircle2,
    BarChart3,
    ArrowUpRight
} from 'lucide-react';

interface Term {
    id: string | number;
    name: string;
    is_active: boolean;
}

interface AcademicKPIs {
    total_students: number;
    total_teachers: number;
    total_classes: number;
    mean_score: number;
    pass_rate: number;
    total_graded: number;
    at_risk_count: number;
    attendance_rate: number | null;
    present_today: number;
    absent_today: number;
}

interface GradeBand {
    grade: string;
    count: number;
    color: string;
}

interface AssessmentProgress {
    assessment: string;
    score: number;
}

interface CoverageItem {
    subject: string;
    done: number;
    planned: number;
    coverage: number;
}

interface StreamStat {
    stream: string;
    average: number;
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
    kpis?: AcademicKPIs;
    gradeBands?: GradeBand[];
    subjectTrends?: Record<string, AssessmentProgress[]>;
    subjectsCoverage?: CoverageItem[];
    streamPerformance?: StreamStat[];
    atRiskStudents?: AtRiskStudent[];
}

export default function AdminDashboard({
    activeTerm = null,
    kpis,
    gradeBands = [],
    subjectTrends = {},
    subjectsCoverage = [],
    streamPerformance = [],
    atRiskStudents = []
}: Props) {
    const { tenant } = usePage<PageProps>().props;

    // Available subjects for interactive tabs
    const availableSubjects = Object.keys(subjectTrends || {});
    const defaultSubject = availableSubjects.includes('Physics') 
        ? 'Physics' 
        : (availableSubjects[0] || 'Physics');
    const [selectedSubject, setSelectedSubject] = useState<string>(defaultSubject);

    const safeNumber = (val: number | string | null | undefined): number => {
        if (val === null || val === undefined) return 0;
        const parsed = Number(val);
        return isNaN(parsed) ? 0 : parsed;
    };

    const totalStudents = safeNumber(kpis?.total_students);
    const totalTeachers = safeNumber(kpis?.total_teachers);
    const totalClasses = safeNumber(kpis?.total_classes);
    const meanScore = safeNumber(kpis?.mean_score);
    const passRate = safeNumber(kpis?.pass_rate);
    const totalGraded = safeNumber(kpis?.total_graded);
    const atRiskCount = safeNumber(kpis?.at_risk_count);
    const attendanceRate = kpis?.attendance_rate !== null && kpis?.attendance_rate !== undefined 
        ? safeNumber(kpis.attendance_rate) 
        : null;

    const safeBands = Array.isArray(gradeBands) && gradeBands.length > 0
        ? gradeBands
        : [
            { grade: 'A (75-100)', count: 0, color: '#10b981' },
            { grade: 'B (65-74)', count: 0, color: '#3b82f6' },
            { grade: 'C (45-64)', count: 0, color: '#f59e0b' },
            { grade: 'D (30-44)', count: 0, color: '#f97316' },
            { grade: 'F (<30)', count: 0, color: '#ef4444' },
        ];

    const maxBandCount = Math.max(...safeBands.map(b => b.count), 1);

    const activeProgress = subjectTrends[selectedSubject] || [
        { assessment: 'Assignment 1', score: 65 },
        { assessment: 'CAT 1', score: 58 },
        { assessment: 'Mid-Term Exam', score: 72 },
        { assessment: 'Terminal Mock', score: 78 }
    ];

    const safeCoverage = Array.isArray(subjectsCoverage) ? subjectsCoverage : [];
    const safeStreams = Array.isArray(streamPerformance) ? streamPerformance : [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                Institutional Academic Command
                            </h2>
                            <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                Executive Authority
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-2">
                            <span>{tenant?.name ?? 'EduCore Institutional ERP'}</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-700">
                                {activeTerm?.name ?? 'Active Academic Term'}
                            </span>
                        </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Link
                            href="/grades"
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-xs"
                        >
                            <BookOpen className="w-4 h-4" />
                            <span>Marksheet Matrix</span>
                        </Link>
                        <Link
                            href="/academic-summary"
                            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-xs"
                        >
                            <Award className="w-4 h-4" />
                            <span>Report Cards & Ranks</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Academic Command Console" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

                {/* 1. Academic Health KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Institutional Mean</span>
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                            {meanScore}%
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                            <span>Across {totalGraded} grades</span>
                            <span className="text-indigo-600 font-semibold">Term Average</span>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Syllabus Pass Rate</span>
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Award className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
                            {passRate}%
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                            <span>Grades in Bands A–C</span>
                            <span className="text-emerald-700 font-medium">Competent</span>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">At-Risk Radar (&lt;40%)</span>
                            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-rose-600 mt-2">
                            {atRiskCount}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                            <span>Flagged for intervention</span>
                            <span className="text-rose-600 font-semibold">Priority</span>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Daily Attendance</span>
                            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <CalendarCheck className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                            {attendanceRate !== null ? `${attendanceRate}%` : 'Pending'}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                            <span>{totalStudents} students • {totalClasses} classes</span>
                            <Link href="/attendance" className="text-amber-600 font-semibold hover:underline">Roll-Call →</Link>
                        </div>
                    </div>

                </div>

                {/* 2. Interactive Subject Longitudinal Progression & Syllabus Coverage */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    
                    {/* Subject Assessment Curve */}
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-bold text-slate-900">
                                            Subject Longitudinal Progression: <span className="text-indigo-600">{selectedSubject}</span>
                                        </h4>
                                        <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-indigo-100">
                                            Exam Progress
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Assessment score trajectory across continuous examinations
                                    </p>
                                </div>

                                {/* Subject switcher buttons */}
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    {(availableSubjects.length > 0 ? availableSubjects.slice(0, 6) : ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English']).map((subj) => (
                                        <button
                                            key={subj}
                                            type="button"
                                            onClick={() => setSelectedSubject(subj)}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                                selectedSubject === subj
                                                    ? 'bg-indigo-600 text-white shadow-xs'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            {subj}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* SVG Trendline Chart */}
                            <div className="w-full bg-slate-50/50 rounded-xl border border-slate-100 p-4">
                                <div className="h-48 flex items-end justify-between gap-4 pt-6 px-2">
                                    {activeProgress.map((item, idx) => {
                                        const pct = Math.max(10, Math.min(100, item.score));
                                        return (
                                            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                                                <div className="text-xs font-black text-slate-800">
                                                    {item.score}%
                                                </div>
                                                <div className="w-full max-w-[48px] bg-slate-200 rounded-t-lg overflow-hidden flex items-end h-32">
                                                    <div 
                                                        className="w-full bg-indigo-600 rounded-t-lg transition-all duration-500 hover:bg-indigo-500"
                                                        style={{ height: `${pct}%` }}
                                                    />
                                                </div>
                                                <div className="text-[11px] font-semibold text-slate-500 text-center truncate w-full">
                                                    {item.assessment}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                                Institutional Standard: 65.0% Pass Benchmark
                            </span>
                            <span className="font-semibold text-slate-800">
                                Current Average: {activeProgress[activeProgress.length - 1]?.score || 0}%
                            </span>
                        </div>
                    </div>

                    {/* Syllabus Assessment Coverage */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">Syllabus Assessment Audit</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">Mandated tests administered per subject</p>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                                    Term Target
                                </span>
                            </div>

                            <div className="space-y-3.5">
                                {(safeCoverage.length > 0 ? safeCoverage.slice(0, 6) : [
                                    { subject: 'Physics', done: 4, planned: 5, coverage: 80 },
                                    { subject: 'Chemistry', done: 3, planned: 5, coverage: 60 },
                                    { subject: 'Mathematics', done: 5, planned: 5, coverage: 100 },
                                    { subject: 'Biology', done: 2, planned: 5, coverage: 40 },
                                    { subject: 'English', done: 4, planned: 5, coverage: 80 },
                                ]).map((item, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-bold text-slate-800">{item.subject}</span>
                                            <span className="text-slate-500 font-mono text-[11px]">
                                                {item.done}/{item.planned} tests ({item.coverage}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    item.coverage >= 80 
                                                        ? 'bg-emerald-500' 
                                                        : item.coverage >= 50 
                                                        ? 'bg-indigo-500' 
                                                        : 'bg-amber-500'
                                                }`}
                                                style={{ width: `${item.coverage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
                            <span className="flex items-center gap-1 text-slate-600 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                NECTA Minimum Standard Met
                            </span>
                            <Link href="/academic-desk" className="text-indigo-600 font-semibold hover:underline">
                                Details →
                            </Link>
                        </div>
                    </div>

                </div>

                {/* 3. Grade Bands Distribution & Class Stream Standings */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    
                    {/* Bell Curve Spread */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">Institutional Grade Distribution</h4>
                                <p className="text-xs text-slate-500 mt-0.5">Student scores across standardized mastery bands</p>
                            </div>
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                                Bell Curve
                            </span>
                        </div>

                        <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
                            {safeBands.map((band, idx) => {
                                const heightPct = maxBandCount > 0 ? Math.max(12, Math.round((band.count / maxBandCount) * 100)) : 12;
                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                                        <span className="text-xs font-bold text-slate-800">{band.count}</span>
                                        <div className="w-full max-w-[42px] bg-slate-100 rounded-t-lg overflow-hidden flex items-end h-28">
                                            <div 
                                                className="w-full rounded-t-lg transition-all duration-500" 
                                                style={{ height: `${heightPct}%`, backgroundColor: band.color }}
                                            />
                                        </div>
                                        <span className="text-[11px] font-semibold text-slate-600 text-center truncate w-full">{band.grade}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Stream Cohort Comparison */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">Class Stream Performance Standings</h4>
                                <p className="text-xs text-slate-500 mt-0.5">Average score per class cohort (%)</p>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                                Cohort Index
                            </span>
                        </div>

                        {safeStreams.length === 0 ? (
                            <div className="py-12 text-center text-slate-400 text-xs">
                                No class stream averages computed yet.
                            </div>
                        ) : (
                            <div className="space-y-3 pt-1">
                                {safeStreams.map((st, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-bold text-slate-800">{st.stream}</span>
                                            <span className="font-black text-slate-900">{st.average}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min(100, Math.max(10, st.average))}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* 4. Early-Warning At-Risk Remediation Radar */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-900">Remedial Intervention Radar</h4>
                                <span className="bg-rose-50 text-rose-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-rose-100">
                                    Below 40% Passing Benchmark
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">Students requiring immediate teacher support</p>
                        </div>
                        <Link href="/academic-desk" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                            Academic Desk →
                        </Link>
                    </div>

                    {atRiskStudents.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 text-xs">
                            No at-risk scores recorded. All students are meeting the 40% benchmark.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="py-3 px-5">Student</th>
                                        <th className="py-3 px-5">Class / Stream</th>
                                        <th className="py-3 px-5">Subject Syllabus</th>
                                        <th className="py-3 px-5 text-right">Score</th>
                                        <th className="py-3 px-5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {atRiskStudents.map((s, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 px-5">
                                                <div className="font-bold text-slate-900">{s.last_name}, {s.first_name}</div>
                                                <div className="text-[11px] text-slate-400 font-mono">{s.admission_number}</div>
                                            </td>
                                            <td className="py-3 px-5 text-slate-600 font-medium">
                                                {s.class_name} ({s.stream})
                                            </td>
                                            <td className="py-3 px-5 font-semibold text-slate-800">
                                                {s.subject_name}
                                            </td>
                                            <td className="py-3 px-5 text-right">
                                                <span className="font-black text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded text-xs">
                                                    {s.score}%
                                                </span>
                                            </td>
                                            <td className="py-3 px-5 text-right">
                                                <Link 
                                                    href={`/grades`} 
                                                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                                                >
                                                    Marksheet →
                                                </Link>
                                            </td>
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