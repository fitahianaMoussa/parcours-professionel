<?php

namespace App\Service;

use App\Models\Agent;
use App\Models\Contrat;
use App\Models\Grade;
use App\Models\Avancement;
use App\Models\Arrete;
use App\Models\Reclassement;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;

class ContratService
{
    private const CONTRACT_DURATION = 24; // Duration in months
    private const STAGE_DURATION = 12; // Duration in months
    private const RETIREMENT_AGE = 60;
    private const INTEGRATION_DURATION = 72; // 6 years in months
    private const CONTRACT_TYPE_INTEGRATION = 'contractuel EFA';
    private const CONTRACT_TYPE_ADVANCEMENT = 'titularisation';
    private const GRADE_DEFAULT = 'défaut';

    /**
     * Create initial contracts for a new agent.
     *
     * @param Agent $agent
     * @throws InvalidArgumentException
     * @throws \Exception
     */
    public function createInitialContracts(Agent $agent): bool
    {
        if (!$agent->date_entree) {
            throw new InvalidArgumentException("La date d'entrée de l'agent est requise");
        }

        Log::info("Agent Date Entree: " . $agent->date_entree);

        try {
            DB::beginTransaction();
            for ($i = 1; $i <= 3; $i++) {
                $dateDebut = ($i === 1) 
                    ? Carbon::parse($agent->date_entree) 
                    : Carbon::parse($agent->date_entree)->addMonths(self::CONTRACT_DURATION * ($i - 1));

                $dateFin = $dateDebut->copy()->addMonths(self::CONTRACT_DURATION);

                $contrat = Contrat::create([
                    'agent_id' => $agent->id,
                    'type' => self::CONTRACT_TYPE_INTEGRATION,
                    'date_debut' => $dateDebut,
                    'date_fin' => $dateFin,
                    'numero_contrat' => $i,
                    'status' => ($i === 1) ? 'en cours' : 'termine',
                    'is_renouvele' => false,
                    'date_renouvellement' => null,
                    'is_active' => ($i === 1)
                ]);

                Log::info('Contract Created', ['contrat' => $contrat]);

                $this->createArrete($contrat, 'INTEGRATION', $agent);
                if ($i === 1) {
                    $this->initializeFirstContract($agent, $contrat);
                }
            }

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error in createInitialContracts: " . $e->getMessage(), ['exception' => $e]);
            throw $e;
        }
    }

   
 /* Gérer le premier contrat selon la catégorie de l'agent
 *
 * @param Agent $agent
 * @param Contrat $contrat
 * @throws InvalidArgumentException
 */
private function initializeFirstContract(Agent $agent, Contrat $contrat): void
{
    if (!$agent->categorie->nom) {
        throw new InvalidArgumentException("La catégorie de l'agent est requise");
    }

    switch ($agent->categorie->nom) {
        case 'Categorie III':
            $this->createAvancement(
                agent: $agent,
                contrat: $contrat,
                type: 'integration',
                duree: self::CONTRACT_DURATION,
                gradeParams: ['grade' => '2ème classe', 'echelon' => 1],
                dateDebut: $contrat->date_debut,
                dateEffet: $contrat->date_debut
            );
            break;
        
        case 'Categorie IV':
                        // Première année en stage
                        $this->createAvancement(
                            agent: $agent,
                            contrat: $contrat,
                            type: 'stage',
                            duree: self::STAGE_DURATION,
                            gradeParams: ['grade' => 'STAGE', 'echelon' => 1],
                            dateDebut: $contrat->date_debut,
                            dateEffet: $contrat->date_debut
                        );
            
                        // Deuxième année via avenant
                        $dateAvenant = Carbon::parse($contrat->date_debut)->addMonths(self::STAGE_DURATION);
                        $this->createAvancement(
                            agent: $agent,
                            contrat: $contrat,
                            type: 'avancement',
                            duree: 24,
                            gradeParams: ['grade' => '2ème classe', 'echelon' => 1],
                            dateDebut: $dateAvenant,
                            dateEffet: $dateAvenant
                        );
            
                        // Troisième année via avenant
                        $dateAvenant2 = $dateAvenant->addMonths(self::CONTRACT_DURATION);
                        $this->createAvancement(
                            agent: $agent,
                            contrat: $contrat,
                            type: 'avancement',
                            duree: 24,
                            gradeParams: ['grade' => '2ème classe', 'echelon' => 2],
                            dateDebut: $dateAvenant2,
                            dateEffet: $dateAvenant2
                        );
            
                        // Quatrième année via avenant
                        $dateAvenant3 = $dateAvenant2->addMonths(self::CONTRACT_DURATION);
                        $this->createAvancement(
                            agent: $agent,
                            contrat: $contrat,
                            type: 'avancement',
                            duree: 36,
                            gradeParams: ['grade' => '2ème classe', 'echelon' => 3],
                            dateDebut: $dateAvenant3,
                            dateEffet: $dateAvenant3
                        );

                             // Création d'un contrat à la fin de la période d'intégration
                        $this->createAdvancementContract($agent, ['grade' => '2ème classe', 'echelon' => 3], 36);
                        break;
            
            
        
        default: // Poste budgétaire
            $this->createAvancement(
                agent: $agent,
                contrat: $contrat,
                type: 'integration',
                duree: self::CONTRACT_DURATION,
                gradeParams: ['grade' => '2ème classe', 'echelon' => 1],
                dateDebut: $contrat->date_debut,
                dateEffet: $contrat->date_debut
            );
            break;
    }
}


