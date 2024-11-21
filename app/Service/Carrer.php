<?php

namespace App\Service;

use App\Models\Agent;
use App\Models\Arrete;
use App\Models\Avancement;
use App\Models\Contrat;
use Carbon\Carbon;
use Exception;

class Carrer
{
    protected $integrationDuration = 72; // 6 ans en mois
    protected $stageDuration = 12; // 1 an en mois
    
    public $careerPaths = [
        'CATEGORY_III' => [
            'INTEGRATION' => [
                'phases' => [
                    [
                        'duration' => 24,
                        'grade' => null,
                        'echelon' => null,
                        'type' => 'contrat_initial'
                    ],
                    [
                        'duration' => 24,
                        'grade' => null,
                        'echelon' => null,
                        'type' => 'renouvellement'
                    ],
                    [
                        'duration' => 24,
                        'grade' => null,
                        'echelon' => null,
                        'type' => 'renouvellement_final'
                    ]
                ]
            ],
            'STAGE' => [
                'duration' => 12,
                'grade' => '2eme_classe',
                'echelon' => 1
            ],
            'TITULARISATION' => [
                'initial_grade' => '2eme_classe',
                'initial_echelon' => 1,
                'progression' => [
                    [
                        'grade' => '2eme_classe',
                        'echelon' => 1,
                        'duration' => 24
                    ],
                    [
                        'grade' => '2eme_classe',
                        'echelon' => 2,
                        'duration' => 24
                    ],
                    [
                        'grade' => '2eme_classe',
                        'echelon' => 3,
                        'duration' => 36
                    ],
                    [
                        'grade' => '1ere_classe',
                        'echelon' => 1,
                        'duration' => 24
                    ],
                    [
                        'grade' => '1ere_classe',
                        'echelon' => 2,
                        'duration' => 24
                    ],
                    [
                        'grade' => '1ere_classe',
                        'echelon' => 3,
                        'duration' => 36
                    ],
                    [
                        'grade' => 'principal',
                        'echelon' => 1,
                        'duration' => 24
                    ],
                    [
                        'grade' => 'principal',
                        'echelon' => 2,
                        'duration' => 24
                    ],
                    [
                        'grade' => 'principal',
                        'echelon' => 3,
                        'duration' => 36
                    ],
                    [
                        'grade' => 'exceptionnel',
                        'echelon' => 1,
                        'duration' => 24
                    ],
                    [
                        'grade' => 'exceptionnel',
                        'echelon' => 2,
                        'duration' => 24
                    ],
                    [
                        'grade' => 'exceptionnel',
                        'echelon' => 3,
                        'duration' => 36
                    ]
                ]
            ]
        ],
        'CATEGORY_IV_PLUS' => [
            'INTEGRATION' => [
                'phases' => [
                    [
                        'duration' => 24,
                        'grade' => '2eme_classe',
                        'echelon' => 1,
                        'steps' => [
                            [
                                'duration' => 12,
                                'status' => 'stagiaire'
                            ],
                            [
                                'duration' => 12,
                                'status' => '2eme_classe_1er_echelon'
                            ]
                        ]
                    ],
                    [
                        'duration' => 24,
                        'grade' => '2eme_classe',
                        'echelon' => 1,
                        'type' => 'renouvellement'
                    ],
                    [
                        'duration' => 24,
                        'grade' => '2eme_classe',
                        'echelon' => 2,
                        'type' => 'renouvellement_final'
                    ]
                ]
            ],
            'TITULARISATION' => [
                'initial_grade' => '2eme_classe',
                'initial_echelon' => 2,
                'progression' => [
                    [
                        'grade' => '2eme_classe',
                        'echelon' => 3,
                        'duration' => 36
                    ],
                    [
                        'grade' => '1ere_classe',
                        'echelon' => 1,
                        'duration' => 24
                    ],
                    [
                        'grade' => '1ere_classe',
                        'echelon' => 2,
                        'duration' => 24
                    ],
                    [
                        'grade' => '1ere_classe',
                        'echelon' => 3,
                        'duration' => 36
                    ],
                    [
                        'grade' => 'principal',
                        'echelon' => 1,
                        'duration' => 24
                    ],
                    [
                        'grade' => 'principal',
                        'echelon' => 2,
                        'duration' => 24
                    ],
                    [
                        'grade' => 'principal',
                        'echelon' => 3,
                        'duration' => 36
                    ],
                    [
                        'grade' => 'exceptionnel',
                        'echelon' => 1,
                        'duration' => 24
                    ],
                    [
                        'grade' => 'exceptionnel',
                        'echelon' => 2,
                        'duration' => 24
                    ],
                    [
                        'grade' => 'exceptionnel',
                        'echelon' => 3,
                        'duration' => 36
                    ]
                ]
            ]
        ],
        'POSTE_BUDGETAIRE' => [
            'INTEGRATION' => [
                'phases' => [
                    [
                        'duration' => 24,
                        'type' => 'initial',
                        'reclassement_possible' => true
                    ],
                    [
                        'duration' => 24,
                        'grade' => '2eme_classe',
                        'echelon' => 1,
                        'type' => 'renouvellement'
                    ],
                    [
                        'duration' => 24,
                        'grade' => '2eme_classe',
                        'echelon' => 2,
                        'type' => 'renouvellement_final'
                    ]
                ]
            ],
            'TITULARISATION' => [
                'initial_grade' => '2eme_classe',
                'initial_echelon' => 2,
                'progression' => [
                    [
                        'grade' => '2eme_classe',
                        'echelon' => 3,
                        'duration' => 36
                    ],
                    [
                        'grade' => '1ere_classe',
                        'echelon' => 1,
                        'duration' => 24
                    ],
                    [
                        'grade' => '1ere_classe',
                        'echelon' => 2,
                        'duration' => 24
                    ],
                    [
                        'grade' => '1ere_classe',
                        'echelon' => 3,
                        'duration' => 36
                    ],
                    [
                        'grade' => 'principal',
                        'echelon' => 1,
                        'duration' => 24
                    ],
                    [
                        'grade' => 'principal',
                        'echelon' => 2,
                        'duration' => 24
                    ],
                    [
                        'grade' => 'principal',
                        'echelon' => 3,
                        'duration' => 36
                    ],
                    [
                        'grade' => 'exceptionnel',
                        'echelon' => 1,
                        'duration' => 24
                    ],
                    [
                        'grade' => 'exceptionnel',
                        'echelon' => 2,
                        'duration' => 24
                    ],
                    [
                        'grade' => 'exceptionnel',
                        'echelon' => 3,
                        'duration' => 36
                    ]
                ]
            ]
        ]
    ];

