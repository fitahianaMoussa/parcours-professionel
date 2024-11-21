<?php

namespace Database\Seeders;

use App\Models\Agent;
use App\Models\Contrat;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContratSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
     
        {
            // Add some agents for the demo (if you are using them in the seeder)
            $agents = \App\Models\Agent::all();  // Assuming you have an Agent model
    
            foreach ($agents as $agent) {
                // Dynamically generate contract type and status, ensuring variety
                $types = ['integration', 'avenant signé'];
                $statusOptions = ['en cours', 'terminé', 'annulé'];
                $type = $types[array_rand($types)];  // Randomly pick a type from the array
                $status = $statusOptions[array_rand($statusOptions)];  // Randomly pick a status from the array
    
                // Insert the contract data into the database
                DB::table('contrats')->insert([
                    'agent_id' => $agent->id,
                    'type' => $type,
                    'date_debut' => Carbon::now(),
                    'date_fin' => Carbon::now()->addYear(),
                    'numero_contrat' => 'CONT-' . Carbon::now()->year . '-' . rand(1000, 9999),
                    'status' => $status,
                    'phase' => rand(1, 3),  // Random phase for demo
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
}}
        
       