    /**
     * Create advancement for Categorie IV agents.
     *
     * @param Agent $agent
     * @param Contrat $contrat
     */
    private function createAdvancementForCategorieIV(Agent $agent, Contrat $contrat): void
    {
        for ($echelon = 1; $echelon <= 3; $echelon++) {
            $this->createAvancement(
                agent: $agent,
                contrat: $contrat,
                type: 'avancement',
                duree: self::CONTRACT_DURATION,
                gradeParams: ['grade' => '2ème classe', 'echelon' => $echelon],
                dateDebut: Carbon::parse($contrat->date_debut)->addMonths(self::STAGE_DURATION + self::CONTRACT_DURATION * ($echelon - 1)),
                dateEffet: Carbon::parse($contrat->date_debut)->addMonths(self::STAGE_DURATION + self::CONTRACT_DURATION * ($echelon - 1))
            );
        }
        // Create a contract at the end of the integration period
        $this->createAdvancementContract($agent, ['grade' => '2ème classe', 'echelon' => 3], 36);
    }
   /**
     * Créer un nouveau contrat pour un avancement
     */
    private function createAdvancementContract(Agent $agent, array $gradeParams, int $duration): Contrat
    {
        $dateDebut = Carbon::now();
        $dateFin = $dateDebut->copy()->addMonths($duration);
    
        // Créer le contrat d'avancement
        $contrat = Contrat::create([
            'agent_id' => $agent->id,
            'type' => 'titularisation',
            'date_debut' => $dateDebut,
            'date_fin' => $dateFin,
            'numero_contrat' => $this->getNextContractNumber($agent),
            'status' => 'en cours',
            'is_active' => true,
            'grade_params' => json_encode($gradeParams)
        ]);
   // dd($dateFin);
        // Créer un arrêté après la création du contrat
        $this->createArrete($contrat, 'AVANCEMENT', $agent, $dateFin);
    
        // Log pour vérifier la création du contrat et de l'arrêté
        Log::info('Contrat d\'avancement créé', ['contrat' => $contrat]);
    
        return $contrat;
    }
    

    /**
     * Obtenir le prochain numéro de contrat
     */
    private function getNextContractNumber(Agent $agent): int
    {
        $lastContract = $agent->contrats()->orderBy('numero_contrat', 'desc')->first();
        return $lastContract ? $lastContract->numero_contrat + 1 : 1;
    }

