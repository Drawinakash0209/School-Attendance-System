<?php

namespace Database\Seeders;

use App\Models\SchoolClass;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sections = ['A' , 'B', 'C', 'D'];
        for($grade = 1; $grade <= 12; $grade++) {
            foreach($sections as $section) {
                SchoolClass::create([
                    'name' => "Grade $grade - $section"
                ]);
            }
        }
    }
}
