<?php

namespace App\Console\Commands;

use App\Models\Agent;
use App\Service\CareerProgressionService;
use Illuminate\Console\Command;

class ProcessCareerProgressionCommand extends Command
{
    protected $signature = 'career:process {agentId}';
    protected $description = 'Traiter l\'avancement de carrière d\'un agent';

    protected $careerProgressionService;

    // Injection du service dans la commande
    public function __construct(CareerProgressionService $careerProgressionService)
    {
        parent::__construct();
        $this->careerProgressionService = $careerProgressionService;
    }

    public function handle()
    {
        $agentId = $this->argument('agentId');
        $agent = Agent::findOrFail($agentId);

        try {
            $this->careerProgressionService->processCareerProgression($agent);
            $this->info('Avancement de carrière traité avec succès.');
        } catch (\Exception $e) {
            $this->error('Erreur lors du traitement de l\'avancement : ' . $e->getMessage());
        }
    }
}

