<?php

namespace Database\Seeders;

use App\Models\Agent;
use App\Models\Contrat;
use App\Models\Arrete;
use App\Models\Avancement;
use App\Models\Grade;
use App\Service\CareerProgressionService;
use App\Service\ContratService;
use App\Service\ArreteService;
use App\Service\AvancementService;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CareerProgressionSeeder extends Seeder
{
    protected $careerProgressionService;
    protected $contratService;
    protected $arreteService;
    protected $avancementService;

    public function __construct(
        CareerProgressionService $careerProgressionService,
        ContratService $contratService,
        ArreteService $arreteService,
        AvancementService $avancementService
    ) {
        $this->careerProgressionService = $careerProgressionService;
        $this->contratService = $contratService;
        $this->arreteService = $arreteService;
        $this->avancementService = $avancementService;
    }

    public function run()
    {
        DB::beginTransaction();
        
        try {
            $agents = Agent::all();

            foreach ($agents as $agent) {
                $this->processAgentCareerProgression($agent);
            }

            DB::commit();
            $this->command->info('Career progression data seeded successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('Error seeding career progression data: ' . $e->getMessage());
        }
    }

    protected function processAgentCareerProgression($agent)
    {
        try {
            // 1. Initial Integration Phase
            $integrationProgression = $this->careerProgressionService->startIntegrationPhase($agent);
            
            // Create initial contract
            $initialContract = $this->contratService->createContrat(
                $agent,
                'INTEGRATION',  // Changed to uppercase to match the type used later
                $integrationProgression['start_date']
            );

            // Verify contract creation
            if (!$initialContract) {
                throw new \Exception("Failed to create initial contract for agent {$agent->id}");
            }

            // Create initial arrêté
            $initialArrete = $this->arreteService->createArrete(
                $initialContract,
                'INTEGRATION',
                $integrationProgression['start_date']
            );

            // Verify arrêté creation
            if (!$initialArrete) {
                throw new \Exception("Failed to create initial arrêté for agent {$agent->id}");
            }

            // Get initial grade
            $initialGrade = Grade::where('grade', '2eme classe')
                                ->where('echelon', 1)
                                ->first();

            if (!$initialGrade) {
                throw new \Exception("Initial grade not found for agent {$agent->id}");
            }

            // Create initial avancement
            $initialAvancement = $this->avancementService->createAvancement(
                $agent,
                $initialGrade,
                $initialArrete,
                $integrationProgression
            );

            // 2. Simulate Career Progression
            $this->simulateCareerProgression($agent);
        } catch (\Exception $e) {
            throw new \Exception("Error processing career progression for agent {$agent->id}: " . $e->getMessage());
        }
    }

    protected function simulateCareerProgression($agent)
    {
        // Simulate different career stages based on entry date
        $entryDate = Carbon::parse($agent->date_entree);
        $now = Carbon::now();
        $yearsSinceEntry = $entryDate->diffInYears($now);

        // Based on years of service, create appropriate progression
        if ($yearsSinceEntry >= 1) {
            $this->createProgressionPhase($agent, 'STAGE');
        }

        if ($yearsSinceEntry >= 2) {
            $this->createProgressionPhase($agent, 'TITULARISATION');
        }

        if ($yearsSinceEntry >= 4) {
            $this->createProgressionPhase($agent, 'AVANCEMENT');
        }
    }

    protected function createProgressionPhase($agent, $phase)
    {
        try {
            // Calculate next progression
            $progression = $this->careerProgressionService->calculateNextProgression($agent);

            // Create new contract
            $contract = $this->contratService->createContrat(
                $agent,
                $progression['type'],
                $progression['start_date']
            );

            if (!$contract) {
                throw new \Exception("Failed to create contract for progression phase {$phase}");
            }

            // Create corresponding arrêté
            $arrete = $this->arreteService->createArrete(
                $contract,
                $progression['type'],
                $progression['start_date']
            );

            if (!$arrete) {
                throw new \Exception("Failed to create arrêté for progression phase {$phase}");
            }

            // Get appropriate grade based on progression
            $grade = Grade::where('grade', $progression['grade'])
                         ->where('echelon', $progression['echelon'] ?? 1)
                         ->first();

            if (!$grade) {
                throw new \Exception("Grade not found for progression phase {$phase}");
            }

            // Create avancement
            $avancement = $this->avancementService->createAvancement(
                $agent,
                $grade,
                $arrete,
                $progression
            );

            // Update contract if needed
            if ($progression['type'] === 'TITULARISATION') {
                $contract->update([
                    'status' => 'en cours',
                    'is_renouvele' => true,
                    'date_renouvellement' => $progression['start_date']
                ]);
            }
        } catch (\Exception $e) {
            throw new \Exception("Error creating progression phase {$phase}: " . $e->getMessage());
        }
    }
}