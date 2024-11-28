<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use App\Service\CareerProcessorService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class CareerProcessorController extends Controller
{
    private CareerProcessorService $careerService;

    public function __construct(CareerProcessorService $careerService)
    {
        $this->careerService = $careerService;
    }

    /**
     * Page principale de gestion de carrière
     */
    public function index($agentId)
    {
        try {
            $agent = Agent::findOrFail($agentId);
            
            return Inertia::render('Career/Index', [
                'agent' => $agent,
                'careerSummary' => $this->getFormattedCareerSummary($agent),
                'advancements' => $this->getFormattedAdvancements($agent),
                'contracts' => $this->getFormattedContracts($agent),
                'pageTitle' => "Gestion de carrière - {$agent->nom} {$agent->prenom}"
            ]);
            
        } catch (\Exception $e) {
            Log::error('Erreur lors du chargement de la page de carrière', [
                'agent_id' => $agentId,
                'error' => $e->getMessage()
            ]);

            
        }
    }

     /**
     * Récupération du résumé de carrière
     */
    public function getCareerSummary(Agent $agent): array
    {
        $summary = $this->careerService->getCareerSummary($agent);
        
        return [
            'debut_carriere' => Carbon::parse($summary['debut_carriere'])->format('d/m/Y'),
            'annees_service' => $summary['annees_service'],
            'grade_actuel' => $summary['grade_actuel'],
            'indice_actuel' => $summary['indice_actuel'],
            'status_actuel' => $summary['status_actuel'],
            'total_contrats' => $summary['contrats'],
            'total_avancements' => $summary['avancements']
        ];
    }

    /**
     * Traitement de la carrière avec retour Inertia
     */
    public function processCareer(Request $request, $agentId)
    {
        try {
            $agent = Agent::findOrFail($agentId);

            if (!$agent->date_entree) {
                return back()->with('error', "La date d'entrée de l'agent est requise");
            }

           
            // Traitement de la carrière
            $this->careerService->processFullCareer($agent);

            // Rechargement des données mises à jour
            $updatedData = [
                'careerSummary' => $this->getFormattedCareerSummary($agent),
                'advancements' => $this->getFormattedAdvancements($agent),
                'contracts' => $this->getFormattedContracts($agent),
            ];

            return back()->with('success', 'Carrière traitée avec succès')
                        ->with('data', $updatedData);

        } catch (\Exception $e) {
            Log::error('Erreur lors du traitement de la carrière', [
                'agent_id' => $agentId,
                'error' => $e->getMessage()
            ]);

            return back()->with('error', 'Erreur lors du traitement de la carrière');
        }
    }

    /**
     * Récupération du résumé formaté
     */
    public function getFormattedCareerSummary(Agent $agent): array
    {
        $summary = $this->careerService->getCareerSummary($agent);
        
        return [
            'debut_carriere' => Carbon::parse($summary['debut_carriere'])->format('d/m/Y'),
            'annees_service' => $summary['annees_service'],
            'grade_actuel' => $summary['grade_actuel'],
            'indice_actuel' => $summary['indice_actuel'],
            'status_actuel' => $summary['status_actuel'],
            'total_contrats' => $summary['contrats'],
            'total_avancements' => $summary['avancements']
        ];
    }

    /**
     * Récupération des avancements formatés
     */
    private function getFormattedAdvancements(Agent $agent): array
    {
        return $agent->avancements()
            ->with(['grade', 'arrete'])
            ->orderBy('date_debut')
            ->get()
            ->map(function ($avancement) {
                return [
                    'id' => $avancement->id,
                    'type' => $avancement->is_integration ? 'Intégration' : 'Avancement',
                    'grade' => $avancement->grade->grade,
                    'echelon' => $avancement->echelon,
                    'date_debut' => Carbon::parse($avancement->date_debut)->format('d/m/Y'),
                    'date_fin' => $avancement->date_fin ? Carbon::parse($avancement->date_fin)->format('d/m/Y') : null,
                    'duree_mois' => $avancement->duree_mois,
                    'arrete' => [
                        'numero' => $avancement->arrete->numero_arrete,
                        'date' => Carbon::parse($avancement->arrete->date_arrete)->format('d/m/Y')
                    ]
                ];
            })
            ->toArray();
    }

    /**
     * Récupération des contrats formatés
     */
    private function getFormattedContracts(Agent $agent): array
    {
        return $agent->contrats()
            ->orderBy('numero_contrat')
            ->get()
            ->map(function ($contrat) {
                return [
                    'id' => $contrat->id,
                    'numero' => $contrat->numero_contrat,
                    'type' => $contrat->type,
                    'date_debut' => Carbon::parse($contrat->date_debut)->format('d/m/Y'),
                    'date_fin' => $contrat->date_fin ? Carbon::parse($contrat->date_fin)->format('d/m/Y') : null,
                    'status' => $this->getStatusLabel($contrat->status),
               
                ];
            })
            ->toArray();
    }

    /**
     * Obtenir le libellé du statut
     */
    private function getStatusLabel(string $status): string
    {
        return match($status) {
            'active' => 'Actif',
            'terminated' => 'Terminé',
            'suspended' => 'Suspendu',
            default => 'Inconnu'
        };
    }

    
    
}