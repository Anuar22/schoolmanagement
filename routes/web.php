<?php

use App\Http\Controllers\Academic\GradeEntryController;
use App\Http\Controllers\Academic\ReportCardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Academic\FeeManagementController;
use App\Http\Controllers\Academic\AcademicDashboardController;
use Illuminate\Foundation\Application;
use App\Http\Controllers\Academic\AttendanceController;
use App\Http\Controllers\Academic\RosterController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::post('/attendance/bulk', [AttendanceController::class, 'recordBulk'])->name('attendance.bulk');

    // Roster Management Routes
    Route::get('/roster', [RosterController::class, 'index'])->name('roster.index');
    Route::post('/roster/students', [RosterController::class, 'storeStudent'])->name('roster.students.store');
    Route::put('/roster/students/{id}', [RosterController::class, 'updateStudent'])->name('roster.students.update');
    Route::post('/roster/teachers', [RosterController::class, 'storeTeacher'])->name('roster.teachers.store');
    Route::post('/roster/allocations', [RosterController::class, 'assignAllocation'])->name('roster.allocations.store');
    Route::delete('/roster/allocations/{id}', [RosterController::class, 'removeAllocation'])->name('roster.allocations.destroy');

    Route::get('/fees', [FeeManagementController::class, 'index'])->name('fees.index');
    Route::post('/fees/payment', [FeeManagementController::class, 'recordPayment'])->name('fees.payment');

    // Academic System Routes
    Route::get('/grades', [GradeEntryController::class, 'index'])->name('grades.index');
    Route::post('/grades/upsert', [GradeEntryController::class, 'upsert'])->name('grades.upsert');
    Route::get('/academic-summary', [ReportCardController::class, 'index'])->name('academic.summary');
    Route::get('/academic-desk', [AcademicDashboardController::class, 'index'])->name('academic.desk');
    Route::get('/report-card/pdf/{studentId}', [ReportCardController::class, 'downloadPdf'])->name('report.pdf');
});

require __DIR__.'/auth.php';