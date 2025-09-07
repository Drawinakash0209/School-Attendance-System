<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function registerTeacher(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'teacher',
        ]);

        return response()->json(['message' => 'Teacher registered successfully.'], 201);
    }

    public function registerStudent(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'school_class_id' => 'required|exists:school_classes,id',
        ]);

        $student = Student::create([
            'name' => $request->name,
            'school_class_id' => $request->school_class_id,
        ]);

        return response()->json(['message' => 'Student registered successfully.'], 201);
    }


        public function listTeachers()
    {
        return User::where('role', 'teacher')->orderBy('name')->get();
    }

      public function listStudents()
    {
        return Student::with('schoolClass')->orderBy('name')->get();
    }


        public function updateTeacher(Request $request, User $teacher)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($teacher->id)],
        ]);
        $teacher->update($request->only(['name', 'email']));
        return response()->json(['message' => 'Teacher updated successfully.', 'teacher' => $teacher]);
    }


        public function updateStudent(Request $request, Student $student)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'school_class_id' => 'required|exists:school_classes,id',
        ]);

        $student->update($request->only(['name', 'school_class_id']));
        return response()->json(['message' => 'Student updated successfully.', 'student' => $student->load('schoolClass')]);
    }


        public function deleteTeacher(User $teacher)
    {
        $teacher->delete();
        return response()->json(['message' => 'Teacher deleted successfully.']);
    }


       public function deleteStudent(Student $student)
    {
        $student->delete();
        return response()->json(['message' => 'Student deleted successfully.']);
    }
}