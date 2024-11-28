<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use App\Models\Contrat;
use App\Service\ContratService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContractController extends Controller
{
    protected $contractService;

    public function __construct(ContratService $contractService)
    {
        $this->contractService = $contractService;
    }

    /**
     * Display the contract dashboard for an agent.
     *
     * @param int $agentId
     * @return \Inertia\Response
     */
    public function index($agentId)
    {
        $agent = Agent::with(['contrats', 'avancements'])
            ->findOrFail($agentId);

        return Inertia::render('Agent/AgentDashboard', [
            'agent' => $agent,
            'flash' => session('flash') ?? [],
        ]);
    }

    /**
     * Create initial contracts for a new agent.
     *
     * @param Request $request
     * @param int $agentId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function createInitialContracts(Request $request, $agentId)
    {
        
        $request->validate([
            'date_entree' => 'required|date',
            'categorie_id' => 'required|integer',
        ]);
      
        $agent = Agent::findOrFail($agentId);
       
        try {
        
          $agent = $this->contractService->createInitialContracts($agent);
            //dd($agent);
            return redirect()->route('contracts.index', $agentId)->with('flash', [
                'success' => 'Les contrats initiaux ont été créés avec succès.',
            ]);
        } catch (\Exception $e) {
            return redirect()->route('contracts.index', $agentId)->with('flash', [
                'error' => 'Erreur lors de la création des contrats: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Handle contract renewal.
     *
     * @param Request $request
     * @param int $contractId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function renewContract(Request $request, $contractId)
    {
        $contract = Contrat::findOrFail($contractId);

        try {
            $this->contractService->handleContractRenewal($contract);
            return redirect()->route('contracts.index', $contract->agent_id)->with('flash', [
                'success' => 'Le contrat a été renouvelé avec succès.',
            ]);
        } catch (\Exception $e) {
            return redirect()->route('contracts.index', $contract->agent_id)->with('flash', [
                'error' => 'Erreur lors du renouvellement du contrat: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Handle advancements for an agent.
     *
     * @param Request $request
     * @param int $agentId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function advanceAgent(Request $request, $agentId)
    {
        $agent = Agent::findOrFail($agentId);

        try {
            if ($this->contractService->handleAdvancement($agent)) {
                return redirect()->route('contracts.index', $agentId)->with('flash', [
                    'success' => 'L\'avancement a été effectué avec succès.',
                ]);
            } else {
                return redirect()->route('contracts.index', $agentId)->with('flash', [
                    'error' => 'Aucun avancement n\'a été effectué.',
                ]);
            }
        } catch (\Exception $e) {
            return redirect()->route('contracts.index', $agentId)->with('flash', [
                'error' => 'Erreur lors de l\'avancement: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Handle contract transition after integration.
     *
     * @param Request $request
     * @param int $agentId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function transitionPostIntegration(Request $request, $agentId)
    {
        $agent = Agent::findOrFail($agentId);

        try {
            $this->contractService->handlePostIntegrationPhase($agent);
            return redirect()->route('contracts.index', $agentId)->with('flash', [
                'success' => 'La phase post-intégration a été gérée avec succès.',
            ]);
        } catch (\Exception $e) {
            return redirect()->route('contracts.index', $agentId)->with('flash', [
                'error' => 'Erreur lors de la gestion de la phase post-intégration: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Check and update the salary index for an agent.
     *
     * @param Request $request
     * @param int $agentId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateSalaryIndex(Request $request, $agentId)
    {
        $agent = Agent::findOrFail($agentId);

        try {
            if ($this->contractService->checkAndUpdateSalaryIndex($agent)) {
                return redirect()->route('contracts.index', $agentId)->with('flash', [
                    'success' => 'L\'indice salarial a été mis à jour avec succès.',
                ]);
            } else {
                return redirect()->route('contracts.index', $agentId)->with('flash', [
                    'error' => 'Aucune mise à jour de l\'indice salarial n\'était nécessaire.',
                ]);
            }
        } catch (\Exception $e) {
            return redirect()->route('contracts.index', $agentId)->with('flash', [
                'error' => 'Erreur lors de la mise à jour de l\'indice salarial: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Handle the reclassification of an agent.
     *
     * @param Request $request
     * @param int $agentId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function reclassifyAgent(Request $request, $agentId)
    {
        $request->validate([
            'nouvelle_categorie' => 'required|integer',
        ]);

        $agent = Agent::findOrFail($agentId);
        $newCategory = $request->input('nouvelle_categorie');

        try {
            if ($this->contractService->handleReclassement($agent, $newCategory)) {
                return redirect()->route('contracts.index', $agentId)->with('flash', [
                    'success' => 'L\'agent a été reclassé avec succès.',
                ]);
            } else {
                return redirect()->route('contracts.index', $agentId)->with('flash', [
                    'error' => 'Erreur lors du reclassement de l\'agent.',
                ]);
            }
        } catch (\Exception $e) {
            return redirect()->route('contracts.index', $agentId)->with('flash', [
                'error' => 'Erreur lors de la gestion du reclassement: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Check advancement eligibility for an agent.
     *
     * @param int $agentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkAdvancementEligibility($agentId)
    {
        $agent = Agent::findOrFail($agentId);

        $isEligible = $this->contractService->checkAdvancementEligibility($agent);

        return response()->json(['eligible' => $isEligible]);
    }

    /**
     * Get remaining duration of the current phase for an agent.
     *
     * @param int $agentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRemainingDuration($agentId)
    {
        $agent = Agent::findOrFail($agentId);
        $remainingDuration = $this->contractService->getRemainingDuration($agent);

        return response()->json(['remaining_duration' => $remainingDuration]);
    }


    public function testCareerPath($agentId)
    {
        // Trouver l'agent par ID
        $agent = Agent::find($agentId);

        if ($agent) {
            // Appeler la méthode pour traiter le parcours de carrière de l'agent
            try {
                $this->contractService->processCompleteCareerPath($agent);

                return response()->json([
                    'message' => 'Le parcours de carrière a été traité avec succès pour l\'agent ' . $agent->name,
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'error' => 'Une erreur est survenue lors du traitement du parcours de carrière.',
                    'details' => $e->getMessage(),
                ], 500);
            }
        } else {
            return response()->json([
                'error' => 'Agent non trouvé.',
            ], 404);
        }
    }
}