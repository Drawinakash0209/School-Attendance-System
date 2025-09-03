<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

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
}