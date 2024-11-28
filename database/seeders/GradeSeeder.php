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
            ['grade' => '2ème classe', 'echelon' => 1, 'duration' => 24],
            ['grade' => '2ème classe', 'echelon' => 2, 'duration' => 24],
            ['grade' => '2ème classe', 'echelon' => 3, 'duration' => 36],
            ['grade' => '1ère classe', 'echelon' => 1, 'duration' => 24],
            ['grade' => '1ère classe', 'echelon' => 2, 'duration' => 24],
            ['grade' => '1ère classe', 'echelon' => 3, 'duration' => 36],
            ['grade' => 'principal', 'echelon' => 1, 'duration' => 24],
            ['grade' => 'principal', 'echelon' => 2, 'duration' => 24],
            ['grade' => 'principal', 'echelon' => 3, 'duration' => 36],
            ['grade' => 'exceptionnel', 'echelon' => 1, 'duration' => 24],
            ['grade' => 'exceptionnel', 'echelon' => 2, 'duration' => 24],
            ['grade' => 'exceptionnel', 'echelon' => 3, 'duration' => 36]
        ]);
        
    }
}