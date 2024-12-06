<?php


namespace App\Http\Controllers;


use App\Models\Agent;
use App\Models\Categorie;
use App\Models\Reclassement;
use App\Service\Reclassements;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ReclassementController extends Controller
{
    private $reclassementService;

    public function __construct(Reclassements $reclassementService)
    {
        $this->reclassementService = $reclassementService;
    }

    /**
     * Page principale des reclassements
     */
    public function index()
    {
        return Inertia::render('Reclassement/Index', [
            'categories' => Categorie::select('id', 'nom')->get(),
            'initialAgents' => $this->reclassementService->obtenirAgentsEligibles()
                ->map(function ($agent) {
                    return [
                        'id' => $agent->id,
                        'nom' => $agent->nom,
                        'prenom' => $agent->prenom,
                        'categorie' => [
                            'id' => $agent->categorie->id,
                            'nom' => $agent->categorie->nom,
                        ],
                        'status' => $agent->status,
                        'date_entree' => $agent->date_entree,
                    ];
                }),
        ]);
    }

    /**
     * Liste des agents éligibles pour le reclassement (pour les mises à jour AJAX)
     */
    public function agentsEligibles()
    {
        try {
            $agents = $this->reclassementService->obtenirAgentsEligibles()
                ->load('categorie')
                ->map(function ($agent) {
                    return [
                        'id' => $agent->id,
                        'nom' => $agent->nom,
                        'prenom' => $agent->prenom,
                        'categorie' => [
                            'id' => $agent->categorie->id,
                            'nom' => $agent->categorie->nom,
                        ],
                        'status' => $agent->status,
                        'date_entree' => $agent->date_entree,
                    ];
                });

            // Returning agents list through Inertia
            return Inertia::render('Reclassement/AgentsEligibles', [
                'agents' => $agents,
            ]);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            // Instead of returning JSON, redirect with an error message
            return Inertia::render('Error', [
                'message' => 'Erreur lors de la récupération des agents éligibles.',
            ]);
        }
    }

    /**
     * Réaliser un reclassement
     */
    public function reclasser(Request $request, $agentId)
    {
        $request->validate([
            'nouvelle_categorie_id' => 'required|exists:categories,id',
        ]);

        try {
            $agent = Agent::findOrFail($agentId);
            $nouvelleCategorie = Categorie::findOrFail($request->nouvelle_categorie_id);

            $reclassement = $this->reclassementService->reclasserAgent($agent, $nouvelleCategorie);

            // Return a success message and data with Inertia
            return Inertia::render('Reclassement/Success', [
                'message' => "Agent reclassé avec succès.",
                'reclassement' => $reclassement->load('agent', 'ancienneCategorie', 'nouvelleCategorie')
            ]);

        } catch (\Exception $e) {
            Log::error($e->getMessage());
            // Returning error view on failure
            return Inertia::render('Error', [
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Historique des reclassements
     */
    public function historiquesReclassements(Request $request, $agentId = null)
    {
        try {
            if ($agentId) {
                $agent = Agent::with(['reclassements' => function ($query) {
                    $query->with('ancienneCategorie', 'nouvelleCategorie')
                        ->orderBy('date_reclassement', 'desc');
                }])->findOrFail($agentId);

                // Return history for a specific agent via Inertia
                return Inertia::render('Reclassement/Historiques', [
                    'agent' => [
                        'id' => $agent->id,
                        'nom' => $agent->nom,
                        'prenom' => $agent->prenom,
                    ],
                    'reclassements' => $agent->reclassements->map(function ($reclassement) {
                        return [
                            'id' => $reclassement->id,
                            'date_reclassement' => $reclassement->date_reclassement,
                            'ancienneCategorie' => [
                                'id' => $reclassement->ancienneCategorie->id,
                                'nom' => $reclassement->ancienneCategorie->nom,
                            ],
                            'nouvelleCategorie' => [
                                'id' => $reclassement->nouvelleCategorie->id,
                                'nom' => $reclassement->nouvelleCategorie->nom,
                            ],
                        ];
                    }),
                ]);
            }

            // Return the complete list of reclassments via Inertia
            $reclassements = Reclassement::with(['agent', 'ancienneCategorie', 'nouvelleCategorie'])
                ->orderBy('date_reclassement', 'desc')
                ->get()
                ->map(function ($reclassement) {
                    return [
                        'id' => $reclassement->id,
                        'date_reclassement' => $reclassement->date_reclassement,
                        'agent' => [
                            'id' => $reclassement->agent->id,
                            'nom' => $reclassement->agent->nom,
                            'prenom' => $reclassement->agent->prenom,
                        ],
                        'ancienneCategorie' => [
                            'id' => $reclassement->ancienneCategorie->id,
                            'nom' => $reclassement->ancienneCategorie->nom,
                        ],
                        'nouvelleCategorie' => [
                            'id' => $reclassement->nouvelleCategorie->id,
                            'nom' => $reclassement->nouvelleCategorie->nom,
                        ],
                    ];
                });

            return Inertia::render('Reclassement/Historiques', [
                'reclassements' => $reclassements,
            ]);

        } catch (\Exception $e) {
            Log::error($e->getMessage());
            // Return error view if something goes wrong
            return Inertia::render('Error', [
                'message' => 'Erreur lors de la récupération des historiques de reclassements.',
            ]);
        }
    }
}