    public function calculateNextProgression($agent)
    {
        $currentContract = $agent->contrats()->latest()->first();
        $latestAvancement = $agent->avancements()->latest()->first();

        if (!$currentContract) {
            return $this->initiateIntegrationPhase($agent);
        }

        if ($this->isInIntegrationPhase($currentContract)) {
            return $this->handleIntegrationProgression($agent, $currentContract);
        }

        if ($this->isInStagiairePhase($currentContract)) {
            return $this->handleStagiaireToTitularisation($agent, $currentContract);
        }

        return $this->handleRegularProgression($agent, $latestAvancement);
    }

    protected function initiateIntegrationPhase($agent)
    {
        //dd($this->careerPaths);
        $category = (string)$agent->categorie->nom;// Assuming $agent has a 'category' property like 'CATEGORY_III'
        
        if (!isset($this->careerPaths[$category]['INTEGRATION']['phases'][0]['duration'])) {
            throw new Exception('Integration phase duration not defined for category: ' . $category);
        }
    
        $integrationPhaseDuration = $this->careerPaths[$category]['INTEGRATION']['phases'][0]['duration'];
    
        return [
            'type' => 'INTEGRATION',
            'phase' => 1,
            'duration' => $integrationPhaseDuration,
            'start_date' => now(),
            'end_date' => now()->addMonths($integrationPhaseDuration),
        ];
    }
    

    protected function isInIntegrationPhase($contract)
    {
        return $contract && in_array($contract->type, ['integration', 'avenant signé']) &&
            $contract->contract_phase <= 3;
    }

    protected function isInStagiairePhase($contract)
    {
        return $contract && $contract->type === 'stage';
    }

