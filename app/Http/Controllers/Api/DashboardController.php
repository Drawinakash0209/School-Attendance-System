<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Student;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
        public function getAdminStats()
    {
        $today = Carbon::today()->toDateString();

        $totalStudents = Student::count();
        $totalTeachers = User::where('role', 'teacher')->count();

        $attendanceToday = Attendance::where('attendance_date', $today)->count();
        $presentToday = Attendance::where('attendance_date', $today)->where('status', 'Present')->count();

        $attendanceRate = ($attendanceToday > 0) ? round(($presentToday / $attendanceToday) * 100) : 0;

        return response()->json([
            'total_students' => $totalStudents,
            'total_teachers' => $totalTeachers,
            'attendance_rate_today' => $attendanceRate,
        ]);
    }
}
