<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\DashboardController;

// Public route for login
Route::post('/login', [AuthController::class, 'login']);

// Routes protected by authentication
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // --- Teacher Specific Routes ---
    Route::get('/classes', [TeacherController::class, 'getClasses']);
    //Route::get('/classes/{classId}/students', [TeacherController::class, 'getStudentsByClass']);
    Route::get('/attendance/class/{classId}', [TeacherController::class, 'getStudentsWithAttendance']);
    Route::post('/attendance', [TeacherController::class, 'submitAttendance']);
    

       // --- Admin Specific Routes ---
    Route::middleware('role:admin')->group(function () {
        Route::post('/admin/register-teacher', [AdminController::class, 'registerTeacher']);
        Route::post('/admin/register-student', [AdminController::class, 'registerStudent']);

        Route::get('/admin/stats', [DashboardController::class, 'getAdminStats']);
        Route::get('/admin/teachers', [AdminController::class, 'listTeachers']);
        Route::get('/admin/students', [AdminController::class, 'listStudents']);


        Route::put('/admin/teachers/{teacher}', [AdminController::class, 'updateTeacher']);
        Route::put('/admin/students/{student}', [AdminController::class, 'updateStudent']);
        Route::delete('/admin/teachers/{teacher}', [AdminController::class, 'deleteTeacher']);
        Route::delete('/admin/students/{student}', [AdminController::class, 'deleteStudent']);
    });

    Route::get('/reports/student/{studentId}', [ReportController::class, 'getStudentReport']);

        // --- Report Routes ---
    Route::get('/reports/student/{studentId}', [ReportController::class, 'getStudentReport']);
    Route::get('/reports/class', [ReportController::class, 'getClassReport']);
});