<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Agent;
use App\Models\Contrat;
use App\Models\Avancement;
use App\Models\Arrete;
use App\Models\Categorie;
use App\Models\Grade;
use App\Models\Category; // Assuming you have a Category model
use Carbon\Carbon;

class CareerProgressionCarrerSeeder extends Seeder
{
    public function run()
    {
        // Create categories
        $categories = [
            Categorie::create(['nom' => 'Category I']),
            Categorie::create(['nom' => 'Category II']),
            Categorie::create(['nom' => 'Category III']),
        ];

        // Create grades
        $grades = [
            Grade::create(['grade' => '2eme classe', 'echelon' => 1, 'duration' => 24]),
            Grade::create(['grade' => '2eme classe', 'echelon' => 2, 'duration' => 24]),
            Grade::create(['grade' => '1ere classe', 'echelon' => 1, 'duration' => 24]),
            Grade::create(['grade' => 'principal', 'echelon' => 1, 'duration' => 24]),
        ];

        // Generate multiple agents
       // Generate multiple agents
for ($i = 1; $i <= 10; $i++) {
    $agent = Agent::create([
        'nom' => 'Dupont' . $i,
        'prenom' => 'Jean' . $i,
        'date_entree' => Carbon::now()->subYears(rand(1, 10))->toDateString(),
       // 'date_naissance' => Carbon::now()->subYears(rand(30, 50))->toDateString(),
       // 'years_of_service' => rand(1, 10),
        'categorie_id' => $categories[array_rand($categories)]->id,
        'grade_id' => $grades[array_rand($grades)]->id, // Random grade assignment
        'type_recrutement' => 'diplome',
        'diplome' => 'Master',
        'corps' => 'Informatique',
        'chapitre_budgetaire' => '12345',
        'indice' => 'A' . rand(1, 5),
    ]);

    // Create initial contracts for each agent
    for ($j = 1; $j <= 3; $j++) {
        $contrat = Contrat::create([
            'agent_id' => $agent->id,
            'type' => 'integration',
            'date_debut' => Carbon::now()->subYears(rand(1, 10))->toDateString(),
            'date_fin' => Carbon::now()->subYears(rand(1, 5))->toDateString(),
            'numero_contrat' => 'CONT-000' . rand(1, 100),
            'status' => 'en cours',
            'is_renouvele' => false,
            'phase' => $j,
        ]);

        // Create an arrêté for the agent first
        $arrete = Arrete::create([
            'contrat_id' => $contrat->id,
            'numero_arrete' => '2023-ARR-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT),
            'date_arrete' => now(),
            'date_effet' => Carbon::now()->subYears(rand(1, 5))->toDateString(),
            'type_arrete' => 'TITULARISATION',
            'objet' => 'Portant titularisation de M/Mme ' . $agent->nom . ' ' . $agent->prenom,
            'signataire' => 'Le Président de l\'Université',
            'lieu_signature' => 'Fianarantsoa'
        ]);

        // Create advancements using the newly created arrêté
        Avancement::create([
            'agent_id' => $agent->id,
            'grade_id' => $grades[array_rand($grades)]->id,
            'arrete_id' => $arrete->id, // Include the Arrete ID
            'duree_mois' => 24,
            'date_debut' => Carbon::now()->subYears(rand(1, 5))->toDateString(),
            'date_effet' => Carbon::now()->subYears(rand(1, 5))->toDateString(),
            'date_fin' => Carbon::now()->subYears(rand(1, 5))->toDateString(),
            'is_integration' => false,
            'echelon' => rand(1, 3),
            'status' => 'approved',
        ]);
    }
}

           
    }
}