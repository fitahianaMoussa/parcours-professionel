<?php

namespace Database\Seeders;

use App\Models\Agent;
use App\Models\Arrete;
use App\Models\Avancement;
use App\Models\Grade;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AvancementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Example agents
        $agents = Agent::all(); // Retrieve all agents or create specific ones

        foreach ($agents as $agent) {
            // Example grade and echelon for testing (you can modify this as needed)
            $grades = ['integration', '2eme_classe', '1er_classe', 'principal', 'special'];
            $echelon = 1; // Start from echelon 1

            foreach ($grades as $grade) {
                $this->creerAvancement($agent, $grade, $echelon);
                $echelon++; // Increment echelon for the next phase
            }
        }
    }

    protected function creerAvancement(Agent $agent, string $grade, int $echelon): Avancement
    {
        // Fetch the grade from the database
        $gradeConfig = Grade::where('grade', $grade)->first();
    
        // If the grade does not exist in the database, throw an exception
        if (!$gradeConfig) {
            throw new \Exception("Grade '$grade' not found in database.");
        }
    
        // Fetch the phase configuration based on the echelon
        $phaseConfig = $gradeConfig->phases->where('echelon', $echelon)->first();
    
        // If no phase is found for the given echelon, throw an exception
        if (!$phaseConfig) {
            throw new \Exception("Echelon '$echelon' not found for grade '$grade'.");
        }
    
        // Get the duration (in months) from the phase configuration
        $dureeMois = $phaseConfig->duree_mois;
    
        // Calculate the start and end dates for the advancement
        $dateDebut = Carbon::now();
        $dateFin = $dateDebut->copy()->addMonths($dureeMois);
    
        // Create or retrieve the associated Arrete record
        $arrete = Arrete::create([
            'contrat_id' => $agent->contrat_id,
            'numero_arrete' => 'AUTO-' . now()->timestamp,
            'date_arrete' => now(),
            'date_effet' => $dateDebut,
            'type_arrete' => 'AVANCEMENT', // Type based on the context (e.g., AVANCEMENT)
            'objet' => 'Avancement de l\'agent au grade ' . $grade . ' échelon ' . $echelon,
            'signataire' => 'Director General', // Modify accordingly
        ]);
    
        // Create the advancement record with the generated arrete_id
        return Avancement::create([
            'agent_id' => $agent->id,
            'grade_id' => $gradeConfig->id, // Using the grade's ID from the database
            'arrete_id' => $arrete->id,
            'duree_mois' => $dureeMois,
            'date_debut' => $dateDebut,
            'date_effet' => $dateDebut,
            'date_fin' => $dateFin,
            'echelon' => $echelon,
            'status' => $gradeConfig->next_status ?? $agent->status,
            'contract_phase' => 1,
            'index_value' => 0,
        ]);
    }
    
    
}
