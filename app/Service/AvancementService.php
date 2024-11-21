<?php

namespace App\Service;

use App\Models\Agent;
use App\Models\Avancement;
use App\Models\Grade;
use App\Models\Arrete;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AvancementService
{
    // Detailed career progression stages
    protected $progressionStages = [
        'Category III' => [
            'integration_phase' => [
                'total_duration' => 72, // 6 years in months
                'contracts' => [
                    ['duration' => 24, 'contract_phase' => 1], // 2 years
                    ['duration' => 24, 'contract_phase' => 2], // 2 years
                    ['duration' => 24, 'contract_phase' => 3], // 2 years
                ],
            ],
            'advancement_path' => [
                ['grade' => 'Stagiaire', 'echelon' => 1, 'duration' => 12],
                ['grade' => '2eme classe', 'echelon' => 1, 'duration' => 24],
                ['grade' => '2eme classe', 'echelon' => 2, 'duration' => 24],
                ['grade' => '2eme classe', 'echelon' => 3, 'duration' => 36],
                ['grade' => '1er classe', 'echelon' => 1, 'duration' => 24],
                ['grade' => '1er classe', 'echelon' => 2, 'duration' => 24],
                ['grade' => '1er classe', 'echelon' => 3, 'duration' => 36],
                ['grade' => 'Principal', 'echelon' => 1, 'duration' => 24],
                ['grade' => 'Principal', 'echelon' => 2, 'duration' => 24],
                ['grade' => 'Principal', 'echelon' => 3, 'duration' => 36],
                ['grade' => 'Exceptionnel', 'echelon' => 1, 'duration' => 24],
                ['grade' => 'Exceptionnel', 'echelon' => 2, 'duration' => 24],
                ['grade' => 'Exceptionnel', 'echelon' => 3, 'duration' => 36],
            ],
        ],
        'Category IV' => [
            'integration_phase' => [
                'total_duration' => 72, // 6 years in months
            ],
            'advancement_path' => [
                ['grade' => 'Stagiaire', 'echelon' => 1, 'duration' => 12],
                ['grade' => '2eme classe', 'echelon' => 1, 'duration' => 24],
                ['grade' => '2eme classe', 'echelon' => 2, 'duration' => 24],
                ['grade' => '2eme classe', 'echelon' => 3, 'duration' => 24],
                ['grade' => '1ere classe', 'echelon' => 1, 'duration' => 24],
                ['grade' => '1ere classe', 'echelon' => 2, 'duration' => 24],
                ['grade' => '1ere classe', 'echelon' => 3, 'duration' => 36],
                ['grade' => 'Principal', 'echelon' => 1, 'duration' => 24],
                ['grade' => 'Principal', 'echelon' => 2, 'duration' => 24],
                ['grade' => 'Principal', 'echelon' => 3, 'duration' => 36],
                ['grade' => 'Exceptionnel', 'echelon' => 1, 'duration' => 24],
                ['grade' => 'Exceptionnel', 'echelon' => 2, 'duration' => 24],
                ['grade' => 'Exceptionnel', 'echelon' => 3, 'duration' => 36],
            ],
        ],
    ];
    

    /**
     * Find agents eligible for advancement
     */
    public function findEligibleAgents()
    {
        return Agent::where('is_active', true)
            ->with(['contrats', 'avancements', 'categorie'])
            ->get()
            ->filter(function ($agent) {
                // Determine eligibility based on recruitment type and current career stage
                $lastAdvancement = $agent->avancements()->latest()->first();

                // If no advancement history, check if ready for first advancement
                if (!$lastAdvancement) {
                    return $this->isReadyForFirstAdvancement($agent);
                }

                // Check progression based on recruitment type
                return $this->checkAdvancementEligibility($agent, $lastAdvancement);
            });
    }

    /**
     * Check if agent is ready for first advancement
     */
    protected function isReadyForFirstAdvancement(Agent $agent)
    {
        // Logic to check if agent has completed initial contract phase
        $activeContract = $agent->contrats()->where('status', 'en cours')->first();

        if (!$activeContract) return false;

        // Check contract duration and type
        $contractDuration = Carbon::parse($activeContract->date_debut)->diffInMonths(now());

        return $contractDuration >= 24; // Ready after first 24-month contract
    }

    /**
     * Detailed eligibility check for advancement
     */
    protected function checkAdvancementEligibility(Agent $agent, $lastAdvancement)
    {
        // Get progression path based on recruitment type
        $progressionPath = $this->getProgressionPath($agent);

        // Find current stage in progression
        $currentStage = $this->findCurrentStage($agent, $progressionPath);

        if (!$currentStage) return false;

        // Check if sufficient time has passed since last advancement
        $timeSinceLastAdvancement = Carbon::parse($lastAdvancement->date_effet)
            ->diffInMonths(now());

        return $timeSinceLastAdvancement >= $currentStage['duration'];
    }

    /**
     * Determine progression path based on recruitment type
     */
    protected function getProgressionPath(Agent $agent)
    {
        // Logic to select correct progression path
        if ($agent->type_recrutement === 'diplome') {
            return array_merge(...array_column($this->progressionStages['Category IV'], 'stages'));
        }

        // Default to category 3
        return $this->progressionStages['Category III']['advancement_path'];
    }

    /**
     * Find current stage in career progression
     */
    protected function findCurrentStage(Agent $agent, $progressionPath)
    {
        $lastAdvancement = $agent->avancements()->latest()->first();
    
        if (!$lastAdvancement) {
            // Return first stage if no advancement history
            return $progressionPath[0] ?? null;
        }
    
        // Find current stage based on last advancement
        $currentStageIndex = array_search(
            $lastAdvancement->grade,
            array_column($progressionPath, 'grade')
        );
    
        // Ensure next stage exists
        if ($currentStageIndex === false || !isset($progressionPath[$currentStageIndex + 1])) {
            return null;
        }
    
        // Return next stage if found
        return $progressionPath[$currentStageIndex + 1];
    }
    

    /**
     * Process advancements for selected agents
     */
    public function processAdvancements(array $agentData)
    {
        $results = [];

        DB::beginTransaction();
        try {
            foreach ($agentData as $agentInfo) {
                $agent = Agent::findOrFail($agentInfo['id']);

                if ($agentInfo['approved']) {
                    // Determine next stage
                    $progressionPath = $this->getProgressionPath($agent);
                    $nextStage = $this->findCurrentStage($agent, $progressionPath);

                    if (!$nextStage) {
                        // No more advancements possible
                        continue;
                    }

                    $grade = Grade::where('grade', $nextStage['grade'])->first();

                    if (!$grade) {
                        throw new \Exception("Grade '{$nextStage['grade']}' not found.");
                    }
                     // Create corresponding arrêté
                    $arrete = Arrete::create([
                        'contrat_id' => $agent->contrats()->where('status', 'en cours')->first()->id,
                        'numero_arrete' => 'AVA-' . now()->format('Ymd') . '-' . $agent->id,
                        'date_arrete' => now(),
                        'date_effet' => now(),
                        'type_arrete' => 'AVANCEMENT',
                        'objet' => "Avancement au grade {$nextStage['grade']} pour {$agent->nom} {$agent->prenom}",
                        'signataire' => 'Directeur des Ressources Humaines'
                    ]);

                    // Create advancement record
                    $advancement = Avancement::create([
                        'agent_id' => $agent->id,
                        'grade_id' => $grade->id, // Assign the grade ID here
                        'arrete_id' => $arrete->id,
                        'date_debut' => now(),
                        'date_effet' => now(),
                        'date_fin' => now()->addMonths($nextStage['duration']),
                        'duree_mois' => $nextStage['duration'],
                        'status' => 'integrated',
                        'echelon' => $this->extractEchelon($nextStage['grade'])
                    ]);

                   

                    $results[] = [
                        'agent_id' => $agent->id,
                        'status' => 'Advanced',
                        'new_grade' => $nextStage['grade']
                    ];
                }
            }

            DB::commit();
            return $results;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Extract echelon from grade string
     */
    protected function extractEchelon(string $grade)
    {
        // Extract echelon number from grade string
        preg_match('/(\d+)(?:er|eme)? échelon/', $grade, $matches);
        return $matches[1] ?? 1;
    }
}
