<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\Student;
use App\Models\Attendance;
use App\Models\SchoolClass;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ReportController extends Controller
{
    public function getStudentReport($studentId)
    {
        
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


    public function getClassReport(Request $request)
    {
        $request->validate([
            'school_class_id' => 'required|exists:school_classes,id',
            'month' => 'required|date_format:Y-m',
        ]);

        $classId = $request->input('school_class_id');
        $month = Carbon::createFromFormat('Y-m', $request->input('month'));

        // Find all students in the class
        $students = Student::where('school_class_id', $classId)->get();
        
        $reportData = [];

        foreach ($students as $student) {
            $attendances = Attendance::where('student_id', $student->id)
                ->whereYear('attendance_date', $month->year)
                ->whereMonth('attendance_date', $month->month)
                ->get();
            
            $totalDays = $attendances->count();
            $presentDays = $attendances->where('status', 'Present')->count();

            $reportData[] = [
                'student_id' => $student->id,
                'student_name' => $student->name,
                'present_days' => $presentDays,
                'absent_days' => $totalDays - $presentDays,
                'total_days' => $totalDays,
            ];
        }
        
        $schoolClass = SchoolClass::find($classId);

        return response()->json([
            'class_name' => $schoolClass->name,
            'report' => $reportData
        ]);
    }
}