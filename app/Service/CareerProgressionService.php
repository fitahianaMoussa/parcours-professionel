<?php

namespace App\Service;

use App\Models\Arrete;
use App\Models\Avancement;
use App\Models\Contrat;
use Carbon\Carbon;

class CareerProgressionService
{
    protected $integrationDuration = 6; // années
    protected $stageDuration = 1; // année
    
    protected $grades = [
        'INTEGRATION' => [
            'duration' => 24, // mois
            'phases' => 3
        ],
        'STAGE' => [
            'duration' => 12 // mois
        ],
        'TITULARISATION' => [
            'grades' => [
                '2eme_classe' => [
                    [
                        'echelon' => 1,
                        'duration' => 24 // mois
                    ],
                    [
                        'echelon' => 2,
                        'duration' => 24
                    ],
                    [
                        'echelon' => 3,
                        'duration' => 36
                    ]
                ],
                '1ere_classe' => [
                    [
                        'echelon' => 1,
                        'duration' => 24
                    ],
                    [
                        'echelon' => 2,
                        'duration' => 24
                    ],
                    [
                        'echelon' => 3,
                        'duration' => 36
                    ]
                ],
                'principal' => [
                    [
                        'echelon' => 1,
                        'duration' => 24
                    ],
                    [
                        'echelon' => 2,
                        'duration' => 24
                    ],
                    [
                        'echelon' => 3,
                        'duration' => 36
                    ]
                ],
                'exceptionnel' => [
                    [
                        'echelon' => 1,
                        'duration' => 24
                    ],
                    [
                        'echelon' => 2,
                        'duration' => 24
                    ],
                    [
                        'echelon' => 3,
                        'duration' => 36
                    ]
                ]
            ]
        ]
    ];
    public function startIntegrationPhase($agent)
    {
        return $this->initiateIntegrationPhase($agent);
    }

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

    protected function handleStagiaireProgression($agent, $currentContract)
    {
        $stageStartDate = $currentContract->date_debut;
        $stageEndDate = Carbon::parse($stageStartDate)->addYear();
        
        // Calculer la progression du stage
        $progressionPercentage = now()->diffInDays($stageStartDate) / 365 * 100;
        
        if ($progressionPercentage >= 100) {
            // Le stage est terminé, préparer la titularisation
            return [
                'type' => 'TITULARISATION',
                'status' => 'ready_for_titularisation',
                'start_date' => $stageEndDate,
                'end_date' => $stageEndDate->copy()->addMonths(24), // Premier échelon de 2 ans
                'grade' => '2eme_classe',
                'echelon' => 1,
                'next_steps' => [
                    'prepare_titularisation_documents' => true,
                    'evaluation_required' => true,
                    'commission_review' => true
                ]
            ];
        }
        
        // Le stage est encore en cours
        return [
            'type' => 'STAGE',
            'status' => 'in_progress',
            'progression' => round($progressionPercentage, 2),
            'start_date' => $stageStartDate,
            'end_date' => $stageEndDate,
            'remaining_days' => now()->diffInDays($stageEndDate),
            'evaluations' => [
                'mid_stage_evaluation' => $progressionPercentage >= 50,
                'final_evaluation' => $progressionPercentage >= 90
            ]
        ];
    }

    protected function validateAndUpdateContract($agent, $progression)
    {
        $currentContract = $agent->contrats()->latest()->first();
        
        // Vérifier si le contrat actuel est toujours valide
        if ($currentContract && Carbon::parse($currentContract->date_fin)->isFuture()) {
            return $currentContract;
        }
        
        // Créer un nouveau contrat basé sur la progression
        return \App\Models\Contrat::create([
            'agent_id' => $agent->id,
            'type' => $progression['type'],
            'date_debut' => $progression['start_date'],
            'date_fin' => $progression['end_date'],
            'numero_contrat' => $this->generateContractNumber(),
            'status' => 'en cours',
            'is_renouvele' => false,
            'phase' => $progression['phase'] ?? null
        ]);
    }

    protected function generateContractNumber()
    {
        $lastContract = \App\Models\Contrat::latest()->first();
        $lastNumber = $lastContract ? (int) substr($lastContract->numero_contrat, -4) : 0;
        return 'CONT-' . date('Y') . '-' . str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
    }

    protected function initiateIntegrationPhase($agent)
    {
        return [
            'type' => 'INTEGRATION',
            'phase' => 1,
            'duration' => $this->grades['INTEGRATION']['duration'],
            'start_date' => now(),
            'end_date' => now()->addMonths($this->grades['INTEGRATION']['duration'])
        ];
    }


    protected function initiateStagiairePhase($startDate)
    {
        return [
            'type' => 'STAGE',
            'duration' => $this->grades['STAGE']['duration'],
            'start_date' => $startDate,
            'end_date' => Carbon::parse($startDate)->addMonths($this->grades['STAGE']['duration'])
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
        $grades = $this->grades['TITULARISATION']['grades'];
    
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
}

class ContratService
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
            'is_renouvele' => false
        ]);
    }

    protected function generateNumeroContrat()
    {
        $lastContract = Contrat::latest()->first();
        $lastNumber = $lastContract ? intval(substr($lastContract->numero_contrat, -4)) : 0;
        return 'CONT-' . str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
    }
}

class ArreteService
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

class AvancementService
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
        // Logique de calcul de l'indice basée sur le grade et l'échelon
        // À adapter selon les règles spécifiques de votre institution
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