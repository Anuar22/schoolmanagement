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
        // Fetch active term and default assessment (Form 1 Stream A - Math)
        $term = DB::table('terms')->where('is_active', true)->first();
        $assessment = DB::table('assessments')
            ->join('classes', 'assessments.class_id', '=', 'classes.id')
            ->join('subjects', 'assessments.subject_id', '=', 'subjects.id')
            ->join('assessment_types', 'assessments.assessment_type_id', '=', 'assessment_types.id')
            ->select(
                'assessments.id',
                'classes.name as class_name',
                'classes.stream',
                'subjects.name as subject_name',
                'assessment_types.name as assessment_name',
                'assessment_types.max_score'
            )
            ->first();

        if (!$assessment) {
            return Inertia::render('Academic/GradeEntry', ['assessment' => null, 'students' => []]);
        }

        // Fetch students and existing grade scores
        $students = DB::table('students')
            ->leftJoin('grades', function ($join) use ($assessment) {
                $join->on('students.id', '=', 'grades.student_id')
                     ->where('grades.assessment_id', '=', $assessment->id);
            })
            ->where('students.is_active', true)
            ->select(
                'students.id as student_id',
                'students.admission_number',
                'students.first_name',
                'students.last_name',
                'grades.id as grade_id',
                'grades.score',
                'grades.remarks'
            )
            ->orderBy('students.last_name')
            ->get();

        return Inertia::render('Academic/GradeEntry', [
            'term' => $term,
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