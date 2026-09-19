<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Services\AuditLogger;

class GradeEntryController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $tenantId = $user->tenant_id;

        // 1. Resolve Available Classes and Subjects based on Role
        if ($user->isAdmin()) {
            $classes = DB::table('classes')->where('tenant_id', $tenantId)->orderBy('level')->orderBy('stream')->get();
            $subjects = DB::table('subjects')->where('tenant_id', $tenantId)->orderBy('name')->get();
        } else {
            // Teacher: restrict strictly to teacher_allocations
            $allocations = DB::table('teacher_allocations')
                ->where('teacher_allocations.tenant_id', $tenantId)
                ->where('teacher_allocations.teacher_id', $user->id)
                ->get();

            $assignedClassIds = $allocations->pluck('class_id')->unique();
            $assignedSubjectIds = $allocations->pluck('subject_id')->unique();

            $classes = DB::table('classes')
                ->where('tenant_id', $tenantId)
                ->whereIn('id', $assignedClassIds)
                ->orderBy('level')
                ->orderBy('stream')
                ->get();

            $subjects = DB::table('subjects')
                ->where('tenant_id', $tenantId)
                ->whereIn('id', $assignedSubjectIds)
                ->orderBy('name')
                ->get();
        }

        $terms = DB::table('terms')->where('tenant_id', $tenantId)->orderByDesc('start_date')->get();

        // 2. Resolve Active Selections
        $selectedTermId = $request->query('term_id', $terms->firstWhere('is_active', true)?->id ?? $terms->first()?->id);
        $selectedClassId = $request->query('class_id', $classes->first()?->id);
        $selectedSubjectId = $request->query('subject_id', $subjects->first()?->id);

        $selectedTerm = $terms->firstWhere('id', $selectedTermId);
        $selectedClass = $classes->firstWhere('id', $selectedClassId);
        $selectedSubject = $subjects->firstWhere('id', $selectedSubjectId);

        // Security check: If teacher attempts to access an unauthorized class or subject via URL query params
        if (!$user->isAdmin()) {
            $isAuthorized = DB::table('teacher_allocations')
                ->where('tenant_id', $tenantId)
                ->where('teacher_id', $user->id)
                ->where('class_id', $selectedClassId)
                ->where('subject_id', $selectedSubjectId)
                ->exists();

            if (!$isAuthorized && $classes->isNotEmpty() && $subjects->isNotEmpty()) {
                // Redirect back to their first valid allocation
                $firstAlloc = DB::table('teacher_allocations')
                    ->where('tenant_id', $tenantId)
                    ->where('teacher_id', $user->id)
                    ->first();

                if ($firstAlloc) {
                    return redirect()->route('grades.index', [
                        'term_id' => $selectedTermId,
                        'class_id' => $firstAlloc->class_id,
                        'subject_id' => $firstAlloc->subject_id,
                    ]);
                }
            }
        }

        // 3. Find or Auto-Create the Midterm Assessment for this combination
        $assessment = null;
        if ($selectedTermId && $selectedClassId && $selectedSubjectId) {
            $defaultType = DB::table('assessment_types')->where('tenant_id', $tenantId)->first();

            $assessmentRecord = DB::table('assessments')
                ->where('tenant_id', $tenantId)
                ->where('term_id', $selectedTermId)
                ->where('class_id', $selectedClassId)
                ->where('subject_id', $selectedSubjectId)
                ->first();

            if (!$assessmentRecord && $defaultType) {
                $newAssessmentId = (string) \Illuminate\Support\Str::uuid();
                DB::table('assessments')->insert([
                    'id' => $newAssessmentId,
                    'tenant_id' => $tenantId,
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
                ->where('students.tenant_id', $tenantId)
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
            'isRestricted' => !$user->isAdmin(),
        ]);
    }

    public function upsert(Request $request)
    {
        $user = $request->user();
        $tenantId = $user->tenant_id;

        $validated = $request->validate([
            'assessment_id' => 'required|uuid',
            'student_id' => 'required|uuid',
            'score' => 'required|numeric|min:0|max:100',
            'remarks' => 'nullable|string|max:255',
        ]);

        $assessment = DB::table('assessments')
            ->where('tenant_id', $tenantId)
            ->where('id', $validated['assessment_id'])
            ->first();

        if (!$assessment) {
            return response()->json(['error' => 'Assessment not found'], 404);
        }

        // Workload authorization check
        if (!$user->isAdmin()) {
            $isAuthorized = DB::table('teacher_allocations')
                ->where('tenant_id', $tenantId)
                ->where('teacher_id', $user->id)
                ->where('class_id', $assessment->class_id)
                ->where('subject_id', $assessment->subject_id)
                ->exists();

            if (!$isAuthorized) {
                return response()->json(['error' => 'Unauthorized workload.'], 403);
            }
        }

        // Fetch existing grade to track before/after delta
        $existingGrade = DB::table('grades')
            ->where('assessment_id', $validated['assessment_id'])
            ->where('student_id', $validated['student_id'])
            ->first();

        $gradeId = $existingGrade?->id ?? (string) \Illuminate\Support\Str::uuid();
        $newScore = $validated['score'];

        DB::table('grades')->updateOrInsert(
            [
                'assessment_id' => $validated['assessment_id'],
                'student_id' => $validated['student_id'],
            ],
            [
                'id' => $gradeId,
                'tenant_id' => $tenantId,
                'score' => $newScore,
                'remarks' => $validated['remarks'] ?? null,
                'entered_by' => $user->id,
                'updated_at' => now(),
            ]
        );

        // Record Audit Trail if value changed or newly created
        if (!$existingGrade || (float)$existingGrade->score !== (float)$newScore) {
            AuditLogger::record(
                action: $existingGrade ? 'GRADE_MODIFIED' : 'GRADE_ENTERED',
                entityType: 'Grade',
                entityId: $gradeId,
                oldValues: $existingGrade ? ['score' => $existingGrade->score] : null,
                newValues: ['score' => $newScore]
            );
        }

        return response()->json(['status' => 'saved']);
    }
}