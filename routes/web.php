<?php

use App\Http\Controllers\Academic\AcademicDashboardController;
use App\Http\Controllers\Academic\AttendanceController;
use App\Http\Controllers\Academic\AuditLogController;
use App\Http\Controllers\Academic\FeeManagementController;
use App\Http\Controllers\Academic\GradeEntryController;
use App\Http\Controllers\Academic\ReportCardController;
use App\Http\Controllers\Academic\RosterController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Landing Page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {

    // 1. Centralized Role Router (/dashboard)
    Route::get('/dashboard', function () {
        $user = auth()->user();

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->isBursar()) {
            return redirect()->route('bursar.dashboard');
        }

        return redirect()->route('teacher.dashboard');
    })->name('dashboard');

    // 2. Executive Admin Space (Admin & Super Admin)
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/admin/dashboard', [AcademicDashboardController::class, 'adminIndex'])->name('admin.dashboard');

        // Roster & Academic Allocations
        Route::get('/roster', [RosterController::class, 'index'])->name('roster.index');
        Route::post('/roster/students', [RosterController::class, 'storeStudent'])->name('roster.students.store');
        Route::put('/roster/students/{id}', [RosterController::class, 'updateStudent'])->name('roster.students.update');
        Route::post('/roster/teachers', [RosterController::class, 'storeTeacher'])->name('roster.teachers.store');
        Route::post('/roster/allocations', [RosterController::class, 'assignAllocation'])->name('roster.allocations.store');
        Route::delete('/roster/allocations/{id}', [RosterController::class, 'removeAllocation'])->name('roster.allocations.destroy');

        // Tamper-Evident Ledger
        Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit.index');
    });

    // 3. Faculty & Teaching Space (Admin & Teacher)
    Route::middleware(['role:admin,teacher'])->group(function () {
        Route::get('/faculty/dashboard', function (Request $request) {
            $user = $request->user();
            $tenantId = $user->tenant_id;
            
            $term = DB::table('terms')
                ->where('tenant_id', $tenantId)
                ->where('is_active', true)
                ->first();

            $workload = DB::table('teacher_allocations')
                ->where('teacher_allocations.tenant_id', $tenantId)
                ->where('teacher_allocations.teacher_id', $user->id)
                ->join('classes', 'teacher_allocations.class_id', '=', 'classes.id')
                ->join('subjects', 'teacher_allocations.subject_id', '=', 'subjects.id')
                ->select(
                    'classes.id as class_id',
                    'classes.name as class_name',
                    'classes.stream',
                    'subjects.id as subject_id',
                    'subjects.name as subject_name'
                )
                ->get();

            return Inertia::render('Teacher/Dashboard', [
                'term' => $term,
                'workload' => $workload,
            ]);
        })->name('teacher.dashboard');

        // Continuous Assessment & Marksheet Grid
        Route::get('/grades', [GradeEntryController::class, 'index'])->name('grades.index');
        Route::post('/grades/upsert', [GradeEntryController::class, 'upsert'])->name('grades.upsert');

        // Morning Roll-Call & Attendance
        Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
        Route::post('/attendance/bulk', [AttendanceController::class, 'recordBulk'])->name('attendance.bulk');

        // Academic Visual Intelligence Desk & Transcripts
        Route::get('/academic-desk', [AcademicDashboardController::class, 'index'])->name('academic.desk');
        Route::get('/academic-summary', [ReportCardController::class, 'index'])->name('academic.summary');
        Route::get('/report-card/pdf/{studentId}', [ReportCardController::class, 'downloadPdf'])->name('report.pdf');
    });

    // 4. Financial & Bursar Operations (Admin & Bursar)
    Route::middleware(['role:admin,bursar'])->group(function () {
        Route::get('/bursar/dashboard', [FeeManagementController::class, 'index'])->name('bursar.dashboard');
        Route::get('/fees', [FeeManagementController::class, 'index'])->name('fees.index');
        Route::post('/fees/payment', [FeeManagementController::class, 'recordPayment'])->name('fees.payment');
    });

    // 5. Account Settings
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';