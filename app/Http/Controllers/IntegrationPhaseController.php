<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Agent;
use App\Service\Carrer;
use Illuminate\Http\Request;

class IntegrationPhaseController extends Controller
{
    protected $carrerService;

    public function __construct(Carrer $carrerService)
    {
        $this->carrerService = $carrerService;
    }

    public function index()
    {
        $agents = Agent::with(['contrats', 'categorie'])
            ->whereHas('contrats', function ($query) {
                $query->where('type', 'like', '%integration%');
            })
            ->get()
            ->map(function ($agent) {
                $progression = $this->carrerService->calculateNextProgression($agent);
                return [
                    'id' => $agent->id,
                    'nom' => $agent->nom,
                    'prenom' => $agent->prenom,
                    'categorie' => $agent->categorie->nom,
                    'phase_integration' => $progression['phase'] ?? null,
                    'date_debut' => $progression['start_date'] ?? null,
                    'date_fin' => $progression['end_date'] ?? null,
                ];
            });

        return Inertia::render('IntegrationPhase/Index', [
            'agents' => $agents
        ]);
    }

    public function show(Agent $agent)
    {
        $progression = $this->carrerService->calculateNextProgression($agent);
        
        return Inertia::render('IntegrationPhase/Show', [
            'agent' => $agent->load(['contrats', 'categorie']),
            'progression' => $progression
        ]);
    }

    public function update(Request $request, Agent $agent)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'commentaires' => 'nullable|string',
        ]);

        // Logique de mise à jour de la phase d'intégration
        // Vous pourriez créer un nouvel enregistrement ou mettre à jour l'existant
        $agent->integrationPhases()->create([
            'status' => $validated['status'],
            'commentaires' => $validated['commentaires'] ?? null,
        ]);

        return back()->with('success', 'Phase d\'intégration mise à jour');
    }
}