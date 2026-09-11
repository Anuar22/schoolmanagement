<?php

namespace App\Http\Controllers\Academic;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class RosterController extends Controller
{
    public function index()
    {
        $classes = DB::table('classes')->orderBy('level')->orderBy('stream')->get();
        $subjects = DB::table('subjects')->orderBy('name')->get();

        // 1. Students list with class details
        $students = DB::table('students')
            ->join('classes', 'students.class_id', '=', 'classes.id')
            ->select(
                'students.id',
                'students.admission_number',
                'students.first_name',
                'students.last_name',
                'students.gender',
                'students.is_active',
                'classes.id as class_id',
                'classes.name as class_name',
                'classes.stream'
            )
            ->orderBy('classes.level')
            ->orderBy('students.last_name')
            ->get();

        // 2. Teachers with their allocated classes and subjects
        $teachers = DB::table('users')
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get()
            ->map(function ($teacher) {
                $allocations = DB::table('teacher_allocations')
                    ->join('subjects', 'teacher_allocations.subject_id', '=', 'subjects.id')
                    ->join('classes', 'teacher_allocations.class_id', '=', 'classes.id')
                    ->where('teacher_allocations.teacher_id', $teacher->id)
                    ->select(
                        'teacher_allocations.id as allocation_id',
                        'subjects.name as subject_name',
                        'subjects.code as subject_code',
                        'classes.name as class_name',
                        'classes.stream'
                    )
                    ->get();

                return [
                    'id' => $teacher->id,
                    'name' => $teacher->name,
                    'email' => $teacher->email,
                    'allocations' => $allocations,
                ];
            });

        return Inertia::render('Academic/RosterManagement', [
            'students' => $students,
            'teachers' => $teachers,
            'classes' => $classes,
            'subjects' => $subjects,
        ]);
    }

    // --- Student Actions ---
    public function storeStudent(Request $request)
    {
        $validated = $request->validate([
            'admission_number' => 'required|string|unique:students,admission_number',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'gender' => 'required|in:Male,Female',
            'class_id' => 'required|uuid|exists:classes,id',
        ]);

        DB::table('students')->insert([
            'id' => (string) Str::uuid(),
            'admission_number' => strtoupper($validated['admission_number']),
            'first_name' => trim($validated['first_name']),
            'last_name' => trim($validated['last_name']),
            'gender' => $validated['gender'],
            'class_id' => $validated['class_id'],
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Student admitted successfully.');
    }

    public function updateStudent(Request $request, string $id)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'gender' => 'required|in:Male,Female',
            'class_id' => 'required|uuid|exists:classes,id',
            'is_active' => 'required|boolean',
        ]);

        DB::table('students')->where('id', $id)->update([
            'first_name' => trim($validated['first_name']),
            'last_name' => trim($validated['last_name']),
            'gender' => $validated['gender'],
            'class_id' => $validated['class_id'],
            'is_active' => $validated['is_active'],
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Student profile updated.');
    }

    // --- Teacher Actions ---
    public function storeTeacher(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        DB::table('users')->insert([
            'name' => trim($validated['name']),
            'email' => strtolower(trim($validated['email'])),
            'password' => Hash::make($validated['password']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Teacher account created.');
    }

    public function assignAllocation(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:users,id',
            'subject_id' => 'required|uuid|exists:subjects,id',
            'class_id' => 'required|uuid|exists:classes,id',
        ]);

        DB::table('teacher_allocations')->updateOrInsert(
            [
                'teacher_id' => $validated['teacher_id'],
                'subject_id' => $validated['subject_id'],
                'class_id' => $validated['class_id'],
            ],
            [
                'id' => (string) Str::uuid(),
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        return back()->with('success', 'Subject workload allocated.');
    }

    public function removeAllocation(string $allocationId)
    {
        DB::table('teacher_allocations')->where('id', $allocationId)->delete();
        return back()->with('success', 'Workload removed.');
    }
}