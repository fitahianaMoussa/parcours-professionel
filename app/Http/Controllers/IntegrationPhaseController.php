<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Agent;
use App\Service\Carrer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IntegrationPhaseController extends Controller
{
    protected $carrerService;

    public function __construct(Carrer $carrerService)
    {
        $this->carrerService = $carrerService;
        $this->middleware('auth'); // 1: Se connecter
    }

  
   

    /**
     * 1.3: Afficher l'interface de gestion de l'integration
     */
    public function index()
    {
       
        // 1.2: Authentification reussie est implicite car middleware auth

        // 1.3: Afficher l'interface de gestion de l'integration
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

    /**
     * 1.4.2: Afficher les details de l'integration
     */
    public function show(Agent $agent)
    {
        // 1.4: Selectionner un employe pour suivre son integration
        // 1.4.1: Rechercher les details de l'integration de l'employe
        $progression = $this->carrerService->calculateNextProgression($agent);
        
        // Vérifier les périodes de stagiarisation
        $stagiarisationInfo = $this->verifierPeriodesStagiarisation($agent);
        
        return Inertia::render('IntegrationPhase/Show', [
            'agent' => $agent->load(['contrats', 'categorie']),
            'progression' => $progression,
            'stagiarisation' => $stagiarisationInfo
        ]);
    }

    /**
     * 2: Mettre à jour le status de l'integration et les informations associées
     */
    public function update(Request $request, Agent $agent)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'commentaires' => 'nullable|string',
        ]);

        // 2.1: Mettre à jours les informations d'integration
        $result = $agent->integrationPhases()->create([
            'status' => $validated['status'],
            'commentaires' => $validated['commentaires'] ?? null,
            'updated_by' => Auth::id()
        ]);

        // 2.2: Notification de mise à jour reussie
        if ($result) {
            return back()->with('success', 'Phase d\'intégration mise à jour avec succès');
        }

        return back()->with('error', 'Erreur lors de la mise à jour de la phase d\'intégration');
    }

    /**
     * 3.1: Verifier les periodes de stagiarisation
     */
    protected function verifierPeriodesStagiarisation(Agent $agent)
{
    // Récupérer les contrats de type 'stage'
    $periodesStage = $agent->contrats()
        ->where('type', 'stage')
        ->orderBy('date_debut')
        ->get();

    // Calculer la durée totale en fonction des dates de début et de fin
    $dureeTotale = $periodesStage->reduce(function ($total, $contrat) {
        $dateFin = $contrat->date_fin ?? now();
        return $total + $contrat->date_debut->diffInDays($dateFin);
    }, 0);

    return [
        'periodes' => $periodesStage,
        'duree_totale' => $dureeTotale,
    ];
}


    /**
     * 3.2: Afficher les informations de stagiarisation
     */
    public function showStagiarisation(Agent $agent)
    {
        $stagiarisationInfo = $this->verifierPeriodesStagiarisation($agent);
        
        return Inertia::render('IntegrationPhase/StagairisationView', [
            'agent' => $agent,
            'stagiarisation' => $stagiarisationInfo
        ]);
    }
}