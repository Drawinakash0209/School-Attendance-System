<?php

namespace Database\Seeders;

use App\Models\Student;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Student::create(['name' => 'Alice Johnson', 'school_class_id' => 1]);
        Student::create(['name' => 'Bob Williams', 'school_class_id' => 1]);
        Student::create(['name' => 'Charlie Brown', 'school_class_id' => 2]);
        Student::create(['name' => 'Diana Miller', 'school_class_id' => 2]);
    }
}
