<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Attendance;

class ReportController extends Controller
{
    public function getStudentReport($studentId)
    {
        // Eager load the class relationship for efficiency
        $student = Student::with('schoolClass')->findOrFail($studentId);

        $attendances = Attendance::where('student_id', $studentId)
            ->orderBy('attendance_date', 'desc')
            ->get();
        
        $totalDays = $attendances->count();
        $presentDays = $attendances->where('status', 'Present')->count();
        $absentDays = $totalDays - $presentDays;

        return response()->json([
            'student' => $student,
            'summary' => [
                'total_days' => $totalDays,
                'present_days' => $presentDays,
                'absent_days' => $absentDays,
            ],
            'records' => $attendances,
        ]);
    }
}