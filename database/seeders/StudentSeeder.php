<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\SchoolClass;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // A list of sample names to create realistic student data
        $firstNames = ['Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Ava', 'Elijah', 'Charlotte', 'William', 'Sophia', 'James', 'Amelia', 'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Evelyn', 'Alexander', 'Harper'];
        $lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'];

        // Get all the classes that were created by the ClassSeeder
        $classes = SchoolClass::all();

        foreach ($classes as $class) {
            // Create 3 unique students for each class
            for ($i = 0; $i < 3; $i++) {
                // Combine a random first and last name
                $studentName = $firstNames[array_rand($firstNames)] . ' ' . $lastNames[array_rand($lastNames)];
                
                Student::create([
                    'name' => $studentName,
                    'school_class_id' => $class->id,
                ]);
            }
        }
    }
}
