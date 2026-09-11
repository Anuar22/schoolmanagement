<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AcademicDashboardController extends Controller
{
    public function index()
    {
        $term = DB::table('terms')->where('is_active', true)->first();

        // 1. Executive Top Metrics
        $totalStudents = DB::table('students')->where('is_active', true)->count();
        $totalClasses = DB::table('classes')->count();
        $totalSubjects = DB::table('subjects')->count();

        $averageScore = DB::table('grades')
            ->avg('score');
        $averageScore = $averageScore ? round($averageScore, 1) : 0;

        // 2. Early Warning Radar: Students with rolling average < 40%
        $atRiskStudents = DB::table('students')
            ->join('grades', 'students.id', '=', 'grades.student_id')
            ->join('classes', 'students.class_id', '=', 'classes.id')
            ->select(
                'students.id',
                'students.first_name',
                'students.last_name',
                'classes.name as class_name',
                'classes.stream',
                DB::raw('ROUND(AVG(grades.score), 1) as avg_score')
            )
            ->groupBy('students.id', 'students.first_name', 'students.last_name', 'classes.name', 'classes.stream')
            ->havingRaw('AVG(grades.score) < 40')
            ->limit(5)
            ->get();

        // 3. Departmental Performance Breakdown
        $departmentPerformance = DB::table('subjects')
            ->leftJoin('assessments', 'subjects.id', '=', 'assessments.subject_id')
            ->leftJoin('grades', 'assessments.id', '=', 'grades.assessment_id')
            ->select(
                'subjects.department',
                DB::raw('COALESCE(ROUND(AVG(grades.score), 1), 0) as avg_score')
            )
            ->groupBy('subjects.department')
            ->get();

        // 4. Submission Health: Assessments created vs total expected
        $pendingSubmissions = DB::table('classes')
            ->crossJoin('subjects')
            ->leftJoin('assessments', function ($join) use ($term) {
                $join->on('classes.id', '=', 'assessments.class_id')
                     ->on('subjects.id', '=', 'assessments.subject_id')
                     ->where('assessments.term_id', '=', $term?->id);
            })
            ->whereNull('assessments.id')
            ->count();

        return Inertia::render('Academic/AcademicDashboard', [
            'term' => $term,
            'metrics' => [
                'total_students' => $totalStudents,
                'total_classes' => $totalClasses,
                'total_subjects' => $totalSubjects,
                'school_gpa' => $averageScore,
                'pending_submissions' => $pendingSubmissions,
            ],
            'atRiskStudents' => $atRiskStudents,
            'departmentPerformance' => $departmentPerformance,
        ]);
    }
}