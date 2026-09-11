<?php

use App\Http\Controllers\Academic\AcademicDashboardController;
use App\Http\Controllers\Academic\AttendanceController;
use App\Http\Controllers\Academic\FeeManagementController;
use App\Http\Controllers\Academic\GradeEntryController;
use App\Http\Controllers\Academic\ReportCardController;
use App\Http\Controllers\Academic\RosterController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\DB;
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
    // Executive Institutional Dashboard
    Route::get('/dashboard', function () {
        $term = DB::table('terms')->where('is_active', true)->first();
        $totalStudents = DB::table('students')->where('is_active', true)->count();
        $totalTeachers = DB::table('users')->count();
        $totalClasses = DB::table('classes')->count();

        // Financial snapshot
        $totalInvoiced = (float) (DB::table('fee_invoices')->sum('total_amount') ?? 0);
        $totalCollected = (float) (DB::table('fee_invoices')->sum('paid_amount') ?? 0);
        $collectionRate = $totalInvoiced > 0 ? round(($totalCollected / $totalInvoiced) * 100, 1) : 0;

        // Today's attendance snapshot
        $today = now()->toDateString();
        $todayAttendance = DB::table('attendance')->where('date', $today)->get();
        $presentToday = $todayAttendance->where('status', 'PRESENT')->count();
        $absentToday = $todayAttendance->where('status', 'ABSENT')->count();
        $attendanceRate = $totalStudents > 0 && $todayAttendance->count() > 0 
            ? round(($presentToday / $todayAttendance->count()) * 100, 1) 
            : null;

        // Recent activity / fee receipts
        $recentPayments = DB::table('fee_payments')
            ->join('fee_invoices', 'fee_payments.fee_invoice_id', '=', 'fee_invoices.id')
            ->join('students', 'fee_invoices.student_id', '=', 'students.id')
            ->select(
                'fee_payments.receipt_number',
                'fee_payments.amount',
                'fee_payments.payment_method',
                'fee_payments.created_at',
                'students.first_name',
                'students.last_name',
                'students.admission_number'
            )
            ->orderByDesc('fee_payments.created_at')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'term' => $term,
            'metrics' => [
                'total_students' => $totalStudents,
                'total_teachers' => $totalTeachers,
                'total_classes' => $totalClasses,
                'collection_rate' => $collectionRate,
                'total_collected' => $totalCollected,
                'total_invoiced' => $totalInvoiced,
                'attendance_rate' => $attendanceRate,
                'present_today' => $presentToday,
                'absent_today' => $absentToday,
            ],
            'recentPayments' => $recentPayments,
        ]);
    })->name('dashboard');

    // Profile Management Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Daily Attendance Routes
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::post('/attendance/bulk', [AttendanceController::class, 'recordBulk'])->name('attendance.bulk');

    // Staff & Student Roster Routes
    Route::get('/roster', [RosterController::class, 'index'])->name('roster.index');
    Route::post('/roster/students', [RosterController::class, 'storeStudent'])->name('roster.students.store');
    Route::put('/roster/students/{id}', [RosterController::class, 'updateStudent'])->name('roster.students.update');
    Route::post('/roster/teachers', [RosterController::class, 'storeTeacher'])->name('roster.teachers.store');
    Route::post('/roster/allocations', [RosterController::class, 'assignAllocation'])->name('roster.allocations.store');
    Route::delete('/roster/allocations/{id}', [RosterController::class, 'removeAllocation'])->name('roster.allocations.destroy');

    // Bursar & Fee Ledger Routes
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