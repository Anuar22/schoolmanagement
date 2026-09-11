<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class GradeEntryController extends Controller
{
    public function index(Request $request)
    {
        // 1. Available Selector Options
        $terms = DB::table('terms')->orderByDesc('start_date')->get();
        $classes = DB::table('classes')->orderBy('level')->orderBy('stream')->get();
        $subjects = DB::table('subjects')->orderBy('name')->get();

        // 2. Resolve Active Selections from Query Params or Defaults
        $selectedTermId = $request->query('term_id', $terms->firstWhere('is_active', true)?->id ?? $terms->first()?->id);
        $selectedClassId = $request->query('class_id', $classes->first()?->id);
        $selectedSubjectId = $request->query('subject_id', $subjects->first()?->id);

        $selectedTerm = $terms->firstWhere('id', $selectedTermId);
        $selectedClass = $classes->firstWhere('id', $selectedClassId);
        $selectedSubject = $subjects->firstWhere('id', $selectedSubjectId);

        // 3. Find or Auto-Create the Midterm Assessment for this combination
        $assessment = null;
        if ($selectedTermId && $selectedClassId && $selectedSubjectId) {
            $defaultType = DB::table('assessment_types')->first();

            $assessmentRecord = DB::table('assessments')
                ->where('term_id', $selectedTermId)
                ->where('class_id', $selectedClassId)
                ->where('subject_id', $selectedSubjectId)
                ->first();

            if (!$assessmentRecord && $defaultType) {
                $newAssessmentId = (string) \Illuminate\Support\Str::uuid();
                DB::table('assessments')->insert([
                    'id' => $newAssessmentId,
                    'term_id' => $selectedTermId,
                    'class_id' => $selectedClassId,
                    'subject_id' => $selectedSubjectId,
                    'assessment_type_id' => $defaultType->id,
                    'date_administered' => now()->toDateString(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $assessmentRecord = DB::table('assessments')->where('id', $newAssessmentId)->first();
            }

            if ($assessmentRecord) {
                $assessment = DB::table('assessments')
                    ->join('classes', 'assessments.class_id', '=', 'classes.id')
                    ->join('subjects', 'assessments.subject_id', '=', 'subjects.id')
                    ->join('assessment_types', 'assessments.assessment_type_id', '=', 'assessment_types.id')
                    ->where('assessments.id', $assessmentRecord->id)
                    ->select(
                        'assessments.id',
                        'classes.name as class_name',
                        'classes.stream',
                        'subjects.name as subject_name',
                        'assessment_types.name as assessment_name',
                        'assessment_types.max_score'
                    )
                    ->first();
            }
        }

        // 4. Load Students for the chosen class with any existing marks
        $students = [];
        if ($selectedClassId && $assessment) {
            $students = DB::table('students')
                ->leftJoin('grades', function ($join) use ($assessment) {
                    $join->on('students.id', '=', 'grades.student_id')
                         ->where('grades.assessment_id', '=', $assessment->id);
                })
                ->where('students.class_id', $selectedClassId)
                ->where('students.is_active', true)
                ->select(
                    'students.id as student_id',
                    'students.admission_number',
                    'students.first_name',
                    'students.last_name',
                    'grades.score',
                    'grades.remarks'
                )
                ->orderBy('students.last_name')
                ->get();
        }

        return Inertia::render('Academic/GradeEntry', [
            'terms' => $terms,
            'classes' => $classes,
            'subjects' => $subjects,
            'filters' => [
                'term_id' => $selectedTermId,
                'class_id' => $selectedClassId,
                'subject_id' => $selectedSubjectId,
            ],
            'term' => $selectedTerm,
            'assessment' => $assessment,
            'students' => $students,
        ]);
    }

    public function upsert(Request $request)
    {
        $validated = $request->validate([
            'assessment_id' => 'required|uuid',
            'student_id' => 'required|uuid',
            'score' => 'required|numeric|min:0|max:100',
            'remarks' => 'nullable|string|max:255',
        ]);

        DB::table('grades')->updateOrInsert(
            [
                'assessment_id' => $validated['assessment_id'],
                'student_id' => $validated['student_id'],
            ],
            [
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'score' => $validated['score'],
                'remarks' => $validated['remarks'] ?? null,
                'entered_by' => auth()->id() ?? 1,
                'updated_at' => now(),
            ]
        );

        return response()->json(['status' => 'saved']);
    }
}