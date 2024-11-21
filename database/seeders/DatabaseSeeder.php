<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{Agent, Category, Contract, Grade, Arrete, Avancement};
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
           // AgentSeeder::class,
            //ContratSeeder::class,
            //ArreteSeeder::class,
           // AvancementSeeder::class
           GradeSeeder::class,
           CareerProgressionSeeder::class,
        ]);
    }
}


class AgentSeeder extends Seeder
{
    public function run()
    {
        // Agent en phase d'intégration
        \App\Models\Agent::create([
            'nom' => 'RAKOTO',
            'prenom' => 'Jean',
            'date_entree' => Carbon::now()->subMonths(1),
            'categorie_id' => 1,
            'grade_id' => 1, // 2ème classe, échelon 1
            'type_recrutement' => 'diplome',
            'diplome' => 'Master en Gestion',
            'corps' => 'Administratif',
            'chapitre_budgetaire' => '60-13',
            'indice' => '500',
            'is_active' => true
        ]);

        // Agent en phase de stage
        \App\Models\Agent::create([
            'nom' => 'RABE',
            'prenom' => 'Marie',
            'date_entree' => Carbon::now()->subYears(2),
            'categorie_id' => 2,
            'grade_id' => 1, // 2ème classe, échelon 1
            'type_recrutement' => 'budgetaire',
            'diplome' => 'Licence en Droit',
            'corps' => 'Administratif',
            'chapitre_budgetaire' => '60-13',
            'indice' => '450',
            'is_active' => true
        ]);

        // Agent titularisé
        \App\Models\Agent::create([
            'nom' => 'RANDRIA',
            'prenom' => 'Pierre',
            'date_entree' => Carbon::now()->subYears(4),
            'categorie_id' => 1,
            'grade_id' => 4, // 1ère classe, échelon 1
            'type_recrutement' => 'diplome',
            'diplome' => 'Doctorat en Sciences',
            'corps' => 'Enseignant',
            'chapitre_budgetaire' => '60-11',
            'indice' => '750',
            'is_active' => true
        ]);
    }
}

class ContratSeeder extends Seeder
{
    public function run()
    {
        // Contrats pour l'agent en intégration
        \App\Models\Contrat::create([
            'agent_id' => 1,
            'type' => 'integration',
            'date_debut' => Carbon::now()->subMonths(1),
            'date_fin' => Carbon::now()->addMonths(23),
            'numero_contrat' => '0001',
            'status' => 'en cours',
            'is_renouvele' => false
        ]);

        // Contrats pour l'agent en stage
        \App\Models\Contrat::create([
            'agent_id' => 2,
            'type' => 'avenant signé',
            'date_debut' => Carbon::now()->subYears(2),
            'date_fin' => Carbon::now()->subYears(1),
            'numero_contrat' => '0002',
            'status' => 'terminé',
            'is_renouvele' => true
        ]);

        \App\Models\Contrat::create([
            'agent_id' => 2,
            'type' => 'stage',
            'date_debut' => Carbon::now()->subMonths(6),
            'date_fin' => Carbon::now()->addMonths(6),
            'numero_contrat' => '0003',
            'status' => 'en cours',
            'is_renouvele' => false
        ]);

        // Contrats pour l'agent titularisé
        \App\Models\Contrat::create([
            'agent_id' => 3,
            'type' => 'titularisation',
            'date_debut' => Carbon::now()->subYears(3),
            'date_fin' => Carbon::now()->subYears(1),
            'numero_contrat' => '0004',
            'status' => 'terminé',
            'is_renouvele' => false
        ]);
    }
}

class ArreteSeeder extends Seeder
{
    public function run()
    {
        // Arrêté d'intégration
        \App\Models\Arrete::create([
            'contrat_id' => 1,
            'numero_arrete' => '2024-ARR-0001',
            'date_arrete' => Carbon::now()->subMonths(1),
            'date_effet' => Carbon::now()->subMonths(1),
            'type_arrete' => 'INTEGRATION',
            'objet' => 'Portant intégration de M/Mme RAKOTO Jean',
            'signataire' => 'Le Président de l\'Université',
            'lieu_signature' => 'Fianarantsoa'
        ]);

        // Arrêté de stage
        \App\Models\Arrete::create([
            'contrat_id' => 2,
            'numero_arrete' => '2024-ARR-0002',
            'date_arrete' => Carbon::now()->subMonths(6),
            'date_effet' => Carbon::now()->subMonths(6),
            'type_arrete' => 'INTEGRATION',
            'objet' => 'Portant stage de M/Mme RABE Marie',
            'signataire' => 'Le Président de l\'Université',
            'lieu_signature' => 'Fianarantsoa'
        ]);

        // Arrêté de titularisation
        \App\Models\Arrete::create([
            'contrat_id' => 4,
            'numero_arrete' => '2024-ARR-0003',
            'date_arrete' => Carbon::now()->subYears(3),
            'date_effet' => Carbon::now()->subYears(3),
            'type_arrete' => 'TITULARISATION',
            'objet' => 'Portant titularisation de M/Mme RANDRIA Pierre',
            'signataire' => 'Le Président de l\'Université',
            'lieu_signature' => 'Fianarantsoa'
        ]);
    }
}

class AvancementSeeder extends Seeder
{
    public function run()
    {
        // Avancement pour l'agent en intégration
        \App\Models\Avancement::create([
            'agent_id' => 1,
            'grade_id' => 1, // 2ème classe, échelon 1
            'arrete_id' => 1,
            'duree_mois' => 24,
            'date_debut' => Carbon::now()->subMonths(1),
            'date_effet' => Carbon::now()->subMonths(1),
            'date_fin' => Carbon::now()->addMonths(23),
            'is_integration' => true,
            'echelon' => 1,
           'contract_phase' =>  'integration',
            'status' => 'integration',
            'index_value' => 100
        ]);

        // Avancement pour l'agent en stage
        \App\Models\Avancement::create([
            'agent_id' => 2,
            'grade_id' => 1, // 2ème classe, échelon 1
            'arrete_id' => 2,
            'duree_mois' => 12,
            'date_debut' => Carbon::now()->subMonths(6),
            'date_effet' => Carbon::now()->subMonths(6),
            'date_fin' => Carbon::now()->addMonths(6),
            'is_integration' => false,
            'echelon' => 1,
            'contract_phase' =>  'stage',
            'status' => 'stage',
            'index_value' => 100
        ]);

        // Avancement pour l'agent titularisé
        \App\Models\Avancement::create([
            'agent_id' => 3,
            'grade_id' => 4, // 1ère classe, échelon 1
            'arrete_id' => 3,
            'duree_mois' => 24,
            'date_debut' => Carbon::now()->subYears(3),
            'date_effet' => Carbon::now()->subYears(3),
            'date_fin' => Carbon::now()->subYears(1),
            'is_integration' => false,
            'echelon' => 1,
            'contract_phase' => 'titularisation',
            'status' => 'titularised',
            'index_value' => 120
        ]);
    }
}