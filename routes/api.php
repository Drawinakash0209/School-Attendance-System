<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\TeacherController;

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
    Route::get('/classes/{classId}/students', [TeacherController::class, 'getStudentsByClass']);
    Route::post('/attendance', [TeacherController::class, 'submitAttendance']);

       // --- Admin Specific Routes ---
    Route::middleware('role:admin')->group(function () {
        Route::post('/admin/register-teacher', [AdminController::class, 'registerTeacher']);
        Route::post('/admin/register-student', [AdminController::class, 'registerStudent']);
    });
});