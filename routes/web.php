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
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Welcome
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {

    // 1. Centralized Role Director: Routes user strictly according to normalized role
    Route::get('/dashboard', function () {
        $user = auth()->user();
        $role = strtolower(trim($user->role ?? 'teacher'));

        if (in_array($role, ['admin', 'super_admin'], true)) {
            return redirect()->route('admin.dashboard');
        }

        if ($role === 'bursar') {
            return redirect()->route('fees.index');
        }

        return redirect()->route('teacher.dashboard');
    })->name('dashboard');

    // 2. Executive Administrator Space
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/admin/dashboard', [AcademicDashboardController::class, 'adminIndex'])->name('admin.dashboard');

        // Staff & Student Roster
        Route::get('/roster', [RosterController::class, 'index'])->name('roster.index');
        Route::post('/roster/students', [RosterController::class, 'storeStudent'])->name('roster.students.store');
        Route::put('/roster/students/{id}', [RosterController::class, 'updateStudent'])->name('roster.students.update');
        Route::post('/roster/teachers', [RosterController::class, 'storeTeacher'])->name('roster.teachers.store');
        Route::post('/roster/allocations', [RosterController::class, 'assignAllocation'])->name('roster.allocations.store');
        Route::delete('/roster/allocations/{id}', [RosterController::class, 'removeAllocation'])->name('roster.allocations.destroy');

        // Audit Logs
        Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit.index');
    });

    // 3. Teacher & Faculty Workspace
    Route::middleware(['role:admin,teacher'])->group(function () {
        Route::get('/teacher/dashboard', [AcademicDashboardController::class, 'teacherIndex'])->name('teacher.dashboard');

        // Continuous Assessment & Marks Entry
        Route::get('/grades', [GradeEntryController::class, 'index'])->name('grades.index');
        Route::post('/grades/upsert', [GradeEntryController::class, 'upsert'])->name('grades.upsert');

        // Daily Roll-Call & Attendance
        Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
        Route::post('/attendance/bulk', [AttendanceController::class, 'recordBulk'])->name('attendance.bulk');

        // Academic Visual Desk & Transcripts
        Route::get('/academic-desk', [AcademicDashboardController::class, 'index'])->name('academic.desk');
        Route::get('/academic-summary', [ReportCardController::class, 'index'])->name('academic.summary');
        Route::get('/report-card/pdf/{studentId}', [ReportCardController::class, 'downloadPdf'])->name('report.pdf');
    });

    // 4. Financial Ledger (Bursar & Admin)
    Route::middleware(['role:admin,bursar'])->group(function () {
        Route::get('/fees', [FeeManagementController::class, 'index'])->name('fees.index');
        Route::post('/fees/payment', [FeeManagementController::class, 'recordPayment'])->name('fees.payment');
    });

    // 5. User Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';