    protected function handleIntegrationProgression($agent, $currentContract)
    {
        // Vérifier dans quelle phase d'intégration nous sommes (1-3)
        $currentPhase = $currentContract->contract_phase;
        
        // Si nous n'avons pas encore terminé les 3 phases d'intégration (24 mois chacune)
        if ($currentPhase < 3) {
            return [
                'type' => 'INTEGRATION',
                'phase' => $currentPhase + 1,
                'duration' => 24, // 24 mois
                'start_date' => $currentContract->date_fin,
                'end_date' => Carbon::parse($currentContract->date_fin)->addMonths(24),
                'grade' => '2eme_classe',
                'echelon' => 1,
                'details' => [
                    'contract_type' => 'avenant signé',
                    'integration_phase' => $currentPhase + 1,
                    'total_phases' => 3
                ]
            ];
        }
        
        // Si nous avons terminé les 3 phases d'intégration (total 6 ans),
        // nous passons à la phase stagiaire
        if ($currentPhase === 3) {
            return [
                'type' => 'STAGE',
                'phase' => 1,
                'duration' => 12, // 12 mois de stage
                'start_date' => $currentContract->date_fin,
                'end_date' => Carbon::parse($currentContract->date_fin)->addMonths(12),
                'grade' => '2eme_classe',
                'echelon' => 1,
                'details' => [
                    'contract_type' => 'stage',
                    'stage_duration' => '1 an',
                    'next_step' => 'titularisation'
                ]
            ];
        }
    }

    protected function handleStagiaireToTitularisation($agent, $currentContract)
    {
        // Après la période de stage de 1 an, on passe à la titularisation
        if (Carbon::parse($currentContract->date_debut)
            ->addMonths(12)
            ->isPast()) {
            return [
                'type' => 'TITULARISATION',
                'phase' => 1,
                'duration' => 24, // Premier échelon de 2 ans
                'start_date' => $currentContract->date_fin,
                'end_date' => Carbon::parse($currentContract->date_fin)->addMonths(24),
                'grade' => '2eme_classe',
                'echelon' => 1,
                'details' => [
                    'contract_type' => 'titularisation',
                    'initial_grade' => '2eme_classe',
                    'initial_echelon' => 1,
                    'duration_years' => 2
                ]
            ];
        }
        
        // Si la période de stage n'est pas encore terminée
        return [
            'type' => 'STAGE',
            'phase' => 1,
            'remaining_days' => Carbon::parse($currentContract->date_fin)->diffInDays(now()),
            'start_date' => $currentContract->date_debut,
            'end_date' => $currentContract->date_fin,
            'grade' => '2eme_classe',
            'echelon' => 1,
            'details' => [
                'status' => 'en_cours',
                'stage_completion' => round(
                    (now()->diffInDays($currentContract->date_debut) / 365) * 100,
                    2
                ) . '%'
            ]
        ];
    }

    protected function handleRegularProgression($agent, $latestAvancement)
    {
        if (!$latestAvancement) {
            // Define a default progression or handle as needed
            return [
                'type' => 'INITIAL_PROGRESS',
                'grade' => '2eme_classe', // or any initial grade
                'echelon' => 1,
                'duration' => 24, // initial duration
                'start_date' => now(),
                'end_date' => now()->addMonths(24)
            ];
        }
    
        $currentGrade = $latestAvancement->grade ?? '2eme_classe'; // Default value
        $currentEchelon = $latestAvancement->echelon ?? 1; 
    
        // Continue with the existing logic
        $nextProgression = $this->determineNextGradeAndEchelon($currentGrade, $currentEchelon);
        
        return [
            'type' => 'AVANCEMENT',
            'grade' => $nextProgression['grade'],
            'echelon' => $nextProgression['echelon'],
            'duration' => $nextProgression['duration'],
            'start_date' => $latestAvancement->date_fin,
            'end_date' => Carbon::parse($latestAvancement->date_fin)
                ->addMonths($nextProgression['duration'])
        ];
    }
    
    protected function determineNextGradeAndEchelon($currentGrade, $currentEchelon)
    {
        $grades = $this->careerPaths['CATEGORY_III']['TITULARISATION']['progression'];
    
        foreach ($grades as $gradeName => $echelons) {
            foreach ($echelons as $index => $echelon) {
                if ($gradeName === $currentGrade && $echelon['echelon'] === $currentEchelon) {
                    if (!isset($echelons[$index + 1])) {
                        // Move to the first echelon of the next grade
                        $nextGradeKeys = array_keys($grades);
                        $currentGradeIndex = array_search($gradeName, $nextGradeKeys);
                        
                        if (isset($nextGradeKeys[$currentGradeIndex + 1])) {
                            $nextGrade = $nextGradeKeys[$currentGradeIndex + 1];
                            return [
                                'grade' => $nextGrade,
                                'echelon' => 1,
                                'duration' => $grades[$nextGrade][0]['duration'] ?? 24 // Provide a default duration
                            ];
                        }
                    } else {
                        return [
                            'grade' => $gradeName,
                            'echelon' => $echelon['echelon'] + 1,
                            'duration' => $echelons[$index + 1]['duration'] ?? 24 // Provide a default duration
                        ];
                    }
                }
            }
        }
        // Default return value if none match
        return [
            'grade' => '2eme_classe',
            'echelon' => 1,
            'duration' => 24
        ];
    }

