<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SchoolClass; // For getClasses()
use App\Models\Student;     // For getStudentsByClass()
use App\Models\Attendance;  // For submitAttendance()
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TeacherController extends Controller
{
    /**
     * Get all classes for the dropdown.
     */
    public function getClasses()
    {
        return SchoolClass::all();
    }
    
    /**
     * Get students for a specific class.
     */
    public function getStudentsByClass($classId)
    {
        return Student::where('school_class_id', $classId)->get();
    }



      /**
     * Get students for a specific class with their attendance for today.
     */
        public function getStudentsWithAttendance(Request $request, $classId)
    {
        $date = $request->input('date', Carbon::today()->toDateString());

        $students = Student::where('school_class_id', $classId)->orderBy('name')->get();
        $attendances = Attendance::whereIn('student_id', $students->pluck('id'))
            ->where('attendance_date', $date)
            ->get()
            ->keyBy('student_id');

        $studentsWithAttendance = $students->map(function ($student) use ($attendances) {
            $student->status = $attendances->has($student->id) ? $attendances[$student->id]->status : null;
            return $student;
        });

        return response()->json($studentsWithAttendance);
    }

    /**
     * Submit attendance for a class.
     */
    public function submitAttendance(Request $request)
    {
        $request->validate([
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:students,id',
            'attendances.*.status' => 'required|in:Present,Absent',
        ]);

        $teacherId = auth()->id();
        $attendanceDate = Carbon::today()->toDateString();

        DB::transaction(function () use ($request, $teacherId, $attendanceDate) {
            foreach ($request->attendances as $attendanceData) {
                Attendance::updateOrCreate(
                    [
                        'student_id' => $attendanceData['student_id'],
                        'attendance_date' => $attendanceDate,
                    ],
                    [
                        'status' => $attendanceData['status'],
                        'teacher_id' => $teacherId,
                    ]
                );
            }
        });
        
        return response()->json(['message' => 'Attendance submitted successfully'], 201);
    }
}