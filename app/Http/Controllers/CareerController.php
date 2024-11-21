<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use App\Service\ArreteCarrerService;
use App\Service\AvancementCarrerService;
use App\Service\Carrer;
use App\Service\ContratCarrerService;
use Inertia\Inertia;

class CareerController extends Controller
{
    protected $careerProgressionService;
    protected $arreteService;
    protected $contratService;
    protected $avancementService;
    
    public function __construct(
        Carrer $careerProgressionService,
        ArreteCarrerService $arreteService,
        ContratCarrerService $contratService,
        AvancementCarrerService $avancementService
    ) {
        $this->careerProgressionService = $careerProgressionService;
        $this->arreteService = $arreteService;
        $this->contratService = $contratService;
        $this->avancementService = $avancementService;
    }
    
    public function dashboard(Agent $agent)
    {
        $nextProgression = $this->careerProgressionService->calculateNextProgression($agent);
        $careerPaths = $this->careerProgressionService->careerPaths;
        
        return Inertia::render('CareerManagement/Career', [
            'agent' => $agent->load(['contrats', 'avancements','categorie']),
            'progression' => $nextProgression,
           'careerPaths' => $careerPaths
        ]);
    }
}