    public function calculateTimeToRetirement($agent)
    {
        $birthdate = Carbon::parse($agent->date_naissance);
        $retirementAge = 60;
        $retirementDate = $birthdate->copy()->addYears($retirementAge);
        
        return [
            'retirement_date' => $retirementDate,
            'years_remaining' => now()->diffInYears($retirementDate),
            'months_remaining' => now()->diffInMonths($retirementDate),
            'is_retired' => now()->gt($retirementDate)
        ];
    }

     /**
     * Determine the category of the agent based on certain criteria.
     *
     * @param Agent $agent
     * @return string
     */
    public function determineCategory($agent)
    {
        // Example logic to determine the category based on agent attributes
        if ($agent->years_of_service < 5) {
            return 'Category I';
        } elseif ($agent->years_of_service < 10) {
            return 'Category II';
        } else {
            return 'Category III';
        }
    }

    /**
     * Get the current status of the agent based on their contracts and advancements.
     *
     * @param Agent $agent
     * @return string
     */
    public function getCurrentStatus($agent)
    {
        // Example logic to determine the current status
        // This may involve checking the agent's contracts and advancements
        $activeContracts = $agent->contracts()->where('status', 'active')->count();
        $activeAdvancements = $agent->advancements()->where('status', 'approved')->count();

        if ($activeContracts > 0 && $activeAdvancements > 0) {
            return 'Active and Advanced';
        } elseif ($activeContracts > 0) {
            return 'Active';
        } elseif ($activeAdvancements > 0) {
            return 'Advanced';
        } else {
            return 'Inactive';
        }
    }

    public function generateCareerProjection($agent)
    {
        $category = $this->determineCategory($agent);
        $currentStatus = $this->getCurrentStatus($agent);
        $projection = [];
        $currentDate = now();
        
        $retirement = $this->calculateTimeToRetirement($agent);
        if ($retirement['is_retired']) {
            return [];
        }

        while ($currentDate->lt($retirement['retirement_date'])) {
            $nextStep = $this->calculateNextProgression($agent);
            $projection[] = $nextStep;
            $currentDate = Carbon::parse($nextStep['end_date']);
            
            // Simuler la mise à jour du statut de l'agent
            $currentStatus = [
                'type' => $nextStep['type'],
                'grade' => $nextStep['grade'],
                'echelon' => $nextStep['echelon'],
                'date_fin' => $nextStep['end_date']
            ];
        }

        return $projection;
    }

    protected function calculateIntegrationPhase($agent)
    {
        $contracts = $agent->contrats()
            ->where('type', 'like', '%integration%')
            ->orderBy('date_debut')
            ->get();

        if ($contracts->isEmpty()) {
            return 0;
        }

        $totalDuration = 0;
        foreach ($contracts as $contract) {
            $totalDuration += Carbon::parse($contract->date_debut)
                ->diffInMonths($contract->date_fin);
        }

        return floor($totalDuration / 24); // Retourne la phase basée sur des périodes de 24 mois
    }
}

class ContratCarrerService
{
    protected $careerProgressionService;

    public function __construct(CareerProgressionService $careerProgressionService)
    {
        $this->careerProgressionService = $careerProgressionService;
    }

    public function createContrat($agent, $type, $dateDebut)
    {
        $progression = $this->careerProgressionService->calculateNextProgression($agent);
        
        return Contrat::create([
            'agent_id' => $agent->id,
            'type' => $type,
            'date_debut' => $dateDebut,
            'date_fin' => Carbon::parse($dateDebut)->addMonths($progression['duration']),
            'numero_contrat' => $this->generateNumeroContrat(),
            'status' => 'en cours',
            'is_renouvele' => false,
            'phase' => $progression['phase'] ?? null
        ]);
    }

    protected function generateNumeroContrat()
    {
        $lastContract = Contrat::latest()->first();
        $lastNumber = $lastContract ? intval(substr($lastContract->numero_contrat, -4)) : 0;
        return 'CONT-' . str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
    }
}

