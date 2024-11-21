<?php

namespace Database\Seeders;

use App\Models\Grade;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Grade::insert([
            ['grade' => 'STAGE', 'echelon' => 1, 'duration' => 12], 
            ['grade' => 'INTEGRATION', 'echelon' => 1, 'duration' => 72], 
        ]);
    }
}