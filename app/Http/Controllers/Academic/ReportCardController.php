<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use App\Services\AcademicCalculationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportCardController extends Controller
{
    public function index(AcademicCalculationService $calculationService)
    {
        $term = DB::table('terms')->where('is_active', true)->first();
        $class = DB::table('classes')->first();

        if (!$term || !$class) {
            return Inertia::render('Academic/ReportSummary', ['summary' => []]);
        }

        $summary = $calculationService->calculateClassSummary($class->id, $term->id);

        // Attach fee clearance status to each student record
        $studentIds = collect($summary)->pluck('student_id');
        $invoices = DB::table('fee_invoices')
            ->where('term_id', $term->id)
            ->whereIn('student_id', $studentIds)
            ->select('student_id', 'total_amount', 'paid_amount', 'status')
            ->get()
            ->keyBy('student_id');

        foreach ($summary as &$row) {
            $inv = $invoices->get($row['student_id']);
            $row['fee_status'] = $inv ? $inv->status : 'NO_INVOICE';
            $row['outstanding_balance'] = $inv ? (float)($inv->total_amount - $inv->paid_amount) : 0.00;
            $row['is_cleared'] = $inv ? ($inv->status === 'PAID') : true;
        }

        return Inertia::render('Academic/ReportSummary', [
            'term' => $term,
            'currentClass' => $class,
            'summary' => $summary,
        ]);
    }

    public function downloadPdf(string $studentId, AcademicCalculationService $calculationService)
    {
        $term = DB::table('terms')->where('is_active', true)->first();
        $student = DB::table('students')
            ->join('classes', 'students.class_id', '=', 'classes.id')
            ->where('students.id', $studentId)
            ->select('students.*', 'classes.name as class_name', 'classes.stream', 'classes.id as class_id')
            ->first();

        if (!$student || !$term) {
            abort(404, 'Student or Active Term not found');
        }

        // Financial Clearance Check
        $invoice = DB::table('fee_invoices')
            ->where('term_id', $term->id)
            ->where('student_id', $studentId)
            ->first();

        $isCleared = !$invoice || ($invoice->paid_amount >= $invoice->total_amount);

        // Fetch student's subject breakdown
        $subjects = DB::table('subjects')->get();
        $grades = DB::table('grades')
            ->join('assessments', 'grades.assessment_id', '=', 'assessments.id')
            ->join('assessment_types', 'assessments.assessment_type_id', '=', 'assessment_types.id')
            ->where('grades.student_id', $studentId)
            ->where('assessments.term_id', $term->id)
            ->select('assessments.subject_id', 'grades.score', 'assessment_types.name as assessment_name', 'assessment_types.weight')
            ->get();

        $subjectRows = [];
        $totalScore = 0;
        $count = 0;

        foreach ($subjects as $subject) {
            $subjGrades = $grades->where('subject_id', $subject->id);
            if ($subjGrades->isEmpty()) continue;

            $weighted = 0;
            foreach ($subjGrades as $g) {
                $weighted += ($g->score * ($g->weight / 100));
            }

            $subjectRows[] = [
                'name' => $subject->name,
                'code' => $subject->code,
                'score' => round($weighted, 1),
                'grade' => $calculationService->resolveGradeLetter($weighted),
                'remarks' => match (true) {
                    $weighted >= 75 => 'Excellent comprehension',
                    $weighted >= 65 => 'Good progress',
                    $weighted >= 50 => 'Satisfactory',
                    $weighted >= 35 => 'Needs remedial support',
                    default => 'Critical attention required',
                }
            ];
            $totalScore += $weighted;
            $count++;
        }

        $overallAverage = $count > 0 ? round($totalScore / $count, 1) : 0;

        $classSummary = $calculationService->calculateClassSummary($student->class_id, $term->id);
        $studentRank = collect($classSummary)->firstWhere('student_id', $studentId)['rank'] ?? 'N/A';
        $totalStudents = count($classSummary);

        $pdf = Pdf::loadView('reports.terminal_report', [
            'student' => $student,
            'term' => $term,
            'subjects' => $subjectRows,
            'average' => $overallAverage,
            'rank' => $studentRank,
            'totalStudents' => $totalStudents,
            'overallGrade' => $calculationService->resolveGradeLetter($overallAverage),
            'isCleared' => $isCleared,
            'outstandingBalance' => $invoice ? ($invoice->total_amount - $invoice->paid_amount) : 0,
        ]);

        return $pdf->stream("ReportCard_{$student->admission_number}.pdf");
    }
}