<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $selectedDate = $request->query('date', now()->toDateString());
        $currentClass = DB::table('classes')->first();

        if (!$currentClass) {
            return Inertia::render('Academic/AttendanceRegister', [
                'students' => [],
                'selectedDate' => $selectedDate,
                'currentClass' => null,
            ]);
        }

        // Fetch students and their attendance status for the selected date
        $students = DB::table('students')
            ->leftJoin('attendance', function ($join) use ($selectedDate) {
                $join->on('students.id', '=', 'attendance.student_id')
                     ->where('attendance.date', '=', $selectedDate);
            })
            ->where('students.class_id', $currentClass->id)
            ->where('students.is_active', true)
            ->select(
                'students.id as student_id',
                'students.admission_number',
                'students.first_name',
                'students.last_name',
                'attendance.status',
                'attendance.remarks'
            )
            ->orderBy('students.last_name')
            ->get()
            ->map(function ($s) {
                return [
                    'student_id' => $s->student_id,
                    'admission_number' => $s->admission_number,
                    'full_name' => "{$s->last_name}, {$s->first_name}",
                    'status' => $s->status ?? 'UNRECORDED',
                    'remarks' => $s->remarks ?? '',
                ];
            });

        // Weekly summary statistics
        $stats = [
            'total' => $students->count(),
            'present' => $students->where('status', 'PRESENT')->count(),
            'absent' => $students->where('status', 'ABSENT')->count(),
            'late' => $students->where('status', 'LATE')->count(),
        ];

        return Inertia::render('Academic/AttendanceRegister', [
            'students' => $students,
            'selectedDate' => $selectedDate,
            'currentClass' => $currentClass,
            'stats' => $stats,
        ]);
    }

    public function recordBulk(Request $request)
    {
        $validated = $request->validate([
            'class_id' => 'required|uuid',
            'date' => 'required|date',
            'records' => 'required|array',
            'records.*.student_id' => 'required|uuid',
            'records.*.status' => 'required|in:PRESENT,ABSENT,LATE,EXCUSED',
        ]);

        $userId = auth()->id() ?? 1;

        foreach ($validated['records'] as $record) {
            DB::table('attendance')->updateOrInsert(
                [
                    'student_id' => $record['student_id'],
                    'date' => $validated['date'],
                ],
                [
                    'id' => (string) Str::uuid(),
                    'class_id' => $validated['class_id'],
                    'status' => $record['status'],
                    'recorded_by' => $userId,
                    'updated_at' => now(),
                ]
            );
        }

        return redirect()->back()->with('success', 'Attendance recorded successfully');
    }
}