class ArreteCarrerService
{
    public function createArrete($contrat, $type, $dateEffet)
    {
        return Arrete::create([
            'contrat_id' => $contrat->id,
            'numero_arrete' => $this->generateNumeroArrete(),
            'date_arrete' => now(),
            'date_effet' => $dateEffet,
            'type_arrete' => $type,
            'objet' => $this->generateObjet($type, $contrat->agent),
            'signataire' => 'Le Président de l\'Université',
            'lieu_signature' => 'Fianarantsoa'
        ]);
    }

    protected function generateNumeroArrete()
    {
        $year = now()->year;
        $lastArrete = Arrete::whereYear('created_at', $year)->latest()->first();
        $lastNumber = $lastArrete ? intval(substr($lastArrete->numero_arrete, -4)) : 0;
        return $year . '-ARR-' . str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
    }

    protected function generateObjet($type, $agent)
    {
        $objetTemplates = [
            'INTEGRATION' => "Portant intégration de M/Mme {$agent->nom} {$agent->prenom}",
            'TITULARISATION' => "Portant titularisation de M/Mme {$agent->nom} {$agent->prenom}",
            'AVANCEMENT' => "Portant avancement de grade de M/Mme {$agent->nom} {$agent->prenom}",
            'RECLASSEMENT' => "Portant reclassement de M/Mme {$agent->nom} {$agent->prenom}"
        ];

        return $objetTemplates[$type] ?? "Arrêté concernant M/Mme {$agent->nom} {$agent->prenom}";
    }
}

class AvancementCarrerService
{
    public function createAvancement($agent, $grade, $arrete, $progression)
    {
        return Avancement::create([
            'agent_id' => $agent->id,
            'grade_id' => $grade->id,
            'arrete_id' => $arrete->id,
            'duree_mois' => $progression['duration'],
            'date_debut' => $progression['start_date'],
            'date_effet' => $arrete->date_effet,
            'date_fin' => $progression['end_date'],
            'is_integration' => $progression['type'] === 'INTEGRATION',
            'echelon' => $progression['echelon'] ?? 1,
            'contract_phase' => $progression['phase'] ?? null,
            'status' => $this->determineStatus($progression['type']),
            'index_value' => $this->calculateIndexValue($grade, $progression['echelon'] ?? 1)
        ]);
    }

    protected function determineStatus($type)
    {
        $statusMap = [
            'INTEGRATION' => 'integration',
            'STAGE' => 'stage',
            'TITULARISATION' => 'titularised',
            'AVANCEMENT' => 'advanced'
        ];

        return $statusMap[$type] ?? 'pending';
    }

    protected function calculateIndexValue($grade, $echelon)
    {
        $baseIndex = 100;
        $gradeMultiplier = [
            '2eme_classe' => 1,
            '1ere_classe' => 1.2,
            'principal' => 1.4,
            'exceptionnel' => 1.6
        ];

        $multiplier = $gradeMultiplier[$grade->grade] ?? 1;
        return (int) ($baseIndex * $multiplier * $echelon);
    }

}

class AgentCarrerService
{
    // Assuming you have a model Agent with categories and statuses defined
    protected $agentModel;

    public function __construct(Agent $agentModel)
    {
        $this->agentModel = $agentModel;
    }

    /**
     * Determine the category of the agent based on certain criteria.
     *
     * @param Agent $agent
     * @return string
     */
    public function determineCategory($agent)
    {
        // Example logic to determine the category based on agent attributes
        if ($agent->years_of_service < 5) {
            return 'Category I';
        } elseif ($agent->years_of_service < 10) {
            return 'Category II';
        } else {
            return 'Category III';
        }
    }

    /**
     * Get the current status of the agent based on their contracts and advancements.
     *
     * @param Agent $agent
     * @return string
     */
    public function getCurrentStatus($agent)
    {
        // Example logic to determine the current status
        // This may involve checking the agent's contracts and advancements
        $activeContracts = $agent->contracts()->where('status', 'active')->count();
        $activeAdvancements = $agent->advancements()->where('status', 'approved')->count();

        if ($activeContracts > 0 && $activeAdvancements > 0) {
            return 'Active and Advanced';
        } elseif ($activeContracts > 0) {
            return 'Active';
        } elseif ($activeAdvancements > 0) {
            return 'Advanced';
        } else {
            return 'Inactive';
        }
    }
}