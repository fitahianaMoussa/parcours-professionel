<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use App\Models\Grade;
use App\Service\ArreteService;
use App\Service\AvancementService;
use App\Service\CareerProgressionService;
use App\Service\ContratService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class CareerManagementController extends Controller
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

    public function index()
    {
        $agents = Agent::with(['contrats' => function($query) {
            $query->latest()->first();
        }, 'avancements' => function($query) {
            $query->latest()->first();
        }])->paginate(10);

        $agents->transform(function($agent) {
            $nextProgression = $this->careerProgressionService->calculateNextProgression($agent);
            return [
                ...$agent->toArray(),
                'next_progression' => $nextProgression,
                'days_until_next_progression' => Carbon::parse($nextProgression['end_date'])->diffInDays(now())
            ];
        });

        return Inertia::render('CareerManagement/Index', [
            'agents' => $agents,
        ]);
    }

    public function show(Agent $agent)
    {
        $agent->load(['contrats', 'avancements.arrete', 'avancements.grade']);
        $nextProgression = $this->careerProgressionService->calculateNextProgression($agent);

        return Inertia::render('CareerManagement/Show', [
            'agent' => $agent,
            'next_progression' => $nextProgression,
            'career_timeline' => $this->generateCareerTimeline($agent)
        ]);
    }

    public function processProgression(Agent $agent)
    {
        try {
            $progression = $this->careerProgressionService->calculateNextProgression($agent);
            
            // Créer le nouveau contrat
            $contrat = $this->contratService->createContrat(
                $agent,
                $progression['type'],
                $progression['start_date']
            );

            // Créer l'arrêté
            $arrete = $this->arreteService->createArrete(
                $contrat,
                $progression['type'],
                $progression['start_date']
            );

            // Créer l'avancement
            $grade = $this->determineGrade($progression);
            $avancement = $this->avancementService->createAvancement(
                $agent,
                $grade,
                $arrete,
                $progression
            );

            return redirect()->back()->with('success', 'Progression de carrière traitée avec succès');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erreur lors du traitement de la progression: ' . $e->getMessage());
        }
    }

    protected function generateCareerTimeline(Agent $agent)
    {
        $timeline = collect();
        
        foreach ($agent->avancements as $avancement) {
            $timeline->push([
                'date' => $avancement->date_debut,
                'type' => $avancement->is_integration ? 'INTEGRATION' : 'AVANCEMENT',
                'title' => $this->generateTimelineTitle($avancement),
                'details' => [
                    'grade' => $avancement->grade->nom,
                    'echelon' => $avancement->echelon,
                    'index' => $avancement->index_value,
                    'arrete' => $avancement->arrete->numero_arrete
                ]
            ]);
        }

        return $timeline->sortByDesc('date')->values();
    }

    protected function generateTimelineTitle($avancement)
    {
        if ($avancement->is_integration) {
            return "Intégration - Phase " . $avancement->contract_phase;
        }
        
        return "Avancement au grade " . $avancement->grade->nom . 
               " échelon " . $avancement->echelon;
    }

    protected function determineGrade($progression)
    {
        // Logique pour déterminer le grade en fonction de la progression
        return Grade::where('grade', $progression['grade'] ?? '2eme_classe')->first();
    }
}