<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Agent;
use App\Models\Categorie;
use App\Service\ContratService;
use Illuminate\Support\Facades\App;

class AgentCareerPathSeeder extends Seeder
{
    protected $contratService;

    public function __construct(ContratService $contratService)
    {
        $this->contratService = $contratService;
    }

    public function run()
    {
        // Create categories if they don't exist
        $categorieIII = Categorie::firstOrCreate(['nom' => 'Categorie III']);
        $categorieIV = Categorie::firstOrCreate(['nom' => 'Categorie IV']);

        // Create Agent Categorie III
        $agentIII = Agent::create([
            'matricule' => 'MAT20',
            'nom' => 'RAKOTO',
            'prenom' => 'Jean',
            'date_de_naissance' => '1976-05-15',
            // 'lieu_naissance' => 'Fianarantsoa',
            // 'adresse' => 'Lot 67 Ter Antarandolo',
            // 'contact' => '0341234567',
            // 'cin' => '101123456789',
            // 'date_cin' => '1995-06-20',
            // 'lieu_cin' => 'Fianarantsoa',
            // 'situation_matrimoniale' => 'MARIE',
            // 'nombre_enfants' => 2,
            'date_entree' => '2001-03-01',
            'categorie_id' => $categorieIII->id,
            'type_recrutement' => collect(['diplome', 'budgetaire'])->random(),
            'diplome' => collect(['Master', 'Licence', 'BTS'])->random(),
            'corps' => collect(['Ingenieur', 'Technicien', 'Analyste'])->random(),
            'chapitre_budgetaire' => 'A' . rand(100, 999),
            'is_active' => true,
        ]);

        // Create Agent Categorie IV
        $agentIV = Agent::create([
            'matricule' => 'MAT200',
            'nom' => 'RANAIVO',
            'prenom' => 'Marie',
            'date_de_naissance' => '1979-08-23',
            //'lieu_naissance' => 'Fianarantsoa',
            //'adresse' => 'Lot 89 Bis Tsianolondroa',
            //'contact' => '0331234567',
           // 'cin' => '101987654321',
           // 'date_cin' => '1997-09-15',
           // 'lieu_cin' => 'Fianarantsoa',
            //'situation_matrimoniale' => 'MARIEE',
           // 'nombre_enfants' => 3,
            'date_entree' => '2001-03-01',
            'categorie_id' => $categorieIV->id,
            'type_recrutement' => collect(['diplome', 'budgetaire'])->random(),
            'diplome' => collect(['Master', 'Licence', 'BTS'])->random(),
            'corps' => collect(['Ingenieur', 'Technicien', 'Analyste'])->random(),
            'chapitre_budgetaire' => 'A' . rand(100, 999),
            'is_active' => true,
        ]);

        // Process career paths using ContratService
     
        
        // Process complete career path for both agents
        $this->contratService-> processCompleteCareerPath($agentIII);
        $this->contratService->processCompleteCareerPath($agentIV);
    }
}