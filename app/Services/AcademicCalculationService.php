<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class AcademicCalculationService
{
    /**
     * Compute cumulative term scores, letter grades, and ranks for a class.
     */
    public function calculateClassSummary(string $classId, string $termId)
    {
        // 1. Fetch all students in the class
        $students = DB::table('students')
            ->where('class_id', $classId)
            ->where('is_active', true)
            ->select('id', 'admission_number', 'first_name', 'last_name')
            ->get();

        // 2. Fetch all subjects
        $subjects = DB::table('subjects')->get();

        // 3. Fetch all grades for this term and class with assessment weights
        $records = DB::table('grades')
            ->join('assessments', 'grades.assessment_id', '=', 'assessments.id')
            ->join('assessment_types', 'assessments.assessment_type_id', '=', 'assessment_types.id')
            ->where('assessments.class_id', $classId)
            ->where('assessments.term_id', $termId)
            ->select(
                'grades.student_id',
                'assessments.subject_id',
                'grades.score',
                'assessment_types.weight',
                'assessment_types.max_score'
            )
            ->get();

        // 4. Calculate weighted totals per student per subject
        $studentTotals = [];

        foreach ($students as $student) {
            $studentGrades = $records->where('student_id', $student->id);
            $totalWeightedScore = 0;
            $subjectCount = 0;

            foreach ($subjects as $subject) {
                $subjectGrades = $studentGrades->where('subject_id', $subject->id);
                if ($subjectGrades->isEmpty()) continue;

                $subjectFinalScore = 0;
                foreach ($subjectGrades as $grade) {
                    // Normalize score to percentage and apply weight
                    $percentage = ($grade->score / $grade->max_score) * 100;
                    $subjectFinalScore += ($percentage * ($grade->weight / 100));
                }

                $totalWeightedScore += $subjectFinalScore;
                $subjectCount++;
            }

            $average = $subjectCount > 0 ? round($totalWeightedScore / $subjectCount, 2) : 0;

            $studentTotals[] = [
                'student_id' => $student->id,
                'admission_number' => $student->admission_number,
                'full_name' => "{$student->last_name}, {$student->first_name}",
                'total_score' => round($totalWeightedScore, 2),
                'average' => $average,
                'grade_letter' => $this->resolveGradeLetter($average),
                'rank' => 0,
            ];
        }

        // 5. Rank students by average descending
        usort($studentTotals, fn($a, $b) => $b['average'] <=> $a['average']);

        foreach ($studentTotals as $index => &$row) {
            $row['rank'] = $index + 1;
        }

        return $studentTotals;
    }

    /**
     * Standard grade scale mapping
     */
    public function resolveGradeLetter(float $score): string
    {
        return match (true) {
            $score >= 75 => 'A',
            $score >= 65 => 'B',
            $score >= 50 => 'C',
            $score >= 35 => 'D',
            default => 'F',
        };
    }
}