    /**
     * Gérer les avancements successifs avec création de contrat
     */
    public function handleAdvancement(Agent $agent)
    {
        try {
            DB::beginTransaction();

            $currentGrade = $agent->avancements()->latest()->first()->grade;
            
            $advancementStructure = [
                '2ème classe' => [
                    1 => ['duration' => 24, 'next' => ['grade' => '2ème classe', 'echelon' => 2]],
                    2 => ['duration' => 24, 'next' => ['grade' => '2ème classe', 'echelon' => 3]],
                    3 => ['duration' => 36, 'next' => ['grade' => '1ère classe', 'echelon' => 1]]
                ],
                '1ère classe' => [
                    1 => ['duration' => 24, 'next' => ['grade' => '1ère classe', 'echelon' => 2]],
                    2 => ['duration' => 24, 'next' => ['grade' => '1ère classe', 'echelon' => 3]],
                    3 => ['duration' => 36, 'next' => ['grade' => 'principal', 'echelon' => 1]]
                ],
                'principal' => [
                    1 => ['duration' => 24, 'next' => ['grade' => 'principal', 'echelon' => 2]],
                    2 => ['duration' => 24, 'next' => ['grade' => 'principal', 'echelon' => 3]],
                    3 => ['duration' => 36, 'next' => ['grade' => 'exceptionnel', 'echelon' => 1]]
                ],
                'exceptionnel' => [
                    1 => ['duration' => 24, 'next' => ['grade' => 'exceptionnel', 'echelon' => 2]],
                    2 => ['duration' => 24, 'next' => ['grade' => 'exceptionnel', 'echelon' => 3]],
                    3 => ['duration' => 36, 'next' => null]
                ]
            ];

            $currentStructure = $advancementStructure[$currentGrade->grade][$currentGrade->echelon] ?? null;

            if ($currentStructure && $currentStructure['next']) {
                // Désactiver le contrat actuel
                $currentContract = $agent->contrats()->where('is_active', true)->first();
                if ($currentContract) {
                    $currentContract->update(['is_active' => false, 'status' => 'termine']);
                }

                // Créer un nouveau contrat pour l'avancement
                $newContract = $this->createAdvancementContract(
                    $agent,
                    $currentStructure['next'],
                    $currentStructure['duration']
                );

                // Créer l'avancement avec le nouveau contrat
                $this->createAvancement(
                    agent: $agent,
                    contrat: $newContract,
                    type: 'avancement',
                    duree: $currentStructure['duration'],
                    gradeParams: $currentStructure['next'],
                    dateDebut: $newContract->date_debut,
                    dateEffet: $newContract->date_debut
                );

                DB::commit();
                return true;
            }

            DB::commit();
            return false;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erreur lors du traitement de l'avancement: " . $e->getMessage(), [
                'agent_id' => $agent->id,
                'error' => $e
            ]);
            throw $e;
        }
    }

/**
 * Créer un avancement
 */
private function createAvancement(
    Agent $agent,
    ?Contrat $contrat,
    string $type,
    int $duree,
    array $gradeParams,
    ?Carbon $dateDebut = null,
    ?Carbon $dateEffet = null
): Avancement {
    // Initialisation des dates
  // Ensure $dateDebut is a Carbon instance
    $dateDebut = $dateDebut ?? ($contrat ? Carbon::parse($contrat->date_debut) : Carbon::now());
    $dateEffet = $dateEffet ?? $dateDebut;

// Ensure $dateDebut is a Carbon instance before calling copy()
if (!$dateDebut instanceof Carbon) {
    $dateDebut = Carbon::parse($dateDebut);
}

// Now safely call copy() on $dateDebut
$dateFin = $dateDebut->copy()->addMonths($duree);
    // Validation des paramètres du grade
    $gradeParams = array_merge(['echelon' => 1, 'grade' => 'défaut'], $gradeParams);
    $grade = Grade::firstOrCreate($gradeParams);

    // Créer l'arrêté associé
    $arrete = $this->createArrete($contrat, strtoupper($type), $agent, $dateEffet);

    // Création de l'avancement
    return Avancement::create([
        'agent_id' => $agent->id,
        'grade_id' => $grade->id,
        'arrete_id' => $arrete->id,
        'duree_mois' => $duree,
        'date_debut' => $dateDebut,
        'date_effet' => $dateEffet,
        'date_fin' => $dateFin,
        'is_integration' => $type === 'integration',
        'echelon' => $gradeParams['echelon'],
        'contract_phase' => 'titularisation',
        'status' => 'en_cours',
        'index_value' => $grade->index_value ?? 0
    ]);
}
    /**
     * Gérer le renouvellement des contrats
     */
    public function handleContractRenewal(Contrat $contrat)
    {
        try {
            DB::beginTransaction();

            if ($contrat->numero_contrat < 3) {
                $nextContrat = $this->activateNextContract($contrat);
                $this->handleContractTransition($contrat->agent, $nextContrat);
            } else {
                $this->handlePostIntegrationPhase($contrat->agent);
            }

            $contrat->update(['status' => 'terminé', 'is_active' => false]);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Activer le prochain contrat
     */
    private function activateNextContract(Contrat $currentContrat)
    {
        $nextContrat = Contrat::where('agent_id', $currentContrat->agent_id)
            ->where('numero_contrat', $currentContrat->numero_contrat + 1)
            ->first();

        if ($nextContrat) {
            $nextContrat->update([
                'status' => 'en cours',
                'is_active' => true
            ]);
        }

        return $nextContrat;
    }

    /**
     * Gérer les transitions de contrat
     */
    private function handleContractTransition(Agent $agent, Contrat $nextContrat)
    {
        $currentGrade = $agent->avancements()->latest()->first()?->grade;

        switch ($agent->categorie->nom) {
            case 'Categorie IV':
                if ($nextContrat->numero_contrat === 2) {
                    // Maintien en 2ème classe, 1er échelon pendant 1 an
                    $this->createAvancement(
                        agent: $agent,
                        contrat: $nextContrat,
                        type: 'integration',
                        duree: 12,
                        gradeParams: ['grade' => '2ème classe', 'echelon' => 1]
                    );
                    
                    // Passage en 2ème classe, 2ème échelon pour la deuxième année
                    $dateAvenant = Carbon::parse($nextContrat->date_debut)->addMonths(12);
                    $this->createAvancement(
                        agent: $agent,
                        contrat: $nextContrat,
                        type: 'avancement',
                        duree: 12,
                        gradeParams: ['grade' => '2ème classe', 'echelon' => 2],
                        dateDebut: $dateAvenant
                    );
                } elseif ($nextContrat->numero_contrat === 3) {
                    // Maintien en 2ème classe, 2ème échelon pendant 1 an
                    $this->createAvancement(
                        agent: $agent,
                        contrat: $nextContrat,
                        type: 'avancement',
                        duree: 12,
                        gradeParams: ['grade' => '2ème classe', 'echelon' => 2]
                    );
                    
                    // Passage en 2ème classe, 3ème échelon pour la deuxième année
                    $dateAvenant = Carbon::parse($nextContrat->date_debut)->addMonths(12);
                    $this->createAvancement(
                        agent: $agent,
                        contrat: $nextContrat,
                        type: 'avancement',
                        duree: 12,
                        gradeParams: ['grade' => '2ème classe', 'echelon' => 3],
                        dateDebut: $dateAvenant
                    );
                }
                break;

            default: // Catégorie III et poste budgétaire
                $this->createAvancement(
                    agent: $agent,
                    contrat: $nextContrat,
                    type: 'avancement',
                    duree: self::CONTRACT_DURATION,
                    gradeParams: $currentGrade->toArray()
                );
                break;
        }
    }

    /**
     * Gérer la phase post-intégration modifiée
     */
    public function handlePostIntegrationPhase(Agent $agent)
    {
        // Créer un nouveau contrat pour la phase post-intégration
        $lastContrat = $agent->contrats()->latest()->first();
        if (!$lastContrat) {
            throw new InvalidArgumentException("Aucun contrat trouvé pour l'agent");
        }

        $newContrat = Contrat::create([
            'agent_id' => $agent->id,
            'type' => 'integration_stage',
            'date_debut' => Carbon::now(),
            'date_fin' => Carbon::now()->addYears(2),
            'numero_contrat' => $lastContrat->numero_contrat + 1,
            'status' => 'en cours',
            'is_active' => true
        ]);

        switch ($agent->categorie->nom) {
            case 'Categorie III':
                // Stage d'un an
                $this->createAvancement(
                    agent: $agent,
                    contrat: $newContrat,
                    type: 'integration',
                    duree: self::STAGE_DURATION,
                    gradeParams: ['grade' => 'STAGE','echelon'=>1,'duration'=>12]
                );

                // Titularisation
                $dateTitularisation = Carbon::now()->addYear();
                $this->createAvancement(
                    agent: $agent,
                    contrat: $newContrat,
                    type: 'titularisation',
                    duree: 24,
                    gradeParams: ['grade' => '2ème classe', 'echelon' => 1,'duration'=>24],
                    dateDebut: $dateTitularisation
                );
                break;

            case 'Categorie IV':
                // Intégration directe en 2ème classe, 3ème échelon
                $this->createAvancement(
                    agent: $agent,
                    contrat: $newContrat,
                    type: 'integration',
                    duree: 36,
                    gradeParams: ['grade' => '2ème classe', 'echelon' => 3,'duration'=>24]
                );
                break;

            default: // Poste budgétaire
                $this->createAvancement(
                    agent: $agent,
                    contrat: $newContrat,
                    type: 'integration',
                    duree: 24,
                    gradeParams: ['grade' => '2ème classe', 'echelon' => 2,'duration'=>24]
                );
                break;
        }
    }

    /**
     * Gérer le reclassement pendant la phase d'intégration
     */
    public function handleReclassement(Agent $agent, $newCategorie)
    {
        $latestContrat = $agent->contrats()->where('is_active', true)->first();
        
        if (!$latestContrat || $latestContrat->numero_contrat > 3) {
            throw new \Exception("Le reclassement n'est possible que pendant la phase d'intégration.");
        }

        try {
            DB::beginTransaction();

            Reclassement::create([
                'agent_id' => $agent->id,
                'ancienne_categorie_id' => $agent->categorie_id,
                'nouvelle_categorie_id' => $newCategorie,
                'date_reclassement' => Carbon::now()
            ]);

            $agent->update(['categorie_id' => $newCategorie]);

            $this->createAvancement(
                agent: $agent,
                contrat: $latestContrat,
                type: 'reclassement',
                duree: 12,
                gradeParams: ['grade' => 'STAGE','echelon'=>1,'duration'=>12]
            );

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

/**
     * Vérifier et mettre à jour l'indice salarial (suite)
     */
    public function checkAndUpdateSalaryIndex(Agent $agent)
    {
        $latestGrade = $agent->avancements()->latest()->first()?->grade;
        
        if ($latestGrade && 
            $latestGrade->grade === 'exceptionnel' && 
            $latestGrade->echelon === 3) {
            
            $lastIndexUpdate = $agent->index_updates()->latest()->first();
            $nextUpdateDate = $lastIndexUpdate 
                ? Carbon::parse($lastIndexUpdate->date)->addYears(2)
                : Carbon::parse($agent->avancements()->latest()->first()->date_effet)->addYears(2);

            if (Carbon::now()->gte($nextUpdateDate) && $agent->age < self::RETIREMENT_AGE) {
                $agent->increment('indice', 100);
                
                $agent->index_updates()->create([
                    'date' => Carbon::now(),
                    'ancien_indice' => $agent->indice - 100,
                    'nouvel_indice' => $agent->indice
                ]);

                return true;
            }
        }

        return false;
    }

    /**
     * Créer un arrêté
     */
    private function createArrete(
        ?Contrat $contrat,
        string $type,
        Agent $agent,
        ?Carbon $dateEffet = null
    ): Arrete {
        $dateEffet = $dateEffet ?? Carbon::now();
        
        return Arrete::create([
            'contrat_id' => $contrat?->id,
            'numero_arrete' => $this->generateArreteReference($type),
            'date_arrete' => Carbon::now(),
            'date_effet' => $dateEffet,
            'type_arrete' => $type,
            'objet' => $this->generateArreteObjet($type, $agent),
            'signataire' => config('app.default_signataire', 'Le Président'),
            'lieu_signature' => config('app.lieu_signature', 'Fianarantsoa')
        ]);
    }


      /**
     * Générer une référence unique pour l'arrêté
     */
    private function generateArreteReference(string $type): string
    {
        $year = now()->year;
        $count = Arrete::whereYear('date_arrete', $year)->count() + 1;
        
        return sprintf('%s_%s_%04d_%s', 
            $type,
            $year,
            $count,
            substr(md5(uniqid(rand(), true)), 0, 6)
        );
    }

    /**
     * Vérifier si l'agent est éligible à l'avancement
     */
    public function checkAdvancementEligibility(Agent $agent): bool
    {
        $latestAvancement = $agent->avancements()->latest()->first();
        if (!$latestAvancement) return false;

        $dateFin = Carbon::parse($latestAvancement->date_fin);
        return Carbon::now()->gte($dateFin);
    }


    /**
     * Mettre à jour le statut de l'agent
     */
    public function updateAgentStatus(Agent $agent, string $newStatus)
    {
        $agent->update(['status' => $newStatus]);
        
        // Créer un historique du changement de statut
        $agent->status_history()->create([
            'ancien_status' => $agent->status,
            'nouveau_status' => $newStatus,
            'date_changement' => Carbon::now()
        ]);
    }

    /**
     * Vérifier si l'agent est en période d'intégration
     */
    public function isInIntegrationPeriod(Agent $agent): bool
    {
        $firstContract = $agent->contrats()->orderBy('date_debut')->first();
        if (!$firstContract) return false;

        $integrationEndDate = Carbon::parse($firstContract->date_debut)
            ->addMonths(self::INTEGRATION_DURATION);

        return Carbon::now()->lt($integrationEndDate);
    }

    /**
     * Calculer la durée restante dans la période actuelle
     */
    public function getRemainingDuration(Agent $agent): int
    {
        $latestAvancement = $agent->avancements()->latest()->first();
        if (!$latestAvancement) return 0;

        $dateFin = Carbon::parse($latestAvancement->date_fin);
        return Carbon::now()->diffInMonths($dateFin, false);
    }

    private function generateArreteObjet(string $type_arrete, Agent $agent): string 
{
    switch($type_arrete) {
        case 'RECRUTEMENT':
            return "Arrêté portant recrutement de " . $agent->nom_complet;
        case 'INTEGRATION':
            return "Arrêté portant intégration de " . $agent->nom_complet;
        case 'TITULARISATION':
            return "Arrêté portant titularisation de " . $agent->nom_complet;
        case 'AVANCEMENT':
            return "Arrêté portant avancement de " . $agent->nom_complet;
        case 'RECLASSEMENT':
            return "Arrêté portant reclassement de " . $agent->nom_complet;
        default:
            return "Arrêté concernant " . $agent->nom_complet;
    }
}

   /**
     * Traiter le parcours de carrière complet de l'agent
     */
    public function processCompleteCareerPath(Agent $agent)
    {   
        try {
            DB::beginTransaction();

            // Étape 1: Créer les contrats initiaux
          // $this->createInitialContracts($agent);

            // Étape 2: Traiter selon la catégorie de l'agent
           $this->handleCareerPathByCategory($agent);

            // Étape 3: Gérer le dernier contrat actif
          //  $this->handleFinalActiveContract($agent);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erreur lors du traitement du parcours de carrière: " . $e->getMessage(), [
                'agent_id' => $agent->id,
                'error' => $e
            ]);
            throw $e;
        }
    }

  /**
     * Gérer le parcours de carrière selon la catégorie de l'agent
     */
    private function handleCareerPathByCategory(Agent $agent)
    {
        $dateEntree = Carbon::parse($agent->date_entree);
        $dateActuelle = Carbon::now();

        switch ($agent->categorie->nom) {
            case 'Categorie III':
                $this->processCategorieIIICareerPath($agent, $dateEntree, $dateActuelle);
                break;
            case 'Categorie IV':
                $this->processCategorieIVCareerPath($agent, $dateEntree, $dateActuelle);
                break;
            default: // Poste budgétaire
                $this->processPosteBudgetaireCareerPath($agent, $dateEntree, $dateActuelle);
                break;
        }
    }


    /**
     * Traiter le parcours de carrière pour Categorie III
     */
    private function processCategorieIIICareerPath(Agent $agent, Carbon $dateEntree, Carbon $dateActuelle)
    {
        $phases = [
            ['type' =>'integration', 'duree' => 24, 'grade' => 'INTEGRATION', 'echelon' => 1],
            ['type' => 'integration', 'duree' => 24, 'grade' => 'INTEGRATION', 'echelon' => 1],
            ['type' => 'integration', 'duree' => 24, 'grade' => 'INTEGRATION', 'echelon' => 1],
            ['type' => 'stage', 'duree' => 12, 'grade' => 'STAGE', 'echelon' => 1],
            ['type' => 'titularisation', 'duree' => 24, 'grade' => '2ème classe', 'echelon' => 1],
            ['type' => 'avancement', 'duree' => 24, 'grade' => '2ème classe', 'echelon' => 2],
            ['type' => 'avancement', 'duree' => 36, 'grade' => '2ème classe', 'echelon' => 3],
            ['type' => 'avancement', 'duree' => 24, 'grade' => '1ère classe', 'echelon' => 1],
            ['type' => 'avancement', 'duree' => 24, 'grade' => '1ère classe', 'echelon' => 2],
            ['type' => 'avancement', 'duree' => 36, 'grade' => '1ère classe', 'echelon' => 3],
            ['type' => 'avancement', 'duree' => 24, 'grade' => 'principal', 'echelon' => 1],
            ['type' => 'avancement', 'duree' => 24, 'grade' => 'principal', 'echelon' => 2],
            ['type' => 'avancement', 'duree' => 36, 'grade' => 'principal', 'echelon' => 3],
            ['type' => 'avancement', 'duree' => 24, 'grade' => 'exceptionnel', 'echelon' => 1],
            ['type' => 'avancement', 'duree' => 24, 'grade' => 'exceptionnel', 'echelon' => 2],
            ['type' => 'avancement', 'duree' => 36, 'grade' => 'exceptionnel', 'echelon' => 3],
        ];

        $this->progressThroughCareerStages($agent, $dateEntree, $dateActuelle, $phases);
    }

    /**
     * Traiter le parcours de carrière pour Categorie IV
     */
    private function processCategorieIVCareerPath(Agent $agent, Carbon $dateEntree, Carbon $dateActuelle)
    {
        $phases = [
            ['type' => 'integration', 'duree' => 12, 'grade' => 'STAGE', 'echelon' => 1],
            ['type' => 'integration', 'duree' => 24, 'grade' => '2ème classe', 'echelon' => 1],
            ['type' => 'integration', 'duree' => 24, 'grade' => '2ème classe', 'echelon' => 2],
            ['type' => 'integration', 'duree' => 36, 'grade' => '2ème classe', 'echelon' => 3],
            ['type' => 'avancement', 'duree' => 24, 'grade' => '1ère classe', 'echelon' => 1],
            ['type' => 'avancement', 'duree' => 24, 'grade' => '1ère classe', 'echelon' => 2],
            ['type' => 'avancement', 'duree' => 36, 'grade' => '1ère classe', 'echelon' => 3],
            ['type' => 'avancement', 'duree' => 24, 'grade' => 'principal', 'echelon' => 1],
            ['type' => 'avancement', 'duree' => 24, 'grade' => 'principal', 'echelon' => 2],
            ['type' => 'avancement', 'duree' => 36, 'grade' => 'principal', 'echelon' => 3],
            ['type' => 'avancement', 'duree' => 24, 'grade' => 'exceptionnel', 'echelon' => 1],
            ['type' => 'avancement', 'duree' => 24, 'grade' => 'exceptionnel', 'echelon' => 2],
            ['type' => 'avancement', 'duree' => 36, 'grade' => 'exceptionnel', 'echelon' => 3],
        ];
    

        $this->progressThroughCareerStages($agent, $dateEntree, $dateActuelle, $phases);
    }

    /**
     * Traiter le parcours de carrière pour Poste Budgétaire
     */
    private function processPosteBudgetaireCareerPath(Agent $agent, Carbon $dateEntree, Carbon $dateActuelle)
    {
        $phases = [
            ['type' => 'integration', 'duree' => 24, 'grade' => '2ème classe', 'echelon' => 1],
            ['type' => 'avancement', 'duree' => 24, 'grade' => '2ème classe', 'echelon' => 2],
            ['type' => 'avancement', 'duree' => 36, 'grade' => '2ème classe', 'echelon' => 3],
            ['type' => 'avancement', 'duree' => 24, 'grade' => '1ère classe', 'echelon' => 1],
            ['type' => 'avancement', 'duree' => 24, 'grade' => '1ère classe', 'echelon' => 2],
        ];

        $this->progressThroughCareerStages($agent, $dateEntree, $dateActuelle, $phases);
    }

    /**
     * Progression à travers les étapes de carrière
     */
    private function progressThroughCareerStages(Agent $agent, Carbon $dateEntree, Carbon $dateActuelle, array $phases)
    {
        $currentDate = $dateEntree->copy();
        $latestContrat = null;

        foreach ($phases as $phase) {
            // Vérifier si nous avons dépassé la date actuelle
            if ($currentDate->gt($dateActuelle)) {
                break;
            }

            // Créer un nouveau contrat pour cette phase
            $latestContrat = Contrat::create([
                'agent_id' => $agent->id,
                'type' => $phase['type'],
                'date_debut' => $currentDate,
                'date_fin' => $currentDate->copy()->addMonths($phase['duree']),
                'status' => 'terminé',
                'numero_contrat' => 'CONTRAT-' . uniqid(),
            ]);
          //  $arrete = $this->createArrete($lastcontrat, strtoupper($type), $agent, $dateEffet);
            // Créer l'avancement correspondant
            $this->createAvancement(
                agent: $agent,
                contrat: $latestContrat,
                type: $phase['type'],
                duree: $phase['duree'],
                gradeParams: [
                    'grade' => $phase['grade'],
                    'echelon' => $phase['echelon']
                ],
                dateDebut: $currentDate,
                dateEffet: $currentDate
            );

            // Mettre à jour la date courante
            $currentDate->addMonths($phase['duree']);

             // Vérifier si c'est la phase d'avancement finale pour 2ème classe, échelon 3
        if ($phase['grade'] === '2ème classe' && $phase['echelon'] === 3) {
            // Créer un nouveau contrat de 24 mois
           if($agent->categorie->nom = 'Categorie IV'){
            $contratnew = Contrat::create([
                'agent_id' => $agent->id,
                'type' => 'avancement',
                'date_debut' => $currentDate,
                'date_fin' => $currentDate->copy()->addMonths(0), // Durée de 24 mois
                'status' => 'terminé',
                'numero_contrat' => 'CONTRAT-' . uniqid(),
            ]);

            // Créer un avenant de 24 mois à la fin de ce contrat
            $this->createAvancement(
                agent: $agent,
                contrat: $contratnew,
                type: 'avancement',
                duree: 0, // Durée de 24 mois
                gradeParams: [
                    'grade' => $phase['grade'],
                    'echelon' => $phase['echelon']
                ],
                dateDebut: $currentDate,
                dateEffet: $currentDate
            );
           }

        }
        }

        // Activer le dernier contrat
        if ($latestContrat) {
            $latestContrat->update([
                'status' => 'en cours',
                'is_active' => true
            ]);
        }
    }
/**
 * Créer un nouveau contrat
 */
private function createNewContract(Agent $agent, Carbon $dateFin, $duree)
{
    Contrat::create([
        'agent_id' => $agent->id,
        'type' => 'nouveau contrat',
        'date_debut' => $dateFin,
        'date_fin' => $dateFin->copy()->addMonths($duree),
        'numero_contrat' => 'CONTRAT-' . uniqid(),
        'status' => 'en cours',
        'is_active' => true
    ]);
}
    /**
     * Gérer le dernier contrat actif
     */
    private function handleFinalActiveContract(Agent $agent)
    {
        $activeContrats = $agent->contrats()->where('is_active', true)->get();
        
        if ($activeContrats->count() > 1) {
            $activeContrats->slice(0, -1)->each(function ($contrat) {
                $contrat->update([
                    'is_active' => false,
                    'status' => 'terminé'
                ]);
            });
        }
    }
}